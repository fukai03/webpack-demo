# webpack-demo
学习webpack所用demo

配置在webpack.config.js中配置
demo地址
https://github.com/fukai03/webpack-demo


mode选择
|选项 | 描述 |
|---|---|
|development|开发模式，打包更加快速，省了代码优化步骤|
|production|生产模式，打包比较慢，会开启 tree-shaking 和 压缩代码|
|none |不使用任何默认优化选项|

###文件处理
demo1
* webpack默认支持处理JS和json文件，若需要处理如css、html等文件，需要借助loader、plugin。
* 处理css、less等
npn install css-loader -D
loader
* loader 用于对模块的源代码进行转换。loader 可以使你在 import 或 "load(加载)" 模块时预处理文件。因此，loader 类似于其他构建工具中“任务(task)”，并提供了处理前端构建步骤的得力方式。loader 可以将文件从不同的语言（如 TypeScript）转换为 JavaScript 或将内联图像转换为 data URL。loader 甚至允许你直接在 JavaScript 模块中 import CSS 文件！
* css-loader并不能直接使得css文件生效，还需要安装style-loader。若使用less文件，还需安装less-loader。
npm i css-loader style-loader less less-loader --save-dev


注意： Loader 的执行顺序是固定从后往前，如下webpack配置，即按 less-loader  -->  css-loader -->  style-loader 的顺序执行
```js
// webpack.config.js

module.exports = {
// xxx
    module: {
        rules: [
            {
                test: /\.css$|\.less$/,
                use:['style-loader', 'css-loader', 'less-loader']
            },
        ]
    },
  }
```

* 若需加载图片文件或者字体文件，可使用webpack5中内置的Asset Modules进行加载，无需安装额外的loader。
```js
// webpack.config.js

module.exports = {
// xxx
    module: {
        rules: [
            {// 处理图片
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
            {// 加载字体文件
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
            },
        ]
    },
  }
  ```
* 若需加载数据文件，如 JSON 文件，CSV、TSV 和 XML，需要安装额外的loader。JSON文件内置是支持的，需要 csv-loader 和 xml-loader来处理CSV、TSV 和 XML文件。

```bash
npm install --save-dev csv-loader xml-loader
```

```js
// webpack.config.js

module.exports = {
// xxx
    module: {
        rules: [
              {
                test: /\.(csv|tsv)$/i,
                use: ['csv-loader'],
              },
              {
                test: /\.xml$/i,
                use: ['xml-loader'],
              },
        ]
    },
  }
```

输出管理
demo2
设置 HtmlWebpackPlugin
* 更改了一个entry的名称，甚至添加了一个新的entry，需要使用HtmlWebpackPlugin来进行输出管理。
* 安装插件，并且调整 webpack.config.js 文件
```bash
npm install --save-dev html-webpack-plugin
```
```js
// webpack.config.js

const HtmlWebpackPlugin = require('html-webpack-plugin');

 module.exports = {
  // ...
  plugins: [
    new HtmlWebpackPlugin({
      title: '管理输出',
    }),
  ],
 };
 ```
* HtmlWebpackPlugin 会默认生成它自己的 index.html 文件，所有的 bundle 会自动添加到 html 中。
清理dist文件夹
webpack 默认不会追踪哪些文件是实际在项目中用到的，在项目中可能会导致未用到的文件也会打包。使用 output.clean 配置项在每次构建前清理 /dist 文件夹，实现只生成用到的文件的效果。

manifest
webpack 通过 manifest，可以追踪所有模块到输出 bundle 之间的映射。通过 WebpackManifestPlugin 插件，可以将 manifest 数据提取为一个 json 文件以供使用。



开发环境
demo3
首先在webpack.config.js文件中mode 设置为 'development'。
source map
*  webpack 打包源代码时，可能会很难追踪到 error 和 warning 在源代码中的原始位置。JavaScript 提供了 source maps 功能，可以将编译后的代码映射回原始源代码。
* 配置参考 可用选项。
* 示例
  * 将一个print.js文件console修改为sonole，将该文件引入index.js中，打包后运行，报错如下图，显示错误在index.bundle.js文件中

* 在webpack.config.js文件中添加source map配置
module.exports = {
    // ...
    devtool: 'inline-source-map', // 启用source map
}
* 重新打包后运行，报错信息准确定位到print.js文件。用于在开发模式下快速定位问题。

