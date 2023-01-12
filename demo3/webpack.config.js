// webpack.config.js

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');




module.exports = {
    mode: 'development',
    entry: {
        index: './src/index.js',
    },    // 入口文件
    output: {
        path: path.resolve(__dirname,'./dist'),  // 打包后的目录
        filename: '[name].bundle.js',      // 打包后的文件名称
        clean: true, // 每次构建前清理 /dist 文件夹
        // publicPath: '/',
    },
    plugins: [
        new HtmlWebpackPlugin({
          title: '开发环境',
        }),
    ],
    devtool: 'inline-source-map', // 启用source map
    devServer: {
        static: './dist',
        hot: true, // 启用HMR
    },
    optimization: {
        runtimeChunk: 'single',
    },
}