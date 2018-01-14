---
title: vue-cli脚手架中webpack配置基础文件详解
date: 2018-05-27 14:06:34
tags:
  - Vue
  - webpack
comments: true
copyright: false
---

{% note info %}
vue-cli是构建vue单页应用的脚手架，输入一串指定的命令行从而自动生成vue.js+wepack的项目模板。这其中webpack发挥了很大的作用，它使得我们的代码模块化，引入一些插件帮我们完善功能，例如可以将文件打包压缩，图片转base64等。
{% endnote %}

### 主体结构

```bash
.
├── build/                      # webpack 配置文件
│   └── ...
├── config/
│   ├── index.js                # 项目配置
│   └── ...
├── src/
│   ├── main.js                 # 应用入口文件
│   ├── App.vue                 # 主应用程序组件
│   ├── components/             # ui 组件
│   │   └── ...
│   └── assets/                 # 模块资源
│       └── ...
├── static/                     # 静态资源
├── .babelrc                    # babel 配置
├── .editorconfig               # 缩进，空格/制表符和编辑器的设置
├── .eslintrc.js                # eslint 配置
├── .eslintignore               # eslint 忽略规则
├── .gitignore                  # gitignore
├── .postcssrc.js               # postcss 配置
├── index.html                  # index.html 模板
├── package.json                # 构建脚本和依赖关系
└── README.md                   # README file
```

<!--more-->

#### package.json

项目作为一个大家庭，每个文件都各司其职。package.json来制定名单，需要哪些npm包来参与到项目中来，npm install命令根据这个配置文件增减来管理本地的安装包。

```javascript
{
  //从name到private都是package的配置信息，即我们在脚手架搭建中输入的项目描述
  "name": "my-project", //项目名：不能以 . (点) 或 _ (下划线)开头，不能包含大写字母
  "version": "1.0.0", //项目版本号：遵循"大版本.次要版本.小版本"
  "description": "A Vue.js project", //项目描述
  "author": "kingmui <muikinghk@yahoo.com.hk>", //作者名字
  "private": true, //是否私有
  // scripts中的子项即我们在终端运行的脚本的缩写
  "scripts": {
    // webpack-dev-server：启动http服务器，实现实时编译
    // inline模式会在webpack.config.js入口配置中新增webpack-dev-server/client?http://localhost:8080/的入口,使得我们访问路径为localhost:8080/index.html（相应的还有另外一种模式Iframe）
    // progress：显示打包的进度
    "dev": "webpack-dev-server --inline --progress --config build/webpack.dev.conf.js",
    "start": "npm run dev",
    "lint": "eslint --ext .js,.vue src",
    "build": "node build/build.js"
  },
  // dependencies(项目依赖库):在安装时使用--save则写入到dependencies
  "dependencies": {
    "vue": "^2.5.2",
    "vue-router": "^3.0.1"
  },
  // devDependencies(开发依赖库)：在安装时使用--save-dev则写入到devDependencies
  "devDependencies": {
    "autoprefixer": "^7.1.2", // autoprefixer作为postcss插件用来为CSS补充前缀
    //以下几个babel开头的都是针对es6解析的插件
    "babel-core": "^6.22.1", //将 js 代码分析成 ast ，方便各个插件分析语法进行相应的处理
    "babel-eslint": "^8.2.1",
    "babel-helper-vue-jsx-merge-props": "^2.0.3", //预制babel-template函数，提供给vue,jsx等使用
    "babel-loader": "^7.1.1", //使项目运行使用Babel和webpack来传输js文件，使用babel-core提供的api进行转译
    "babel-plugin-syntax-jsx": "^6.18.0", //支持jsx
    "babel-plugin-transform-runtime": "^6.22.0", //避免编译输出中的重复，直接编译到build环境中
    "babel-plugin-transform-vue-jsx": "^3.5.0", // babel转译过程中使用到的插件，避免重复
    "babel-preset-env": "^1.3.2", //转为es5，transform阶段使用到的插件之一
    "babel-preset-stage-2": "^6.22.0", //ECMAScript第二阶段的规范
    "chalk": "^2.0.1", //在命令行输出不同颜色的文字
    "copy-webpack-plugin": "^4.0.1", //拷贝资源和文件
    "css-loader": "^0.28.0", // webpack先用css-loader加载器去解析后缀为css的文件，再使用style-loader生成一个内容为最终解析完的css代码的style标签，放到head标签里
    "eslint": "^4.15.0",
    "eslint-config-airbnb-base": "^11.3.0",
    "eslint-friendly-formatter": "^3.0.0",
    "eslint-import-resolver-webpack": "^0.8.3",
    "eslint-loader": "^1.7.1",
    "eslint-plugin-import": "^2.7.0",
    "eslint-plugin-vue": "^4.0.0",
    "extract-text-webpack-plugin": "^3.0.0", //将一个以上的包里面的文本提取到单独文件中
    "file-loader": "^1.1.4", //打包压缩文件，与url-loader用法类似
    "friendly-errors-webpack-plugin": "^1.6.1", //识别某些类别的WebPACK错误和清理，聚合和优先排序，以提供更好的开发经验
    "html-webpack-plugin": "^2.30.1", //简化了HTML文件的创建，引入了外部资源，创建html的入口文件，可通过此项进行多页面的配置
    "node-notifier": "^5.1.2", //支持使用node发送跨平台的本地通知
    "optimize-css-assets-webpack-plugin": "^3.2.0", //压缩提取出的css，并解决ExtractTextPlugin分离出的js重复问题(多个文件引入同一css文件)
    "ora": "^1.2.0", //加载(loading)的插件
    "portfinder": "^1.0.13", //查看进程端口
    "postcss-import": "^11.0.0", //可以消耗本地文件、节点模块或web_modules
    "postcss-loader": "^2.0.8", //用来兼容css的插件
    "postcss-url": "^7.2.1", // URL上重新定位、内联或复制
    "rimraf": "^2.6.0", //节点的Unix命令RM—RF,强制删除文件或者目录的命令
    "semver": "^5.3.0", //用来对特定的版本号做判断的
    "shelljs": "^0.7.6", //使用它来消除shell脚本在Unix上的依赖性，同时仍然保留其熟悉和强大的命令，即可执行Unix系统命令
    "uglifyjs-webpack-plugin": "^1.1.1", //压缩js文件
    "url-loader": "^0.5.8", //压缩文件，可将图片转为base64
    "vue-loader": "^13.3.0", // Vue单文件组件的webpack加载器
    "vue-style-loader": "^3.0.1", //类似于样式加载程序，您可以在CSS加载器之后将其链接，以将CSS动态地注入到文档中作为样式标签
    "vue-template-compiler": "^2.5.2", //预编译Vue模板到渲染函数，以避免运行时编译开销和CSP限制
    "webpack": "^3.6.0",
    "webpack-bundle-analyzer": "^2.9.0", //可视化webpack输出文件的大小
    "webpack-dev-server": "^2.9.1", //提供一个热重载的开发服务器
    "webpack-merge": "^4.1.0" //它将数组和合并对象创建一个新对象。如果遇到函数，它将执行它们，通过算法运行结果，然后再次将返回的值封装在函数中
  },
  // 指定node和npm版本
  "engines": {
    "node": ">= 6.0.0",
    "npm": ">= 3.0.0"
  },
  //限制了浏览器或者客户端需要什么版本才可运行
  "browserslist": [
    "> 1%",
    "last 2 versions",
    "not ie <= 8"
  ]
}
```