|devtool|build|rebuild|显示代码|SourceMap 文件|描述|
|---|---|---|---|---|---|
|(none)|很快|很快|无|无|无法定位错误|
|eval|快|很快（cache）|编译后|无|定位到文件|
|source-map|很慢|很慢|源代码|有|定位到行列|
|eval-source-map|很慢|一般（cache）|编译后|有（dataUrl）|定位到行列|
|eval-cheap-source-map|一般|快（cache）|编译后|有（dataUrl）|定位到行|
|eval-cheap-module-source-map|慢|快（cache）|源代码|有（dataUrl）|定位到行|
|inline-source-map|很慢|很慢|源代码|有（dataUrl）|定位到行列|
|hidden-source-map|很慢|很慢|源代码|有|无法定位错误|
|nosource-source-map|很慢|很慢|源代码|无|定位到文件|










* 配置推荐
  * 开发模式：eval-cheap-module-source-map
    * 首次打包慢点，但因为 eval 缓存的原因，rebuild 会很快
    * 开发中，每行代码不会写的太长，只需要定位到行就行
    * 希望能够找到源代码的错误，而不是打包后的
  * 生产模式：none
    * 不显示源代码

开发工具
每次修改代码后重新build使得开发过于繁琐，可使用webpack中提供的功能检测代码变化并自动编译。
webpack 提供几种可选方式，使得代码发生变化后自动编译代码（多数场景中，使用 webpack-dev-server）：
1.  Watch Mode
2. webpack-dev-server
3. webpack-dev-middleware
watch mode
* watch mode指使webpack观察依赖图中所有文件的更改，若其中一个文件被修改，代码将被重新编译，所以不必再去手动build。
* 在package.json的scripts中添加watch命令
"watch": "webpack --watch --mode development"
* 运行 npm run watch，webpack开始编译代码，从持续watch项目中的文件，在修改后可看到重新编译的页面。
* 该方式有一个缺陷：为了看到修改后的实际效果，需要刷新浏览器（在vscode使用live server插件打开页面可避免这个缺陷）。
webpack-dev-server
* webpack-dev-server 为提供了一个基本的 web server，并且具有 live reloading(实时重新加载) 功能。
* 安装webpack-dev-server
npm install --save-dev webpack-dev-server
* 修改webpack.config.js（dist 目录下的文件 serve 到 localhost:8080 下）
```js
module.exports = {
    // ...
    devServer: {
        static: './dist',
    },
    optimization: {
        runtimeChunk: 'single',
    },
}
```
webpack-dev-server 在编译之后不会写入到任何输出文件。而是将 bundle 文件保留在内存中，然后将其 serve 到 server 中，就好像它们是挂载在 server 根路径上的真实文件一样
* 在package.json的scripts中添加start命令
"start": "webpack serve --open"
* 运行 npm start，会看到浏览器自动加载页面。更改任何源文件并保存，web server 将在编译代码后自动重新加载
开发模式下，通常会使用HMR（hot module replacement），其是webpack 提供的最有用的功能之一，允许在运行时更新所有类型的模块，而无需完全刷新。
需要注意的是，HMR 不适用于生产环境，这意味着它应当用于开发环境。
* 启用HMR
  * 从 webpack-dev-server v4.0.0 开始，热模块替换是默认开启的。
```js
// webpack.config.js
module.exports = {
    // ...
    devServer: {
        static: './dist',
        hot: true
    },
}
```

 webpack-dev-middleware
* webpack-dev-middleware 是一个wrapper，可以把 webpack 处理过的文件发送到一个 server。webpack-dev-server 在内部使用了它，然而它也可以作为一个单独的 package 来使用，以便根据需求进行更多自定义设置。
* 以下是webpack-dev-middleware 配合 express server 的示例。
  * 安装 express 和 webpack-dev-middleware，并修改webpack.config.js配置，以确保 middleware功能正确启用：
