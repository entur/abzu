const fs = require('fs');
var globSync = require('glob').sync;
var path = require('path');
const axios = require('axios');
var bodyParser = require('body-parser');
const convictConfig = require('./src/config/convict.js');
const getRouteEntries = require('./src/routes/entries').getRouteEntries;

const configureApp = async (app) => {
  const convict = await convictConfig;

  const ENDPOINTBASE = convict.get('endpointBase');
  console.info('ENDPOINTBASE is set to', ENDPOINTBASE);

  app.use(bodyParser.json());

  const createKeyCloakConfig = authServerUrl => {
    let config = {
      realm: convict.get('authRealmName'),
      'tokens-not-before': 1490857383,
      'public-client': true,
      'auth-server-url': authServerUrl,
      resource: 'neti-frontend'
    };
    fs.writeFileSync(
      './src/config/keycloak.json',
      JSON.stringify(config),
      'utf8'
    );
  };

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
        mapboxTariffZonesStyle: convict.get("mapboxTariffZonesStyle"),
        mapboxAccessToken: convict.get("mapboxAccessToken"),
        sentryDSN: convict.get('sentryDSN')
      };

      createKeyCloakConfig(convict.get('authServerUrl'));

      res.send(cfg);
    }
  );

  app.get(ENDPOINTBASE + 'config/keycloak.json', function(req, res) {
    res.sendFile(__dirname + '/src/config/keycloak.json');
  });

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

};



module.exports = { configureApp };
