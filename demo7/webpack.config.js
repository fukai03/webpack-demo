// webpack.config.js

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true
  },
 optimization: {
   usedExports: true,
 },
 plugins: [
  new HtmlWebpackPlugin({
    title: 'tree shaking',
  }),
],
};