```bash
npm install --save-dev express webpack-dev-middleware
```
```js
// webpack.config.js
module.exports = {
    // ...
    output: {
        path: path.resolve(__dirname,'./dist'),  // 打包后的目录
        filename: '[name].bundle.js',      // 打包后的文件名称
        clean: true, // 每次构建前清理 /dist 文件夹
        publicPath: '/',
    },
}
```
* 在根路径添加server.js文件，
```
// server.js
const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

const app = express();
const config = require('./webpack.config.js');
const compiler = webpack(config);

// 告知 express 使用 webpack-dev-middleware，
// 以及将 webpack.config.js 配置文件作为基础配置。
app.use(
  webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
  })
);

// 将文件 serve 到 port 3000。
app.listen(3000, function () {
  console.log('Example app listening on port 3000!\n');
});
```
* 在package.json的scripts中添加server命令
"server": "node server.js"
* 运行 npm run server，打开浏览器，访问 http://localhost:3000，可看到 webpack 应用程序已经运行。

代码分离
demo4
*  webpack 代码分离的特性能够把代码分离到不同的 bundle 中，然后可以按需加载或并行加载这些文件。代码分离可以用于获取更小的 bundle，以及控制资源加载优先级，如果使用合理，会极大缩短加载时间。
* 常用的代码分离方法有三种（实际项目中前两种使用较少，着重关注第三中方式）：
  * 入口起点：使用 entry 配置手动地分离代码。
  * 防止重复：使用 Entry dependencies 或者 SplitChunksPlugin 去重和分离 chunk。
  * 动态导入：通过模块的内联函数调用来分离代码。
动态导入（dynamic import）
* 涉及到动态代码拆分时，webpack 提供了两个技术。第一种是使用符合 ECMAScript 提案 的 import() 语法 来实现动态导入。第二种则是 webpack 的遗留功能，使用 webpack 特定的 require.ensure。示例中只使用第一种方式。
* 设置webpack.config.js，设置模式、入口、输出即可。
```js
// webpack.config.js
const path = require('path');
module.exports = {
    mode: 'development',
    entry: path.resolve(__dirname,'./src/index.js'),    // 入口文件
    output: {
        path: path.resolve(__dirname,'./dist'),  // 打包后的目录
        filename: '[name].bundle.js',      // 打包后的文件名称
        clean: true, // 每次构建前清理 /dist 文件夹
    },
}
```
* 在index.js中，引入loadsh，不再使用常规静态导入，而是用动态导入来分理处一个chunk。动态导入需要使用default，元婴可查看 webpack 4: import() and CommonJs。
```js
// import _ from 'lodash'; // 静态导入

async function getComponent() {
    const element = document.createElement('div');
    const { default: _ } = await import('lodash'); // 动态导入

    element.innerHTML = _.join(['Hello', 'webpack'], ' ');
    return element;
}

getComponent().then((component) => {
    document.body.appendChild(component);
});
```
* 执行npm run build后，可以看到构建出一个单独的loadash的bundle：

* 若将动态导入换为静态导入，重新build后，则不会单独构建l出oadsh的bundle：


缓存
demo5

创建library
demo6
* 初始化项目后安装 webpack，webpack-cli 和 lodash（因为不需要吧lodash打包到库中，所以将其安装为 devDependencies 而不是 dependencies）
npm install --save-dev webpack webpack-cli lodash
* 新建文件
```js
// src/index.js
import _ from 'lodash';
import numRef from './ref.json';

export function numToWord(num) {
  return _.reduce(
    numRef,
    (accum, ref) => {
      return ref.num === num ? ref.word : accum;
    },
    ''
  );
}

export function wordToNum(word) {
  return _.reduce(
    numRef,
    (accum, ref) => {
      return ref.word === word && word.toLowerCase() ? ref.num : accum;
    },
    -1
  );
}
```
src/ref.json
```json
[
  {
    "num": 1,
    "word": "One"
  },
  {
    "num": 2,
    "word": "Two"
  },
  {
    "num": 3,
    "word": "Three"
  },
  {
    "num": 4,
    "word": "Four"
  },
  {
    "num": 5,
    "word": "Five"
  },
  {
    "num": 0,
    "word": "Zero"
  }
]
```
* 配置webpack（通过 output.library 配置项暴露从入口导出的内容）
``` js
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
};
```
* 此时执行npm run build会发现打包体积很大，这是由于lodash也被打包到库中。此时需要将lodash作为peerDependency，让使用者安装lodash，而不是将lodash打包到本次创建的库中，使用 externals 配置来完成。

