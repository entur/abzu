var webpack = require('webpack')
var convictPromise = require('./config/convict-promise.js')
var express = require('express')
var app = new express()
var port = process.env.port || 8988
var globSync = require('glob').sync
var path = require('path')
var fs = require('fs').readFileSync

convictPromise.then( (convict) => {

  var ENDPOINTBASE = convict.get('endpointBase')

  console.info("ENDPOINTBASE is set to", ENDPOINTBASE)

  if (process.env.NODE_ENV !== 'production') {

    let config = require('./webpack.config')

    config.output.publicPath = ENDPOINTBASE + 'public/'

    app.use(ENDPOINTBASE + 'static/', express.static(__dirname + '/static'))

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
  }

  app.get([ENDPOINTBASE + 'config.json', ENDPOINTBASE + 'edit/config.json'], function(req, res) {
    var cfg = {
      tiamatBaseUrl: convict.get('tiamatBaseUrl'),
      endpointBase: convict.get('endpointBase')
    }
    res.send(cfg)
  })

  app.get(ENDPOINTBASE + 'edit/:id', function(req, res) {
    res.send(getIndexHTML())
  })

  app.get(ENDPOINTBASE + '_health', function(req, res) {
    res.sendStatus(200)
  })

  app.get(ENDPOINTBASE + 'config/keycloak.json', function(req, res) {
    res.sendFile(__dirname + '/config/keycloak.json')
  })

  app.get(ENDPOINTBASE + 'translation.json', function(req, res) {
    const translations = globSync(__dirname + '/static/lang/*.json')
      .map((filename) => [
          path.basename(filename, '.json'),
          fs(filename, 'utf8'),
      ]).reduce((messages, [namespace, collection]) => {
          messages[namespace] = collection
          return messages
      }, {})

      let locale = 'en' // fallback language

      if (req.acceptsLanguages()) {

        for (let i = 0; i < req.acceptsLanguages().length; i++ ) {

          locale = req.acceptsLanguages()[i]

          if (translations[locale]) {
            break
          }
        }
      }

      let messages = translations[locale]

      res.send({locale, messages})
  })

    app.get(ENDPOINTBASE, function(req, res) {
      res.send(getIndexHTML())
    })

  app.get(ENDPOINTBASE + '*', function(req, res) {
    res.status(404).send(get404Page())
  })

  app.listen(port, function(error) {
    if (error) {
      console.error(error)
    } else {
      console.info("==> Listening on port %s. Open up http://localhost:%s%s in your browser.", port, port, ENDPOINTBASE)
    }
  })

  const getIndexHTML = () =>
    `<html>
      <head>
        <title>Stop places</title>
        <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/leaflet.css">
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
      </head>
      <body>
        <div id="root">
        </div>
        <script src="${ENDPOINTBASE}public/bundle.js"></script>
      </body>
    </html>`

   const get404Page = () =>
     `<html>
       <head>
         <title>404 - Stop places</title>
       </head>
       <body>
         <div id="root">
          <h1>Stop places</h1>
          <h2>Oops, this page does not exist!<h2>
          <a href="${ENDPOINTBASE}">Back to the site!</a>
         </div>
       </body>
     </html>`

}).catch(function(err) {
  console.error("Unable to load convict configuration", err)
})
