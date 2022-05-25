/*
 * Licensed under the EUPL, Version 1.2 or – as soon they will be approved by
 * the European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy of the Licence at:
 *
 *   https://joinup.ec.europa.eu/software/page/eupl
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the Licence is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the Licence for the specific language governing permissions and
 * limitations under the Licence.
 *
 */

const fs = require('fs');
const globSync = require('glob').sync;
const path = require('path');
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const convictConfig = require('./src/config/convict.js');
const getRouteEntries = require('./src/routes/entries').getRouteEntries;
const fallback = require('express-history-api-fallback');

const contentRoot = path.resolve(process.env.CONTENT_BASE || './build');

const configureApp = async (app) => {
  const convict = await convictConfig;

  const ENDPOINTBASE = convict.get('endpointBase');
  console.info('ENDPOINTBASE is set to', ENDPOINTBASE);

  app.use(bodyParser.json());

  const getTranslations = req => {
    const supportedLanguages = ['en', 'nb', 'fr', 'sv'];

    const translations = globSync(__dirname + '/src/static/lang/*.json')
      .map(filename => [
        path.basename(filename, '.json'),
        fs.readFileSync(filename, 'utf8')
      ])
      .reduce((messages, [namespace, collection]) => {
        messages[namespace] = collection;
        return messages;
      }, {});

    let locale = 'en'; // i.e. fallback language

    if (
      typeof req.query.locale !== 'undefined' &&
      supportedLanguages.indexOf(req.query.locale) > -1
    ) {
      locale = req.query.locale;
    } else {
      if (req.acceptsLanguages()) {
        for (let i = 0; i < req.acceptsLanguages().length; i++) {
          if (translations[req.acceptsLanguages()[i]]) {
            locale = req.acceptsLanguages()[i];
            break;
          }
        }
      }
    }

    return {
      locale: locale,
      messages: translations[locale]
    };
  };

  app.get(ENDPOINTBASE + 'token', (req, res) => {
    const remoteAddress =
      req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    axios
      .post(
        `http://gatekeeper1.geonorge.no/BaatGatekeeper/gktoken?ip=${remoteAddress}&min=400`
      )
      .then(gkt => {
        res.send({
          gkt: gkt.data,
          expires: new Date(Date.now() + 60 * 1000 * 399).getTime()
        });
      });
  });

  const configEndpoints = getRouteEntries(ENDPOINTBASE, '/config.json');

  app.get(
    [ENDPOINTBASE + 'config.json', [...configEndpoints]],
    function(req, res) {

      const cfg = {
        tiamatBaseUrl: convict.get('tiamatBaseUrl'),
        endpointBase: convict.get('endpointBase'),
        OTPUrl: convict.get('OTPUrl'),
        tiamatEnv: convict.get('tiamatEnv'),
        netexPrefix: convict.get('netexPrefix'),
        // Pod ID used in req header for Tiamat
        hostname: process.env.HOSTNAME,
        sentryDSN: convict.get('sentryDSN'),
        googleApiKey: convict.get('googleApiKey'),
        auth0Domain: convict.get('auth0Domain'),
        auth0ClientId: convict.get('auth0ClientId'),
        auth0Audience: convict.get('auth0Audience'),
        auth0ClaimsNamespace: convict.get('auth0ClaimsNamespace'),
      };

      res.send(cfg);
    }
  );

  app.get(ENDPOINTBASE + '_health', function(req, res) {
    res.sendStatus(200);
  });

  app.post(ENDPOINTBASE + 'timeOffset', function(req, res) {
    if (req.body.clientTime) {
      res.send({
        offset: new Date().getTime() - req.body.clientTime,
      });
    } else {
      res.sendStatus(400);
    }
  });

  const translationEndpoints = getRouteEntries(ENDPOINTBASE, '/translation.json');

  app.get(
    [
      ENDPOINTBASE + 'translation.json',
      [...translationEndpoints]
    ],
    function(req, res) {
      let translations = getTranslations(req);
      res.send(translations);
    }
  );

  app.use(ENDPOINTBASE, express.static(contentRoot))

  app.use(ENDPOINTBASE, fallback('index.html', { root: contentRoot }))
  .use((err, req, res, next) => {
    console.log(`Request to ${req.url} failed: ${err.stack}`);
    next(err);
  });

  app.use(ENDPOINTBASE, (err, req, res, next) => {
    res.status(500);
    res.send({
      code: 'INTERNAL_ERROR',
      message: 'Ooops. Something broke back here. Sorry!'
    });
  });

  return app;
};



module.exports = { configureApp };