```js
module.exports = {
// ...
   externals: {
     lodash: {
       commonjs: 'lodash',
       commonjs2: 'lodash',
       amd: 'lodash',
       root: '_',
     },
   },
  };
```
* 以上配置意味着本次创建的库 需要一个名为 lodash 的依赖，这个依赖在 consumer 环境中必须存在且可用。
* 重新build后可以看到体积大大减小。

* 最后将生成 bundle 的文件路径，添加到 package.json 中的 main 字段中或将其添加为标准模块。然后就可以发布npm包。
```json
{
  "main": "dist/demo6.js",
  "module": "src/index.js",
}
```

Tree Shaking
demo7
tree shaking 是一个术语，通常用于描述移除 JavaScript 上下文中的未引用代码(dead-code)。它依赖于 ES2015 模块语法的 静态结构 特性，例如 import 和 export。这个术语和概念实际上是由 ES2015 模块打包工具 rollup 普及起来的。
* 添加一个math.js文件，并在index.js中引用该文件的函数
  math,js
```js
export function square(x) {
  return x * x;
}

export function cube(x) {
  return x * x * x;
}
```
index.js
```js
import { cube } from './math.js';

function component() {
 const element = document.createElement('pre');

 element.innerHTML = [
   'Hello webpack!',
   '5 cubed is equal to ' + cube(5)
 ].join('\n\n');

  return element;
}

document.body.appendChild(component());
```
* 更改webpack配置
```js
const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true
  },
 optimization: {
   usedExports: true,
 },
};
```

* 执行npm run build
* 可以看到，index.js没有从 src/math.js 模块中 import 另外一个 square 方法。这个函数就是所谓的“未引用代码(dead code)”，也就是说，应该删除掉未被引用的 export，但从以下打包文件中可以看到，虽然没有引用 square，但它仍然被包含在 bundle 中。

将文件标记为 side-effect-free(无副作用)
* 通过 package.json 的 "sideEffects" 属性，来实现这种方式。
```json
{
  "name": "demo7",
  "sideEffects": false,
}
```
* 如果所有代码都不包含副作用，我们就可以简单地将该属性标记为 false，来告知 webpack 它可以安全地删除未用到的 export。
* 代码确实有一些副作用，可以改为提供一个数组：
```json
{
  "sideEffects": ["./src/某些含副作用的文件.js"]
}
```
"side effect(副作用)" 的定义是，在导入时会执行特殊行为的代码，而不是仅仅暴露一个 export 或多个 export。举例说明，例如 polyfill，它影响全局作用域，并且通常不提供 export。
* 通过 import 和 export 语法，已经找出需要删除的“未引用代码(dead code)”，然而，不仅仅是要找出，还要在 bundle 中删除它们。为此，我们需要将 mode 配置选项设置为 production。
* 打包后可以看到文件中引用的cube函数为，且未出现square函数。 dist文件夹中bundle 减小几个字节。
function e(e){return e*e*e}

生产环境和开发环境配置分离
demo8
开发环境和生产环境
* development(开发环境) 和 production(生产环境) 这两个环境下的构建目标存在着巨大差异。
* 开发环境中，我们需要：强大的 source map 和一个有着 live reloading(实时重新加载) 或 hot module replacement(热模块替换) 能力的 localhost server。
* 生产环境关注点在于压缩 bundle、更轻量的 source map、资源优化等，通过这些优化方式改善加载时间。
* 基于以上不通电，可以为每个环境编写彼此独立的 webpack 配置。通常可分为通用（common）配置、开发（dev）配置和生产（prod）配置。
配置步骤
* 安装 webpack-merge：
npm install --save-dev webpack-merge
* 删除webpack.config.js，并新增以下三个配置文件：
 const path = require('path');
 const HtmlWebpackPlugin = require('html-webpack-plugin');

 module.exports = {
   entry: {
     app: './src/index.js',
   },
   plugins: [
     new HtmlWebpackPlugin({
       title: 'Production',
     }),
   ],
   output: {
     filename: '[name].bundle.js',
     path: path.resolve(__dirname, 'dist'),
     clean: true,
   },
 };
 const { merge } = require('webpack-merge');
 const common = require('./webpack.common.js');

 module.exports = merge(common, {
   mode: 'development',
   devtool: 'inline-source-map',
   devServer: {
     static: './dist',
   },
 });
 const { merge } = require('webpack-merge');
 const common = require('./webpack.common.js');

 module.exports = merge(common, {
   mode: 'production',
 });
