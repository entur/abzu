var webpack = require('webpack')
var webpackDevMiddleware = require('webpack-dev-middleware')
var webpackHotMiddleware = require('webpack-hot-middleware')
var convict = require('./config/convict.js')

var ENDPOINTBASE = '/admin/abzu/'

var app = new (require('express'))()
var port = process.env.port || 8988

// TODO: optimize webpack.production.config and use this instead
var config = require('./webpack.config')
var compiler = webpack(config)

app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }))

// TODO: Considering pro/cons using hotMiddleware in production, but most likely disable thisf
app.use(webpackHotMiddleware(compiler))

app.get(ENDPOINTBASE + "config.json", function(req, res) {
  var cfg = {
    tiamatBaseUrl: convict.get('tiamatBaseUrl')
  }
  res.send(cfg)
})

app.get(ENDPOINTBASE, function(req, res) {
  res.sendFile(__dirname + '/index.html')
})

app.get(ENDPOINTBASE + 'edit/:id', function(req, res) {
  res.sendFile(__dirname + '/index.html')
})

app.get(ENDPOINTBASE + '_health', function(req, res) {
  res.sendStatus(200)
})

app.get(ENDPOINTBASE + 'config/keycloak.json', function(req, res) {
  res.sendFile(__dirname + '/config/keycloak.json')
})

app.get(ENDPOINTBASE + 'config.json', function(req, res) {
  var cfg = {
    nabuBaseUrl: convict.get('nabuBaseUrl'),
    mardukBaseUrl: convict.get('mardukBaseUrl')
  }
  res.send(cfg)
})

app.get(ENDPOINTBASE + '_NODE_ENV', function(req, res) {
  res.send({
    NODE_ENV: process.env.NODE_ENV
  })
})

app.listen(port, function(error) {
  if (error) {
    console.error(error)
  } else {
    console.info('==> Listening on port %s. Open up http://localhost:%s in your browser.', port, port)
  }
})
