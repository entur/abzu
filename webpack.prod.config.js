const path = require('path')
const webpack = require('webpack')
const baseURL = process.env.BASE_URL || '/static/'

module.exports = {
  devtool: 'cheap-module-eval-source-map',

  entry: [
    './index'
  ],

  output: {
    path: path.join(__dirname, 'public'),
    filename: 'bundle.js',
    publicPath: '/admin/bel/static/'
  },

  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    })
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
    }]
  }
}