* 修改package.json中的scripts命令，这样在npm start使用的就是webpack开发配置，npm run build使用的就是webpack生产配置。
{
"scripts": {
     "start": "webpack serve --open --config webpack.dev.js",
     "build": "webpack --config webpack.prod.js"
    },
}


懒加载
demo9
懒加载（按需加载）是一种很好的优化网页或应用的方式。本质上是先把代码在一些逻辑断点处分离开，然后在一些代码块中完成某些操作后，立即引用或即将引用另外一些新的代码块。这样加快了应用的初始加载速度，减轻了它的总体体积，因为某些代码块可能永远不会被加载。
示例
* 在src下添加两个文件
```js
console.log('该模块被加载');

export default () => {
    console.log('点击按钮!');
};
```
```js
import _ from 'lodash';


function component() {
   const element = document.createElement('div');
  const button = document.createElement('button');
  const br = document.createElement('br');

  button.innerHTML = 'Click me and look at the console!';
   element.innerHTML = _.join(['Hello', 'webpack'], ' ');
  element.appendChild(br);
  element.appendChild(button);

  // 懒加载
  button.onclick = e => import(/* webpackChunkName: "print" */ './print').then(module => {
    const print = module.default;

    print();
  });

   return element;
 }

document.body.appendChild(component());
```
* webpack配置
```js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    entry: {
        index: './src/index.js',
    },    // 入口文件
    output: {
        path: path.resolve(__dirname,'./dist'),  // 打包后的目录
        filename: '[name].bundle.js',      // 打包后的文件名称
        clean: true, // 每次构建前清理 /dist 文件夹
    },
    plugins: [
        new HtmlWebpackPlugin({
          title: '懒加载',
        }),
    ],
}
```
* 执行npm run build，并将dist文件夹中html文件在浏览器中打开，在控制台中，可以看到并未有任何信息打印。
* 点击按钮，可以看到控制台依次打印  "该模块被加载" 和 "点击按钮!" 。
* 以上说明在初始化页面时，print.js并未被加载，只有当调用时才进行加载。
框架
在不同的框架中，都有各自独特方式来实现懒加载：
* React: Code Splitting and Lazy Loading
* Vue: Dynamic Imports in Vue.js for better performance

配置优化
构建速度优化
1. 优化resolve
1） alias，用来简化模块引用，项目中基本都需要进行配置
```js
module.exports = {
// ...
  resolve:{
    // 配置别名
    alias: {
      '@': resolve('src'),
      'components': resolve('src/components'),
    }
  }
}
```
1) extensions
```js
module.exports = {
// ...
  resolve:{// 默认配置
    extensions: ['.js', '.json', '.wasm'],
  }
}
```
用户引入模块时不带扩展名， 则webpack 就会按照 extensions 配置的数组从左到右的顺序去尝试解析模块，例如：
import file from '../path/to/file';
手动配置后，默认配置会被覆盖，如果想保留默认配置，可以用 ... 扩展运算符代表默认配置，如
```js
module.exports = {
// ...
  resolve:{
    extensions: ['.ts', '...'],
  }
}
```
1. externals
externals 配置选项提供了「从输出的 bundle 中排除依赖」的方法。此功能通常对 library 开发人员来说是最有用的，然而也会有各种各样的应用程序用到它。

1. 缩小范围
在配置 loader 的时候，我们需要更精确的去指定 loader 的作用目录或者需要排除的目录，通过使用 include 和 exclude 两个配置项，可以实现这个功能，常见的例如：
* include：符合条件的模块进行解析
* exclude：排除符合条件的模块，不解析
* exclude 优先级更高
如在配置 babel 的时候
```js
const path = require('path');

function resolve(dir){
  return path.join(__dirname, dir);
}
module.exports = {
  //...
  module: { 
    noParse: /jquery|lodash/,
    rules: [
      {
        test: /\.js$/i,
        include: resolve('src'),
        exclude: /node_modules/,
        use: [
          'babel-loader',
        ]
      },
      // ...
    ]
  }
};
```
1. noParse
不需要解析依赖的第三方大型类库等，可以通过noParse进行配置，以提高构建速度，使用 noParse 进行忽略的模块文件中不会解析 import、require 等语法。如上方 缩小范围 中配置，不会解析jquery和lodash模块中的import、require 等语法。

