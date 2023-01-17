// webpack.config.js

const path = require('path');



module.exports = {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'demo6.js',
      library: {
        name: 'webpackNumbers',
        type: 'umd',
      },
      clean: true,
    },
    externals: {
        lodash: {
          commonjs: 'lodash',
          commonjs2: 'lodash',
          amd: 'lodash',
          root: '_',
        },
    },
  };
