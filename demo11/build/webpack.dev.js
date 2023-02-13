const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.base');

module.exports = merge(baseConfig, {
    mode: 'development',
    devtool: 'eval-cheap-module-source-map',
    devServer: {
        port: 2023,
        hot: true,
        compress: true, // 是否启用 gzip 压缩
        proxy: {
            '/api': {
                target: 'http://0.0.0.0',
                pathRewrite: {
                    '/api': '',
                },
            },
        },
    },
})