1.  利用缓存
a. babel-loader 开启缓存
* babel 在转译 js 过程中时间开销比价大，将 babel-loader 的执行结果缓存起来，重新打包的时候，直接读取缓存
* 缓存位置： node_modules/.cache/babel-loader
```js
module.exports = {
 module: { 
    noParse: /jquery|lodash/,
    rules: [
      {
        test: /\.js$/i,
        include: resolve('src'),
        exclude: /node_modules/,
        use: [
          // ...
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true // 启用缓存
            }
          },
        ]
      },
      // ...
    ]
  }
}
```
b. 其他loader可使用cache-loader 来完成
* 缓存一些性能开销比较大的 loader 的处理结果
* 缓存位置：node_modules/.cache/cache-loader
* 安装
 npm i -D cache-loader
* 配置

```js
module.exports = {
 module: { 
    rules: [
      {
        test: /\.(s[ac]|c)ss$/i, //匹配所有的 sass/scss/css 文件
        use: [
          MiniCssExtractPlugin.loader,
          'cache-loader', // 获取前面 loader 转换的结果
          'css-loader',
          'postcss-loader',
          'sass-loader', 
        ]
      },
      // ...
    ]
  }
}
```
1. cache持久化缓存
* 通过配置 cache 缓存生成的 webpack 模块和 chunk，来改善构建速度。
```js
module.exports = {
  cache: {
    type: 'filesystem',
  },
}
```
构建结果优化
1. 压缩css
* 安装 optimize-css-assets-webpack-plugin
npm install -D optimize-css-assets-webpack-plugin 
* 修改 webapck.config.js 配置
```js
// ...
// 压缩css
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
// ...

module.exports = {
  // ...
  optimization: {
    minimize: true,
    minimizer: [
      // 添加 css 压缩配置
      new OptimizeCssAssetsPlugin({}),
    ]
  },
 // ...
}
```

1. 压缩js
* 在生产环境下打包默认会开启 js 压缩，但是当我们手动配置 optimization 选项之后，就不再默认对 js 进行压缩，需要我们手动去配置。
*  webpack5 内置了terser-webpack-plugin 插件，所以不需重复安装，直接引用即可。
```js
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  // ...
  optimization: {
    minimize: true, // 开启最小化
    minimizer: [
      // ...
      new TerserPlugin({})
    ]
  },
  // ...
}
```
1. 清除无用的 CSS
* purgecss-webpack-plugin 会单独提取 CSS 并清除用不到的 CSS
* 安装
```bash
 npm i -D purgecss-webpack-plugin
```
* 使用
```js
const PurgecssWebpackPlugin = require('purgecss-webpack-plugin')
const glob = require('glob'); // 文件匹配模式

function resolve(dir){
  return path.join(__dirname, dir);
}
const PATHS = {
  src: resolve('src')
}

module.exports = {
  // ...
  plugins:[ // 配置插件
    // ...
    new PurgecssPlugin({
      paths: glob.sync(`${PATHS.src}/**/*`, {nodir: true})
    }),
  ]
  // ...
}
```
1. tree shaking
* webpack 默认支持，需要在 .bablerc 里面设置 model：false，即可在生产环境下默认开启
```js
module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        module: false,
        useBuiltIns: "entry",
        corejs: "3.9.1",
        targets: {
          chrome: "58",
          ie: "11",
        },
      },
    ],
  ],  
}
```
1. 作用于提升（Scope Hoisting）
* 作用域提升，原理是将多个模块放在同一个作用域下，并重命名防止命名冲突，通过这种方式可以减少函数声明和内存开销。
* webpack 默认支持，在生产环境下默认开启
* 只支持 es6 代码
优化运行时
运行时优化的核心就是提升首屏的加载速度，主要的方式就是降低首屏加载文件体积，首屏不需要的文件进行预加载或者按需加载
1. splitChunks 分包配置
* optimization.splitChunks 是基于 SplitChunksPlugin 插件实现
* webpack 将根据以下条件自动拆分 chunks：
  * 新的 chunk 可以被共享，或者模块来自于 node_modules 文件夹
  * 新的 chunk 体积大于 20kb（在进行 min+gz 之前的体积）
  * 当按需加载 chunks 时，并行请求的最大数量小于或等于 30
  * 当加载初始化页面时，并发请求的最大数量小于或等于 30
