const path = require('path')
const webpack = require('webpack')

module.exports = {
  entry: {
    app: ['babel-polyfill', './index'],
    react: ['babel-polyfill', 'react', 'react-redux', 'react-router', 'react-router-redux']
  },
  output: {
    path: __dirname + '/public/',
    filename: 'bundle.js',
    publicPath: './public/'
  },

  plugins: [
    new webpack.optimize.CommonsChunkPlugin({ name: "react", filename: "react.bundle.js" }),
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      beautify: false,
      comments: false,
      compress: {
        warnings: false
      }
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production'),
        'BABEL_ENV': JSON.stringify('production'),
        'VERSION': JSON.stringify(require('./package.json').version),
      }
    })
  ],

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        include: __dirname,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'stage-1', 'react']
        }
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        include: __dirname,
        loaders: ['style-loader', 'css-loader']
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        exclude: /node_modules/,
        loaders: [
          'file-loader?hash=sha512&digest=hex&name=[hash].[ext]',
          'image-webpack-loader?' + JSON.stringify(imageLoaderQuery)
        ]
      }
    ]
  }
}

var imageLoaderQuery = {
  mozjpeg: {
    progressive: true,
    quality: '55'
  },
  optipng: {
    optimizationLevel: 7,
  },
  pngquant: {
    quality: '55-80',
    speed: 10,
  },
}