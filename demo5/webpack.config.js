// webpack.config.js

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');



module.exports = {
    mode: 'development',
    entry: path.resolve(__dirname,'./src/index.js'),    // 入口文件
    output: {
        path: path.resolve(__dirname,'./dist'),  // 打包后的目录
        filename: '[name].[contenthash].js',      // 打包后的文件名称
        clean: true, // 每次构建前清理 /dist 文件夹
    },
    plugins: [
        new HtmlWebpackPlugin({
         title: '缓存',
        }),
    ],
    optimization: {
        runtimeChunk: 'single',
    },
}