* 默认配置：
```js
module.exports = {
  //...
  optimization: {
    splitChunks: {
      chunks: 'async', // 有效值为 `all`，`async` 和 `initial`
      minSize: 20000, // 生成 chunk 的最小体积（≈ 20kb)
      minRemainingSize: 0, // 确保拆分后剩余的最小 chunk 体积超过限制来避免大小为零的模块
      minChunks: 1, // 拆分前必须共享模块的最小 chunks 数。
      maxAsyncRequests: 30, // 最大的按需(异步)加载次数
      maxInitialRequests: 30, // 打包后的入口文件加载时，还能同时加载js文件的数量（包括入口文件）
      enforceSizeThreshold: 50000,
      cacheGroups: { // 配置提取模块的方案
        defaultVendors: {
          test: /[\/]node_modules[\/]/,
          priority: -10,
          reuseExistingChunk: true,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
};
```
1. 代码懒加载（详见上文懒加载内容）
2. prefetch 和 preload
* prefetch (预获取)：浏览器空闲的时候进行资源的拉取
  * 改造demo9中代码
```js
  // prefetch
  button.onclick = e => import(/* webpackPrefetch: true */ './print').then(module => {
    const print = module.default;

    print();
  });

   return element;
 }
 ```

  * 懒加载中，在点击按钮时加载print文件。
  * prefetch时，点击按钮时，会看到新增下图中569.bundle.js文件，其大小显示为由预提取缓存提供。

