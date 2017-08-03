var path = require('path');
var webpack = require('webpack');
var CleanWebpackPlugin = require('clean-webpack-plugin');

/* DeprecationWarning: loaderUtils.parseQuery() received ..., see https://github.com/webpack/loader-utils/issues/56
  This is caused by image-webpack-loader (cf. https://github.com/tcoopman/image-webpack-loader/issues/82), and will hopefully be fixed
  in a coming release. This version will however will NOT work with WebPack 1.x
 */

var imageLoaderQuery = {
  mozjpeg: {
    progressive: true,
    quality: '55',
  },
  optipng: {
    optimizationLevel: 7,
  },
  pngquant: {
    quality: '55-80',
    speed: 10,
  },
};


module.exports = {
  devtool: 'source-map',
  entry: ['webpack-hot-middleware/client', './index'],
  output: {
    path: __dirname + '/public',
    filename: 'bundle.js',
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
        BABEL_ENV: JSON.stringify('development'),
        VERSION: JSON.stringify(require('./package.json').version),
      },
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new CleanWebpackPlugin(['public'], {
      root: path.resolve('./'),
      verbose: true,
      dry: false,
    }),
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        include: __dirname,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'stage-1', 'react'],
        },
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        include: __dirname,
        loaders: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: [
          'file-loader?hash=sha512&digest=hex&name=[hash].[ext]',
          'image-webpack-loader?' + JSON.stringify(imageLoaderQuery),
        ],
      },
    ],
  },
};
