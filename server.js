var webpack = require('webpack')
var webpackDevMiddleware = require('webpack-dev-middleware')
var webpackHotMiddleware = require('webpack-hot-middleware')
var convictPromise = require('./config/convict-promise.js')

var app = new (require('express'))()
var port = process.env.port || 8988

var config = (process.env.NODE_ENV !== 'production')
  ? require('./webpack.config')
  : require('./webpack.prod.config')

var compiler = new webpack(config)

convictPromise.then( (convict) => {

  var ENDPOINTBASE = convict.get('endpointBase')

  console.log("ENDPOINTBASE", ENDPOINTBASE)

  if (process.env.NODE_ENV !== 'production') {
    config.output.path = ENDPOINTBASE + 'public/'
    app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.path, stats: {colors: true} }))
    app.use(webpackHotMiddleware(compiler))
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

  app.get(ENDPOINTBASE, function(req, res) {
    res.send(getIndexHTML())
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

  app.get(ENDPOINTBASE + '_NODE_ENV', function(req, res) {
    res.send({
      NODE_ENV: process.env.NODE_ENV,
      ENDPOINTBASE: ENDPOINTBASE
    })
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
}).catch(function(err) {
  console.error("Unable to load convict configuration", err)
})