* preload (预加载)：提前加载后面会用到的关键资源
因为会提前拉取资源，如果不是特殊需要，谨慎使用
* [官网示例](https://webpack.docschina.org/guides/code-splitting/#prefetchingpreloading-modules)

### 配置一般流程
demo11
* 初始化项目
```
demo11
    ├── src
    |    └── index.js
    ├── package.json
    ├── webpack.config.js
```
* 安装webpack
```
npm install webpack webpack-cli -D
```
* index.js中写入内容

```js
class Test {
    constructor() {
        console.log('test');
        document.write('test')
    }
}
new Test()
```
* 配置babel-loader
  * 安装

```bash
npm install babel-loader @babel/core @babel/preset-env @babel/plugin-transform-runtime  @babel/plugin-proposal-decorators  @babel/plugin-proposal-class-properties @babel/plugin-proposal-private-methods -D
# and
npm install @babel/runtime @babel/runtime-corejs3 -s
```
* 配置webpack文件

```js
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.[contenthash:8].js',
    clean: true, // 每次打包前清除上次构建的产物，只保留本次打包结果
  },
  module: {
    rules: [
      {
        test: /\.(jsx|js)$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
    ]
  }
}
```
* 配置babelrc文件

```
{
    "presets": ["@babel/preset-env"],
    "plugins": [
        ["@babel/plugin-transform-runtime", {"corejs": 3}],
        ["@babel/plugin-proposal-decorators", { "legacy": true }],
        ["@babel/plugin-proposal-class-properties", { "loose": true }],
        ["@babel/plugin-proposal-private-methods", { "loose": true }]，
        ["@babel/plugin-proposal-private-property-in-object", { "loose": true }]
    ]
}
```
* 添加html插件，并在根路径下创建public/index.html作为静态资源

```bash
npm install html-webpack-plugin -D
```
```js
// 省略 ...
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // 省略 ...
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './public/index.html'),
      inject: 'body',
      scriptLoading: 'blocking',
    }),
  ]
}
```
* 安装webpack-dev-server，此时执行npm run dev即可在指定端口看到页面效果，且实时刷新
  * devServer参考：
    * https://webpack.docschina.org/configuration/dev-server/#root
    * https://juejin.cn/post/6971237797734645767
    * https://juejin.cn/post/6973825927708934174

```bash
npm install webpack-dev-server -D
```
```js
// 省略 ...
module.exports = {
  // 省略 ...
  devServer: {
    port: 2023, // 默认是 8080
    hot: true,
    compress: true, // 是否启用 gzip 压缩
    proxy: {
      '/api': {
        target: 'http://0.0.0.0:80',
        pathRewrite: {
          '/api': '',
        },
      },
    },
  },
}
{
  "scripts": {
    "build": "webpack",
    "dev": "webpack serve --open"
  },
}
```
* sourcemap配置
  * 开发环境 最佳： eval-cheap-module-source-map
  * 生产环境 最佳： hidden-source-map

* 拆分环境
  * 开发过程中一般会有多个环境（开发、测试、生产等），不同环境下webpack的配置会有差异（如sourcemap配置），所以需要对配置进行拆分来对应不同的环境。
  * 根路径下新增以下文件（公共配置：base，开发配置：dev，生产配置：pro）
  + ├── build
  + |    ├── webpack.base.js
  + |    ├── webpack.dev.js
  + |    ├── webpack.pro.js
* （需将路径更换，否则打包或启动会报错）
```js
// webpack.base.js 公共配置
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    mode: 'development',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.[contenthash:8].js',
        clean: true
    },
    module: {
        rules: [
            {
                test: /\.(jsx|js)$/,
                use: 'babel-loader',
                exclude: /node_modules/,
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(rootDir, './public/index.html'),
            inject: 'body',
            scriptLoading: 'blocking'
        })
    ],
}
```
```js
// webpack.dev.js 开发环境配置
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
```
```js
// webpack.pro.js 生产环境配置
const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.base')

module.exports = merge(baseConfig, {
    mode: 'production',
    devtool: 'hidden-source-map'
});
```
* 修改package.json中的脚本命令

```json
    "build": "webpack --config build/webpack.pro.js",
    "dev": "webpack serve --config build/webpack.dev.js --open"
```
* 添加样式loader（css、less）

```bash
npm install less style-loader css-loader less-loader -D
```
* 修改webpack.base.js

```js
// 省略...

module.exports = {
  // 省略...
  module: {
    rules: [
      // 省略...
      {
        test: /\.(le|c)ss$/,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader', 'less-loader']
      },
    ]
  },
  // 省略...
}
```

* 打包抽离css文件
  *  安装插件mini-css-extract-plugin

```bash
npm install mini-css-extract-plugin -D
```
* 修改 webpack.base.js 配置文件，注意：需将loader中的style-loader替换为MiniCssExtractPlugin.loader，否则会报错，打包后即可看到样式文件被抽离出来。

```js
//...
const MiniCssExtractPlugin = require('mini-css-extract-plugin');


module.exports = {
// ...
    module: {
        rules: [
// ...
            {
                test: /\.(le|c)ss$/,
                exclude: /node_modules/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'less-loader'
                ]
            },
        ]
    },
    plugins: [
// ...
        new MiniCssExtractPlugin({
            filename: 'css/[name].css'
        })
    ],
}
```

* 压缩打包后的css文件（注意：webpack4 与webpack5 压缩的插件不同）
webpack4
* 安装 optimize-css-assets-webpack-plugin 插件，并修改webpack.config.js

```bash
npm install optimize-css-assets-webpack-plugin -D
```
```js
// 省略...
const OptimizeCssPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
  // 省略...
  plugins: [
    // 省略...
    new OptimizeCssPlugin(),
  ],
}
```

webpack5
* 安装css-minimizer-webpack-plugin，并修改webpack.config.js

```bash
npm install css-minimizer-webpack-plugin -D
```
```js
// 省略...
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = {
  // 省略...
    optimization: {
        minimizer: [
            new CssMinimizerPlugin()
        ]
    },
}
```
* webpack5文件加载（图片、字体等），并修改webpack.config.js（webpack4需要安装raw-loader、url-loader、file-loader）

```js
// 省略...
rules: [
    {
        test: /\.(png|jpg|gif|jpeg|webp|svg|eot|ttf|woff|woff2)$/,
        type: 'asset',
    },
]
```
相关文章推荐
* https://juejin.cn/post/7160875688260534279
* https://umijs.org/blog/mfsu-faster-than-vite
* https://juejin.cn/post/6982361231071903781
