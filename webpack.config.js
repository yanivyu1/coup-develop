var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: './public/Main.jsx',
  output: { path: __dirname, filename: 'bundle.js' },
  module: {
    loaders: [
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['react','es2015']
        }
      }
    ],
  },
  resolve: {
    root : [path.resolve('./public')],
    extensions: ['', '.js', '.jsx']
  }
};
