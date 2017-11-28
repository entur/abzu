var webpack = require('webpack');
var convictPromise = require('./config/convict.js');
var express = require('express');
var app = new express();
var port = process.env.port || 8988;
var globSync = require('glob').sync;
var path = require('path');
var fs = require('fs');
var axios = require('axios');
var introspectionQuery = require('./graphql/introspection').introspectionQuery;
var bodyParser = require('body-parser');
const Routes = require('./routes/');
const getRouteEntries = require('./routes/entries').getRouteEntries;


convictPromise
  .then(convict => {

    const ENDPOINTBASE = convict.get('endpointBase');
    console.info('ENDPOINTBASE is set to', ENDPOINTBASE);

    const assetsEndpoints = getRouteEntries(ENDPOINTBASE, '/public/');

    app.use(
      [ENDPOINTBASE + 'public/', ...assetsEndpoints],
      express.static(__dirname + '/public')
    );

    app.use(bodyParser.json());

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

    if (process.env.NODE_ENV !== 'production') {
      let config = require('./webpack.dev.config');

      config.output.publicPath = ENDPOINTBASE + 'public/';

      var compiler = new webpack(config);

      app.use(
        require('webpack-dev-middleware')(compiler, {
          noInfo: true,
          publicPath: config.output.publicPath,
          stats: { colors: true }
        })
      );

      app.use(require('webpack-hot-middleware')(compiler));
    } else {
      // expose build bundle for production
      app.get(ENDPOINTBASE + 'public/bundle.js', function(req, res) {
        res.sendFile(__dirname + '/public/bundle.js');
      });

      app.get(ENDPOINTBASE + 'public/react.bundle.js', function(req, res) {
        res.sendFile(__dirname + '/public/react.bundle.js');
      });
    }

    const configEndpoints = getRouteEntries(ENDPOINTBASE, '/config.json');

    app.get(
      [ENDPOINTBASE + 'config.json', [...configEndpoints]],
      function(req, res) {

        var cfg = {
          tiamatBaseUrl: convict.get('tiamatBaseUrl'),
          endpointBase: convict.get('endpointBase'),
          OSMUrl: convict.get('OSMUrl'),
          tiamatEnv: convict.get('tiamatEnv'),
          // Pod ID used in req header for Tiamat
          hostname: process.env.HOSTNAME
        };

        createKeyCloakConfig(convict.get('authServerUrl'));

        res.send(cfg);
      }
    );

    app.get(ENDPOINTBASE + Routes.STOP_PLACE + '/:id', function(req, res) {
      res.send(getPage());
    });

    app.get(ENDPOINTBASE + Routes.GROUP_OF_STOP_PLACE + '/:id', function(req, res) {
      res.send(getPage());
    });

    app.get(ENDPOINTBASE + 'reports', function(req, res) {
      res.send(getPage());
    });

    app.get(ENDPOINTBASE + '_health', function(req, res) {
      res.sendStatus(200);
    });

    app.get(ENDPOINTBASE + 'config/keycloak.json', function(req, res) {
      res.sendFile(__dirname + '/config/keycloak.json');
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

    app.get(ENDPOINTBASE + 'static/icons/svg-sprite.svg', function(req, res) {
      res.sendFile(__dirname + '/static/icons/svg-sprite.svg');
    });

    app.get(ENDPOINTBASE, function(req, res) {
      res.send(getPage());
    });

    app.get(ENDPOINTBASE + '*', function(req, res) {
      res.redirect(ENDPOINTBASE);
    });

    const fetch = require('graphql-fetch')(convict.get('tiamatBaseUrl'));

    fetch(introspectionQuery).then(response => {

      fs.writeFileSync(
        './graphql/schema.json',
        JSON.stringify(response.data),
        'utf8'
      );

      app.listen(port, function(error) {
        if (error) {
          console.error(error);
        } else {
          console.info(
            '==> Listening on port %s. Open up http://localhost:%s%s in your browser.',
            port,
            port,
            ENDPOINTBASE
          );
        }
      });
    }).catch( err => {
      console.log("Unable to fetch schema, server exited with error");
      process.exit(1);
    });


    const createKeyCloakConfig = authServerUrl => {
      let config = {
        realm: 'rutebanken',
        'tokens-not-before': 1490857383,
        'public-client': true,
        'auth-server-url': authServerUrl,
        resource: 'neti-frontend'
      };
      fs.writeFileSync(
        './config/keycloak.json',
        JSON.stringify(config),
        'utf8'
      );
    };

    const getTranslations = req => {
      const supportedLanguages = ['en', 'nb', 'fr'];

      const translations = globSync(__dirname + '/static/lang/*.json')
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

    const getPage = () =>
      `<html>
      <head>
        <title>Stop places</title>
        <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/leaflet/1.2.0/leaflet.css">
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body>
        <div id="root">
        </div>
        ${getBundles()}
      </body>
    </html>`;

    const getBundles = () => {
      if (process.env.NODE_ENV === 'production') {
        return `
        <script src="${ENDPOINTBASE}public/vendor.bundle.js"></script>
        <script src="${ENDPOINTBASE}public/bundle.js"></script>
      `;
      }
      return `<script src="${ENDPOINTBASE}public/bundle.js"></script>`;
    };
  })
  .catch(function(err) {
    console.error('Unable to load convict configuration', err);
  });