1. **devDependencies和dependencies的区别**
devDependencies里面的插件只用于开发环境，不用于生产环境，即辅助作用，打包的时候需要，打包完成就不需要了。而dependencies是需要发布到生产环境的，自始至终都在。比如wepack等只是在开发中使用的包就写入到devDependencies，而像vue这种项目全程依赖的包要写入到dependencies。
2. **file-loader和url-loader的区别**
以图片为例，[file-loader](https://www.npmjs.com/package/file-loader)可对图片进行压缩，但是还是通过文件路径进行引入，当http请求增多时会降低页面性能，而[url-loader](https://www.npmjs.com/package/url-loader)通过设定limit参数，小于limit字节的图片会被转成base64的文件，大于limit字节的将进行图片压缩的操作。总而言之，url-loader是file-loader的上层封装。

#### [.postcssrc.js](https://github.com/michael-ciniawsky/postcss-load-config)

.postcssrc.js文件其实是postcss-loader包的一个配置，在webpack的旧版本可以直接在webpack.config.js中配置，现版本中postcss的文档示例独立出.postcssrc.js，里面写进去需要使用到的插件

```javascript
module.exports = {
  "plugins": {
    "postcss-import": {},
    "postcss-url": {},
    // to edit target browsers: use "browserslist" field in package.json
    "autoprefixer": {}
  }
}
```
[postcss-import](https://www.npmjs.com/package/postcss-import)文档传送门
[postcss-url](https://www.npmjs.com/package/postcss-url)文档传送门
[autoprefixer](https://www.npmjs.com/package/autoprefixer)文档传送门

#### .babelrc

该文件是es6解析的一个配置

```javascript
{
  //制定转码的规则
  "presets": [
    //env是使用babel-preset-env插件将js进行转码成es5，并且设置不转码的AMD,COMMONJS的模块文件，制定浏览器的兼容
    ["env", {
      "modules": false,
      "targets": {
        "browsers": ["> 1%", "last 2 versions", "not ie <= 8"]
      }
    }],
    "stage-2"
  ],
  "plugins": ["transform-vue-jsx", "transform-runtime"]
}
```
[transform-vue-jsx](https://www.npmjs.com/package/babel-plugin-transform-vue-jsx)文档传送门
[transform-runtime](https://www.npmjs.com/package/babel-plugin-transform-runtime)文档传送门

#### src内文件

我们开发的代码都存放在src目录下，根据需要我们通常会再建一些文件夹。比如pages文件夹，用来存放页面；components文件夹，用来存放组件；api文件夹，封装请求的参数和方法；store文件夹，使用vuex来作为vue的状态管理工具。

① assets文件夹：在里面建立js、css、images、fonts等文件夹，作为静态资源调用

② components文件夹：用于存放组件，合理地使用组件可以高效地实现复用等功能，从而更好地开发项目。一般情况下比如创建头部组件的时候，我们会新建一个header的文件夹，然后再新建一个header.vue的文件

③ router文件夹：该文件夹下有一个叫index.js文件，用于实现页面的路由跳转，具体使用请查看[vue-router](https://router.vuejs.org/zh/)

④ App.vue：作为我们的主组件，可通过使用<router-view/>开放入口让其他的页面组件得以显示

⑤ main.js：作为我们的入口文件，主要作用是初始化vue实例并使用需要的插件，小型项目省略router时可放在该处

#### 其他文件

① .editorconfig：编辑器的配置文件

② .gitignore：忽略git提交的一个文件，配置之后提交时将不会加载忽略的文件

③ index.html：页面入口，经过编译之后的代码将插入到这来

④ package.lock.json：锁定安装时的包的版本号，并且需要上传到git，以保证其他人在npm install时大家的依赖能保持一致

⑤ README.md：在此填写项目介绍

⑥ node_modules：根据package.json安装时候生成的的依赖

### config文件夹

```javascript
├─config 
│ ├─dev.env.js
│ ├─index.js
│ ├─prod.env.js
```

#### dev.env.js

该文件主要用来设置开发环境变量。

```javascript
'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')
// 配置NODE_ENV来决定开发环境
// 这个就是用来上线的时候用到，来决定是开发环境还是生产环境，来进行相关的配置解决方案
module.exports = merge(prodEnv, {
  NODE_ENV: '"development"'
})
```

[webpack-merge](https://www.npmjs.com/package/webpack-merge)文档传送门

#### prod.env.js

该文件主要用来设置生产环境变量。

```javascript
'use strict'
// NODE_ENV决定生产环境
module.exports = {
  NODE_ENV: '"production"'
}
```

#### index.js

config文件夹下，最主要的就是index.js文件，保存着开发环境和生产环境所需要的信息。

```javascript
'use strict'
// see http://vuejs-templates.github.io/webpack for documentation.
const path = require('path')

module.exports = {
  // 开发环境下的配置
  dev: {
    // 二级目录，存放静态资源文件的目录，位于dist文件夹下
    assetsSubDirectory: 'static',
    // 发布路径，如果构建后的产品文件有用于CDN或者放到其他域名服务器，可以在这里设置，当然本地打包，本地浏览一般都将这里设置为"./"
    // 设置之后的构建的产品在注入到index.html中就会带上这里的发布路径
    assetsPublicPath: '/',
    // 代理示例： proxy: [{context: ["/auth", "/api"],target: "http://localhost:3000",}]
    // 传送门:https://doc.webpack-china.org/configuration/dev-server/#devserver-proxy
    proxyTable: {}, //可利用该属性解决跨域的问题

    // 各种Dev服务器设置
    host: 'localhost', // 可以被process.env.HOST重写
    port: 8080, // 可以被process.env.PORT重写，如果端口号占用出现问题可在此处修改
    autoOpenBrowser: false, //是否在编译（输入命令行npm run dev）后打开http://localhost:8080/页面
    // 当出现编译器错误或警告时，在浏览器中显示全屏叠加,覆盖到浏览器的项目页面的上方
    // 传送门:https://doc.webpack-china.org/configuration/dev-server/#devserver-overlay
    errorOverlay: true,
    // 是否允许窗口弹出错误信息
    // 传送门:https://www.npmjs.com/package/node-notifier
    notifyOnErrors: true,
    // webpack使用文件系统(file system)获取文件改动的通知--devServer.watchOptions 
    // 传送门:https://doc.webpack-china.org/configuration/dev-server/#devserver-watchoptions-
    poll: false,

    // Use Eslint Loader?
    // If true, your code will be linted during bundling and
    // linting errors and warnings will be shown in the console.
    useEslint: true,
    // 如果使用了eslint，违反eslint规则的错误和警告也将被显示在浏览器的透明黑色层上面
    showEslintErrorsInOverlay: false,

    /**
     * Source Maps
     */

    // 开启调试的类型
    //传送门: https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // 是否通过将哈希查询附加到文件名来生成具有缓存清除的源映射
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,
    //代码压缩后进行调bug定位将非常困难，于是引入sourcemap记录压缩前后的位置信息记录，当产生错误时直接定位到未压缩前的位置，将大大的方便我们调试
    cssSourceMap: true
  },

  // 生产环境下的配置
  build: {
    // Template for index.html
    // index编译后生成的位置和名字，根据需要改变后缀，比如index.php
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    //编译后存放生成环境代码的位置
    assetsRoot: path.resolve(__dirname, '../dist'),
    // 二级目录
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',

    /**
     * Source Maps
     */
    // production环境下生成sourceMap文件
    // 传送门:https://webpack.js.org/configuration/devtool/#production
    productionSourceMap: true,
    // 开启调试的类型
    // https://webpack.docschina.org/configuration/devtool
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    // gzip模式下需要压缩的文件的扩展名，设置js、css之后就只会对js和css文件进行压缩
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    // 是否展示webpack构建打包之后的分析报告
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
```

### build文件夹

```javascript
├─build
│ ├─build.js
│ ├─check-versions.js
│ ├─utils.js
│ ├─vue-loader.conf.js
│ ├─webpack.base.conf.js
│ ├─webpack.dev.conf.js
│ ├─webpack.prod.conf.js
```

#### build.js

该文件用于构建生产版本。package.json中的scripts的build就是node build/build.js，输入命令行 `npm run build` 对该文件进行编译生成生产环境的代码。build.js主要完成下面几件事：
1. 进行node和npm的版本检查
2. 打包时产生loading动画
3. 删除目标文件夹
4. 输出打包信息

```javascript
'use strict'
// 进行npm和node版本检查
require('./check-versions')()
// 设置当前node的环境变量为production
process.env.NODE_ENV = 'production'
// npm run build显示的进度条
// 传送门：https://github.com/sindresorhus/ora
const ora = require('ora')
// 删除文件或文件夹
// 传送门：https://github.com/isaacs/rimraf
const rm = require('rimraf')
const path = require('path')
const chalk = require('chalk')
const webpack = require('webpack')
const config = require('../config') //默认读取下面的index.js文件
const webpackConfig = require('./webpack.prod.conf')
// 填写打包时所显示的提示信息
const spinner = ora('building for production...')
// 开启loading动画
spinner.start()
// 先删除dist文件再生成新文件，因为有时候会使用hash来命名，删除整个文件可避免冗余
rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
  if (err) throw err
  webpack(webpackConfig, (err, stats) => {
    spinner.stop()
    if (err) throw err
    // 控制打包后详细文件的输出情况
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    // 打包失败，显示错误信息，并退出程序
    if (stats.hasErrors()) {
      console.log(chalk.red('  Build failed with errors.\n'))
      process.exit(1)
    }

    // 打包成功后在控制台上显示打包成功的提示信息
    console.log(chalk.cyan('  Build complete.\n'))
    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      '  Opening index.html over file:// won\'t work.\n'
    ))
  })
})
```

[ora](https://www.npmjs.com/package/ora)文档传送门
[chalk](https://www.npmjs.com/package/chalk)文档传送门
[rimraf](https://www.npmjs.com/package/rimraf)文档传送门

#### check-versions.js

该文件用于检测node和npm的版本，实现版本依赖

```javascript
'use strict'
// chalk插件，作用是在控制台中输出不同颜色的字，只能改变命令行中的字体颜色
// 传送门:https://github.com/chalk/chalk
const chalk = require('chalk')
// npm版本号的检查
// 传送门:https://docs.npmjs.com/misc/semver
const semver = require('semver')
const packageConfig = require('../package.json')
// shelljs插件，用来执行Unix系统命令
const shell = require('shelljs')
//脚本可以通过child_process模块新建子进程，执行 Unix 系统命令后转成没有空格的字符串
function exec (cmd) {
  return require('child_process').execSync(cmd).toString().trim()
}
const versionRequirements = [
  {
    name: 'node',
    // 当前node版本信息，使用semver插件把版本信息转化成规定格式
    currentVersion: semver.clean(process.version), // semver.clean('  =v1.2.3   ') // '1.2.3'
    //package.json里面所要求的node版本信息
    versionRequirement: packageConfig.engines.node
  }
]

if (shell.which('npm')) {
  versionRequirements.push({
    name: 'npm',
    // 自动调用npm --version命令，并且把参数返回给exec函数，从而获取纯净的版本号
    currentVersion: exec('npm --version'),
    // package.json里面所要求的npm版本信息
    versionRequirement: packageConfig.engines.npm
  })
}

module.exports = function () {
  const warnings = []

  // 进行版本检查，这里主要用到semver的模块,semver.satisfies(version,range),如果版本不在这个范围内，则进行报错
  for (let i = 0; i < versionRequirements.length; i++) {
    const mod = versionRequirements[i]

    if (!semver.satisfies(mod.currentVersion, mod.versionRequirement)) {
      //上面这个判断就是如果版本号不符合package.json文件中指定的版本号，就执行下面错误提示的代码
      warnings.push(mod.name + ': ' +
        chalk.red(mod.currentVersion) + ' should be ' +
        chalk.green(mod.versionRequirement)
      )
    }
  }
  // 能否正常的运行dev-server
  // 传送门：http://javascript.ruanyifeng.com/nodejs/process.html#toc9
  // process.exit方法用来退出当前进程。它可以接受一个数值参数，如果参数大于0，表示执行失败；如果等于0表示执行成功
  if (warnings.length) {
    console.log('')
    console.log(chalk.yellow('To use this template, you must update following to modules:'))
    console.log()

    for (let i = 0; i < warnings.length; i++) {
      const warning = warnings[i]
      console.log('  ' + warning)
    }

    console.log()
    process.exit(1)
  }
}
```

[semver](https://www.npmjs.com/package/semver)文档传送门

#### utils.js

utils提供工具函数，包括生成处理各种样式语言的loader，获取资源文件存放路径的工具函数。
utils.js 主要完成了下面这些事件: 
1. 计算资源文件存放路径
2. 生成cssLoaders用于加载.vue文件中的样式
3. 生成styleLoaders用于加载不在.vue文件中的单独存在的样式文件
4. 处理程序在编译过程中出现的错误，并在桌面进行错误信息的提示

```javascript
'use strict'
const path = require('path')
const config = require('../config')
// extract-text-webpack-plugin可以提取bundle中的特定文本，将提取后的文本单独存放到另外的文件
// 传送门:https://webpack.js.org/plugins/extract-text-webpack-plugin/#src/components/Sidebar/Sidebar.jsx
const ExtractTextPlugin = require('extract-text-webpack-plugin')
// 引入包的json文件
const packageConfig = require('../package.json')
// 资源存放的路径，区别在于生产环境和开发环境
exports.assetsPath = function (_path) {
  const assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory
  // path.posix：提供对路径方法的POSIX（可移植性操作系统接口）特定实现的访问，即可跨平台，区别于path.win32
  // 传送门:https://nodejs.org/api/path.html#path_path_posix
  return path.posix.join(assetsSubDirectory, _path)
}

exports.cssLoaders = function (options) {
  options = options || {}
  //使用了css-loader和postcssLoader，通过options.usePostCSS属性来判断是否使用postcssLoader中压缩等方法
  const cssLoader = {
    loader: 'css-loader',
    options: {
      // 是否使用sourceMap
      // 传送门 :https://webpack.js.org/loaders/css-loader/#src/components/Sidebar/Sidebar.jsx
      sourceMap: options.sourceMap
    }
  }

  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      // 是否使用sourceMap,postcss-loader用来解决各浏览器的前缀问题
      // 传送门:https://webpack.js.org/loaders/postcss-loader/#src/components/Sidebar/Sidebar.jsx
      sourceMap: options.sourceMap
    }
  }

  // 生成loader字符串以用于提取文本插件
  function generateLoaders (loader, loaderOptions) {
    const loaders = options.usePostCSS ? [cssLoader, postcssLoader] : [cssLoader]
    // 判断将cssLoader和postcssLoader推入loaders数组
    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }

    // 在指定该选项时提取CSS（生产构建期间就是这种情况）
    if (options.extract) {
      // 如果options.extract存在,则用extract-text-plugin提取样式
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'vue-style-loader'
      })
    } else {
      // 无需提取样式则简单使用vue-style-loader配合各种样式loader去处理vue当中的<style>里面的样式
      // 传送门:https://vue-loader.vuejs.org/en/configurations/extract-css.html
      return ['vue-style-loader'].concat(loaders)
    }
  }

  // https://vue-loader.vuejs.org/zh/guide/extract-css.html
  // cssLoaders将各种loader 转成对象形式以便styleLoaders进行处理
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
}

// 为独立样式文件生成 loader（.vue文件之外）
//  styleLoaders进行再加工处理，生成处理单独的.css、.sass、.scss等样式文件的规则
exports.styleLoaders = function (options) {
  const output = []
  // 调用cssLoaders方法 
  // 这时的usePostCSS存在
  const loaders = exports.cssLoaders(options)
  for (const extension in loaders) {
    const loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }
  return output
}

exports.createNotifierCallback = () => {
  // 引入node-notifier模块，这个模块是用来在桌面窗口提示信息，如果想要关闭直接return掉或者在webpack.dev.conf.js中关掉
  // 传送门:https://www.npmjs.com/package/node-notifier
  const notifier = require('node-notifier')

  return (severity, errors) => {
    if (severity !== 'error') return
    // 每次捕获第一个错误
    const error = errors[0]
    // 错误文件的名称
    const filename = error.file && error.file.split('!').pop()
    //当报错时输出错误信息的标题，错误信息详情，副标题以及图标
    notifier.notify({
      title: packageConfig.name,
      message: severity + ': ' + error.name,
      subtitle: filename || '',
      icon: path.join(__dirname, 'logo.png')
    })
  }
}
```

#### vue-loader.conf.js

该文件的主要作用就是处理.vue文件，解析这个文件中的每个语言块（template、script、style)，转换成js可用的js模块。主要完成如下工作：
1. 配置vue-loader，将一些遇见的文件转换成可供webpack进行模块化处理

```javascript
'use strict'
const utils = require('./utils')
const config = require('../config')
const isProduction = process.env.NODE_ENV === 'production'
const sourceMapEnabled = isProduction
  ? config.build.productionSourceMap
  : config.dev.cssSourceMap
//处理项目中的css文件，生产环境和测试环境默认是打开sourceMap，而extract中的提取样式到单独文件只有在生产环境中才需要
module.exports = {
  loaders: utils.cssLoaders({
    sourceMap: sourceMapEnabled,
    // 是否将样式提取到单独的文件
    extract: isProduction
  }),
  // 是否开启cssSourceMap, 关闭可以避免 css-loader 的 some relative path related bugs 同时可以加快构建速度
  // 传送门:https://vue-loader-v14.vuejs.org/zh-cn/options.html#csssourcemap
  cssSourceMap: sourceMapEnabled,
  // 是否通过将哈希查询附加到文件名来生成具有缓存清除的源映射
  cacheBusting: config.dev.cacheBusting,
  // 在模版编译过程中，编译器可以将某些属性，如 src 路径，转换为require调用，以便目标资源可以由 webpack 处理
  // 传送门:https://vue-loader.vuejs.org/zh-cn/options.html#transformtorequire
  transformToRequire: {
    video: ['src', 'poster'],
    source: 'src',
    img: 'src',
    image: 'xlink:href'
  }
}
```

#### webpack.base.conf.js

webpack.base.conf.js主要完成如下工作：
1. 配置webpack编译入口
2. 配置webpack输出路径和命名规则
3. 配置模块resolve规则
4. 配置不同类型模块的处理规则

```javascript
'use strict'
// node.js的文件路径，用来处理文件当中的路径问题
// 传送门:http://www.jianshu.com/p/fe41ee02efc8
const path = require('path')
const utils = require('./utils')
// 默认是index文件，引入index.js模块
const config = require('../config')
// vue-loader.conf配置文件是用来解决各种css文件的，定义了诸如css、less、sass之类的和样式有关的loader
const vueLoaderConfig = require('./vue-loader.conf')

// 此函数是用来返回当前目录的平行目录的路径，因为有个'..'
function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

const createLintingRule = () => ({
  test: /\.(js|vue)$/,
  loader: 'eslint-loader',
  enforce: 'pre',
  include: [resolve('src'), resolve('test')],
  options: {
    formatter: require('eslint-friendly-formatter'),
    emitWarning: !config.dev.showEslintErrorsInOverlay
  }
})

module.exports = {
  //基础目录（绝对路径），用于从配置中解析入口点和加载程序
  // 传送门:https://webpack.js.org/configuration/entry-context/#context
  context: path.resolve(__dirname, '../'),
  entry: {
    // 定义入口文件
    app: './src/main.js'
  },
  output: {
    // 打包生成的出口文件所放的位置
    path: config.build.assetsRoot,
    // 打包生成app.js文件
    filename: '[name].js',
    // 项目上线地址，也就是真正的文件引用路径，如果是production环境，其实这里都是'/'
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    // 省略扩展名，比方说import index from '../js/index'会默认去找index文件，然后找index.js,index.vue,index.json文件
    extensions: ['.js', '.vue', '.json'],
    //创建路径的别名，比如增加'components': resolve('src/components')等
    alias: {
      '@': resolve('src'),
    }
  },
  //使用插件配置相应文件的处理方法
  module: {
    rules: [
      ...(config.dev.useEslint ? [createLintingRule()] : []),
      //使用vue-loader将vue文件转化成js的模块
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      // js文件需要通过babel-loader进行编译成es5文件以及压缩等操作
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')]
      },
      //图片、音像、字体都使用url-loader进行处理，文件小于10000 byte 会编译成base64
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },

  //这些选项可以配置是否 polyfill 或 mock 某些 Node.js 全局变量和模块。这可以使最初为 Node.js 环境编写的代码，在其他环境（如浏览器）中运行
  //传送门:http://www.css88.com/doc/webpack/configuration/node/
  node: {
    // 防止webpack注入无用的setImmediate polyfill，因为Vue源代码包含它（尽管只在本地使用时才会使用它）
    setImmediate: false,
    // 防止webpack将模拟注入到对客户端无意义的Node本地模块中
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
}
```

[vue-loader](https://vue-loader.vuejs.org/)文档传送门
[babel-loader](https://www.npmjs.com/package/babel-loader)文档传送门

#### webpack.dev.conf.js

当执行 `npm run dev` 时，我们执行的就是该js文件，该文件主要完成以下任务：
1. 引入相关插件和配置
2. 生成处理各种样式的规则
3. 配置开发环境，如热更新、监听端口号，是否自动打开浏览器等都在webpack中的devServer中配置完成
4. 寻找可利用的端口和添加显示程序编译运行时的错误信息

```javascript
'use strict'
// utils提供工具函数，包括生成处理各种样式语言的loader，获取资源文件存放路径的工具函数
const utils = require('./utils')
const webpack = require('webpack')
// 默认是index文件
const config = require('../config')
// 将基础配置和开发环境配置或者生产环境配置合并在一起的包管理
const merge = require('webpack-merge')
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
// 对相应的文件名进行及时更改，并自动打包注入到index.html里面
// 传送门：https://webpack.js.org/plugins/html-webpack-plugin/#src/components/Sidebar/Sidebar.jsx
const HtmlWebpackPlugin = require('html-webpack-plugin')
// 识别某些类型的webpack错误并清理，汇总和优化它们以提供更好的开发者体验
// 传送门:https://www.npmjs.com/package/friendly-errors-webpack-plugin
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
// 查看空闲端口位置，默认情况下搜索8000这个端口
// 传送门:https://www.npmjs.com/package/portfinder
const portfinder = require('portfinder')

// processs为node的一个全局对象获取当前程序的环境变量，即host
// 传送门:http://javascript.ruanyifeng.com/nodejs/process.html#toc5
const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    //自动生成了css、postcss、less等规则，并进行模块转换，转换成webpack可识别的文件
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
  },
  // cheap-module-eval-source-map is faster for development
  // 增加调试信息
  // 传送门:https://doc.webpack-china.org/configuration/devtool
  devtool: config.dev.devtool,

  // 以下设置可在/config/index.js中配置
  devServer: {
    // 在开发工具(DevTools)的控制台将显示消息【如：在重新加载之前，在一个错误之前，或者模块热替换(HMR)启动时，这可能显示得很繁琐】
    // 传送门:https://doc.webpack-china.org/configuration/dev-server/#devserver-clientloglevel
    clientLogLevel: 'warning',
    // 当使用 HTML5 History API 时，任意的 404 响应都可能需要被替代为 index.html
    // 传送门:https://doc.webpack-china.org/configuration/dev-server/#devserver-historyapifallback
    historyApiFallback: {
      rewrites: [
        { from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') },
      ],
    },
    // 启动模块热更新特性
    // 传送门:https://doc.webpack-china.org/configuration/dev-server/#devserver-hot
    hot: true,
    contentBase: false, // since we use CopyWebpackPlugin.
    // 一切服务都启动用gzip方式进行压缩代码
    // 传送门:https://doc.webpack-china.org/configuration/dev-server/#devserver-compress
    compress: true,
    // 指定使用一个host,默认是localhost,获取HOST地址，该文件定义或config中index里的dev配置里获取
    // 传送门:https://doc.webpack-china.org/configuration/dev-server/#devserver-host
    host: HOST || config.dev.host,
    // 指定要监听的端口号
    // 传送门:https://doc.webpack-china.org/configuration/dev-server/#devserver-port
    port: PORT || config.dev.port,
    // 指定服务器是否自动打开默认浏览器
    // 传送门:https://doc.webpack-china.org/configuration/dev-server/#devserver-open
    open: config.dev.autoOpenBrowser,
    // 当出现编译器错误或警告时，在浏览器中显示全屏叠加,覆盖到浏览器的项目页面的上方。{warning:false,errors:true}这个选项为 显示错误和警告
    // 传送门:https://doc.webpack-china.org/configuration/dev-server/#devserver-overlay
    overlay: config.dev.errorOverlay
      ? { warnings: false, errors: true }
      : false,
    // 服务器假设运行在http://localhost:8080并且output.filename被设置为bundle.js默认。publicPath是"/"，所以你的包可以通过http://localhost:8080/bundle.js访问
    // 比如将config中的index.js dev对象的中的assertsPublicPath设置为"/asserts/"那么文件打开后将通过http://localhost:8080/asserts/来进行访问
    // 传送门:https://doc.webpack-china.org/configuration/dev-server/#devserver-publicpath-
    publicPath: config.dev.assetsPublicPath,
    // 如果你有单独的后端开发服务器API，并且希望在同域名下发送API请求，那么代理某些URL将很有用，简称就是API代理,中间件。需引入 http-proxy-middleware
    // 传送门:https://doc.webpack-china.org/configuration/dev-server/#devserver-proxy
    proxy: config.dev.proxyTable,
    // 启用quiet后，除了初始启动信息之外的任何内容都不会被打印到控制台。这也意味着来自WebPack的错误或警告在控制台不可见
    // 传送门:https://doc.webpack-china.org/configuration/dev-server/#devserver-quiet-
    quiet: true, // necessary for FriendlyErrorsPlugin
    // webpack使用文件系统（file system）获取文件改动的通知
    // 传送门:https://doc.webpack-china.org/configuration/dev-server/#devserver-watchoptions-
    watchOptions: {
      poll: config.dev.poll,
    }
  },
  plugins: [
    // DefinePlugin允许您创建可在编译时配置的全局常量。 这对于允许开发构建和发布构建之间的不同行为很有用。
    // 传送门:https://webpack.js.org/plugins/define-plugin/#src/components/Sidebar/Sidebar.jsx
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
    // 模块热替换(Hot Module Replacement 或 HMR)是 webpack 提供的最有用的功能之一。它允许在运行时更新各种模块，而无需进行完全刷新
    // 传送门:https://doc.webpack-china.org/guides/hot-module-replacement/
    new webpack.HotModuleReplacementPlugin(),
    // 当进行热更新时，相关文件名会被展示出来
    // 传送门:https://webpack.js.org/plugins/named-modules-plugin/#src/components/Sidebar/Sidebar.jsx
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    // 跳过编译时出错的代码并记录，使编译后运行时的包不会发生错误
    // 传送门:https://webpack.js.org/plugins/no-emit-on-errors-plugin/#src/components/Sidebar/Sidebar.jsx
    new webpack.NoEmitOnErrorsPlugin(),
    // 该插件可自动生成一个 html5 文件或使用模板文件将编译好的代码注入进去
    // 传送门:https://webpack.js.org/plugins/html-webpack-plugin/#src/components/Sidebar/Sidebar.jsx  
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.dev.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})

module.exports = new Promise((resolve, reject) => {
  //由于portfinder这个插件本身是从8000开始查找，这里设置查找的默认端口号
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      // 如果端口被占用就对进程设置端口
      process.env.PORT = port
      // 如果端口被占用就设置devServer的端口
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        // 添加提示信息，所在域名和端口的提示信息
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
        },
        // 窗口提示信息,调用utils工具函数的createNotifierCallBack()方法
        onErrors: config.dev.notifyOnErrors
        ? utils.createNotifierCallback()
        : undefined
      }))
      // 如果找到能用的端口号，就把配置信息提示抛出去
      resolve(devWebpackConfig)
    }
  })
})
```

#### webpack.prod.conf.js

构建的时候用到的webpack配置来自webpack.prod.conf.js，该配置同样是在webpack.base.conf基础上的进一步完善。主要完成如下工作：
1. 合并基础的webpack配置
2. 配置样式文件的处理规则，styleLoaders
3. 配置webpack的输出
4. 配置webpack插件
5. gzip模式下的webpack插件配置
6. webpack-bundle分析

```javascript
'use strict'
const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
// 将基础配置和开发环境配置或者生产环境配置合并在一起的包管理
const merge = require('webpack-merge')
// 引入webpack的基础配置
const baseWebpackConfig = require('./webpack.base.conf')
// 在webpack中拷贝文件和文件夹
// 传送门:https://doc.webpack-china.org/plugins/copy-webpack-plugin/#src/components/Sidebar/Sidebar.jsx
const CopyWebpackPlugin = require('copy-webpack-plugin')
// 文件名即使更改，自动打包并且生成相应的文件在index.html里面
// 传送门:https://webpack.js.org/plugins/html-webpack-plugin/#src/components/Sidebar/Sidebar.jsx
const HtmlWebpackPlugin = require('html-webpack-plugin')
// 它会将所有的入口 chunk(entry chunks) 中引用的 *.css，移动到独立分离的 CSS 文件
// https://doc.webpack-china.org/plugins/extract-text-webpack-plugin/#src/components/Sidebar/Sidebar.jsx
const ExtractTextPlugin = require('extract-text-webpack-plugin')
//一个用来压缩优化CSS文件的东西
// 传送门:http://npm.taobao.org/package/optimize-css-assets-webpack-plugin
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
// 一个用来压缩优化JS文件的东西
// 传送门:https://webpack.js.org/plugins/uglifyjs-webpack-plugin/#src/components/Sidebar/Sidebar.jsx
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
// 引入生产环境
const env = require('../config/prod.env')

const webpackConfig = merge(baseWebpackConfig, {
  // 将webpack基本配置和生产环境配置合并在一起，生成css,postcss,less等规则，并进行模块转换，转换成webpack可识别的文件，进行解析
  // 将CSS提取到单独文件中去
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true,
      usePostCSS: true
    })
  },
  devtool: config.build.productionSourceMap ? config.build.devtool : false,
  output: {
    // 文件打包的输出路径
    path: config.build.assetsRoot,
    // 主文件入口文件名字
    filename: utils.assetsPath('js/[name].[chunkhash].js'),
    // 非主文件入口文件名
    // 传送门:http://react-china.org/t/webpack-output-filename-output-chunkfilename/2256
    chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
  },
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    // DefinePlugin 允许创建一个在编译时可以配置的全局常量。这可能会对开发模式和发布模式的构建允许不同的行为非常有用。
    // https://doc.webpack-china.org/plugins/define-plugin/#src/components/Sidebar/Sidebar.jsx
    new webpack.DefinePlugin({
      'process.env': env
    }),
    new UglifyJsPlugin({
      uglifyOptions: {
        compress: {
          warnings: false
        }
      },
      sourceMap: config.build.productionSourceMap,
      parallel: true
    }),
    // extract css into its own file
    // 它会将所有的入口 chunk(entry chunks)中引用的 *.css，移动到独立分离的 CSS 文件
    // https://doc.webpack-china.org/plugins/extract-text-webpack-plugin/#src/components/Sidebar/Sidebar.jsx
    new ExtractTextPlugin({
      filename: utils.assetsPath('css/[name].[contenthash].css'),
      // Setting the following option to `false` will not extract CSS from codesplit chunks.
      // Their CSS will instead be inserted dynamically with style-loader when the codesplit chunk has been loaded by webpack.
      // It's currently set to `true` because we are seeing that sourcemaps are included in the codesplit bundle as well when it's `false`, 
      // increasing file size: https://github.com/vuejs-templates/webpack/issues/1110
      allChunks: true,
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin({
      cssProcessorOptions: config.build.productionSourceMap
        ? { safe: true, map: { inline: false } }
        : { safe: true }
    }),
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: config.build.index,
      template: 'index.html',
      inject: true,
      minify: {
        // 删除index.html中的注释
        removeComments: true,
        // 删除index.html中的空格
        collapseWhitespace: true,
        // 删除各种html标签属性值的双引号
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      // 注入依赖的时候按照依赖先后顺序进行注入，比如，需要先注入vendor.js，再注入app.js
      chunksSortMode: 'dependency'
    }),
    // keep module.id stable when vendor modules does not change
    // 该插件会根据模块的相对路径生成一个四位数的hash作为模块id, 建议用于生产环境。
    // 传送门:https://doc.webpack-china.org/plugins/hashed-module-ids-plugin/#src/components/Sidebar/Sidebar.jsx
    new webpack.HashedModuleIdsPlugin(),
    // enable scope hoisting
    // 预编译所有模块到一个闭包中，提升你的代码在浏览器中的执行速度
    // 传送门:https://doc.webpack-china.org/plugins/module-concatenation-plugin/#src/components/Sidebar/Sidebar.jsx
    new webpack.optimize.ModuleConcatenationPlugin(),
    // 将所有从node_modules中引入的js提取到vendor.js，即抽取库文件
    // split vendor js into its own file
    new webpack.optimize.CommonsChunkPlugin({ //抽取公共的模块
      name: 'vendor',
      minChunks (module) {
        // any required modules inside node_modules are extracted to vendor
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(
            path.join(__dirname, '../node_modules')
          ) === 0
        )
      }
    }),
    // 把webpack的runtime和manifest这些webpack管理所有模块交互的代码打包到[name].js文件中,防止build之后vendor的hash值被更新
    // 传送门:https://webpack.js.org/plugins/commons-chunk-plugin/#extra-async-commons-chunk
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      minChunks: Infinity
    }),
    // This instance extracts shared chunks from code splitted chunks and bundles them
    // in a separate chunk, similar to the vendor chunk
    // see: https://webpack.js.org/plugins/commons-chunk-plugin/#extra-async-commons-chunk
    new webpack.optimize.CommonsChunkPlugin({
      name: 'app',
      async: 'vendor-async',
      children: true,
      minChunks: 3
    }),

    // 在webpack中拷贝文件和文件夹
    // 传送门:https://doc.webpack-china.org/plugins/copy-webpack-plugin/#src/components/Sidebar/Sidebar.jsx
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.build.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})

// 提供带 Content-Encoding 编码的压缩版的资源
// 传送门:https://doc.webpack-china.org/plugins/compression-webpack-plugin/#src/components/Sidebar/Sidebar.jsx
if (config.build.productionGzip) {
  const CompressionWebpackPlugin = require('compression-webpack-plugin')

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}
// 分析 bundle 内容的插件及 CLI 工具，以便捷的、交互式、可缩放的树状图形式展现给用户。
// 传送门:https://github.com/webpack-contrib/webpack-bundle-analyzer
if (config.build.bundleAnalyzerReport) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig
```

### 参考
[vue-cli的webpack模板项目配置文件分析](http://blog.csdn.net/hongchh/article/details/55113751)
[vue-cli webpack配置分析](https://segmentfault.com/a/1190000008644830)
[vue-cli脚手架之webpack.prod.conf.js](https://www.cnblogs.com/hongdiandian/p/8319514.html)
[浅谈Vue-cli 命令行工具分析](http://www.jb51.net/article/128838.htm)