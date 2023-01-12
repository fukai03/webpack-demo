// webpack.config.js

const path = require('path');
const HtmlWebpackPlugin  = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');


console.log('process.env.NODE_ENV=', process.env.NODE_ENV) // 打印环境变量



const config = {
    entry: path.resolve(__dirname,'./src/main.js'),    // 入口文件
    output: {
        path: path.resolve(__dirname,'./dist'),  // 打包后的目录
        filename: '[name].bundle.js',      // 打包后的文件名称
    },
    // devServer: {
    //     static: '../dist/index.html'
    // },
    module: {
        rules: [
            {// 处理样式文件
                test: /\.css$|\.less$/,
                use:['style-loader', 'css-loader', 'less-loader']
            },
            {// 处理图片
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
            {// 加载字体文件
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
            },
            {// 加载csv,tsv文件
              test: /\.(csv|tsv)$/i,
              use: ['csv-loader'],
            },
            {// 加载xml文件
              test: /\.xml$/i,
              use: ['xml-loader'],
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'index.html'
        }),
        new CleanWebpackPlugin(), // 清理上次打包文件的插件
    ],
    // optimization: {
    //     runtimeChunk: 'single',
    // },
}
module.exports = (env, argv) => {
    console.log('env=', env);
    console.log('argb.mode=', argv.mode);
    return config;
}