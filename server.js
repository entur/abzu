var webpack = require('webpack')
var convictPromise = require('./config/convict-promise.js')
var express = require('express')
var app = new express()
var port = process.env.port || 8988
var globSync = require('glob').sync
var path = require('path')
var fs = require('fs').readFileSync
var axios = require('axios')

convictPromise.then( (convict) => {

  var ENDPOINTBASE = convict.get('endpointBase')

  console.info("ENDPOINTBASE is set to", ENDPOINTBASE)

  app.use([ENDPOINTBASE + 'public/', ENDPOINTBASE + 'edit/public/'], express.static(__dirname + '/public'))

  app.get(ENDPOINTBASE + 'token', (req, res) => {

    const remoteAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress

    axios.post(`http://gatekeeper1.geonorge.no/BaatGatekeeper/gktoken?ip=${remoteAddress}&min=400`).
      then(gkt => {
      res.send({
        gkt: gkt.data,
        expires: new Date(Date.now()+(60*1000*399)).getTime()
      })
    })
  })

  if (process.env.NODE_ENV !== 'production') {

    let config = require('./webpack.config')

    config.output.publicPath = ENDPOINTBASE + 'public/'

    var compiler = new webpack(config)

    app.use(require("webpack-dev-middleware")(compiler, {
      noInfo: true, publicPath: config.output.publicPath, stats: {colors: true}
    }))

    app.use(require("webpack-hot-middleware")(compiler))

  } else {
    // expose build bundle for production
    app.get(ENDPOINTBASE + 'public/bundle.js', function(req, res) {
      res.sendFile(__dirname + '/public/bundle.js')
    })

    app.get(ENDPOINTBASE + 'public/react.bundle.js', function(req, res) {
      res.sendFile(__dirname + '/public/react.bundle.js')
    })
  }

  app.get([ENDPOINTBASE + 'config.json', ENDPOINTBASE + 'edit/config.json'], function(req, res) {
    var cfg = {
      tiamatBaseUrl: convict.get('tiamatBaseUrl'),
      endpointBase: convict.get('endpointBase')
    }
    res.send(cfg)
  })

  app.get(ENDPOINTBASE + 'edit/:id', function(req, res) {
    res.send(getPage())
  })

  app.get(ENDPOINTBASE + '_health', function(req, res) {
    res.sendStatus(200)
  })

  app.get(ENDPOINTBASE + 'config/keycloak.json', function(req, res) {
    res.sendFile(__dirname + '/config/keycloak.json')
  })

  app.get([ENDPOINTBASE + 'translation.json', ENDPOINTBASE + 'edit/translation.json'], function(req, res) {
    let translations = getTranslations(req)
    res.send(translations)
  })

  app.get(ENDPOINTBASE + 'static/icons/svg-sprite.svg', function(req, res) {
    res.sendFile(__dirname + '/static/icons/svg-sprite.svg')
  })

  app.get(ENDPOINTBASE, function(req, res) {
    res.send(getPage())
  })

  app.get(ENDPOINTBASE + '*', function(req, res) {
    res.redirect(ENDPOINTBASE)
  })

  app.listen(port, function(error) {
    if (error) {
      console.error(error)
    } else {
      console.info("==> Listening on port %s. Open up http://localhost:%s%s in your browser.", port, port, ENDPOINTBASE)
    }
  })

  const getTranslations = (req) => {

    const supportedLanguages = ['en', 'nb']

    const translations = globSync(__dirname + '/static/lang/*.json')
      .map((filename) => [
          path.basename(filename, '.json'),
          fs(filename, 'utf8'),
      ]).reduce((messages, [namespace, collection]) => {
          messages[namespace] = collection
          return messages
      }, {})

      let locale = 'en' // i.e. fallback language

      if (typeof req.query.locale !== 'undefined' && supportedLanguages.indexOf(req.query.locale) > -1) {
        locale = req.query.locale
      } else {
        if (req.acceptsLanguages()) {
          for (let i = 0; i < req.acceptsLanguages().length; i++ ) {
            if (translations[req.acceptsLanguages()[i]]) {
              locale = req.acceptsLanguages()[i]
              break
            }
          }
        }
      }

      return {
        "locale": locale,
        "messages": translations[locale]
      }
  }

  const getPage = () =>
    `<html>
      <head>
        <title>Stop places</title>
        <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.0/leaflet.css">
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
      </head>
      <body>
        <div id="root">
        </div>
        ${getBundles()}
      </body>
    </html>`

  const getBundles = () => {
    if (process.env.NODE_ENV === 'production') {
      return (`
        <script src="${ENDPOINTBASE}public/react.bundle.js"></script>
        <script src="${ENDPOINTBASE}public/bundle.js"></script>
      `)
    }
    return `<script src="${ENDPOINTBASE}public/bundle.js"></script>`
  }


}).catch(function(err) {
  console.error("Unable to load convict configuration", err)
})
