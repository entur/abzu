var path = require('path')
var webpack = require('webpack')
// TODO : point to correct endpoint
//const baseURL = process.env.BASE_URL || 'static/'

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: [
    'webpack-hot-middleware/client',
    './index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/admin/bel/static/'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ],
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel'],
      exclude: /node_modules/,
      include: __dirname
    },{
      test: /\.scss$/,
      loaders: ['style', 'css', 'sass']
    },
    {test: /\.svg/, loader: 'svg-url-loader'}]
  }
}
