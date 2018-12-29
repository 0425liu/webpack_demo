const path = require('path')
const webpack = require('webpack');
const glob = require("glob");
// 分离css
//消除冗余的css
const purifyCssWebpack = require("purifycss-webpack");
// html模板
const HtmlWebpackPlugin = require('html-webpack-plugin');
//静态资源输出
const copyWebpackPlugin = require("copy-webpack-plugin");
const rules = require("./webpack.rules.conf.js");
module.exports = {
    entry: {
      index: './src/pages/index/index.js',
      login: './src/pages/login/index.js'
    },
    output: {
      filename: './js/[name].js',
      path: path.resolve(__dirname, '../dist'),
    },
    module: {
      rules: [...rules]
    },
    //将外部变量或者模块加载进来
    externals: {
      // 'jquery': 'window.jQuery'
    },
    plugins: [
      // 全局暴露统一入口
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        'window.jQuery': 'jquery',
      }),
      //静态资源输出
      new copyWebpackPlugin([{
        from: path.resolve(__dirname, "../src/assets"),
        to: './assets',
        ignore: ['.*']
      }]),
      // 消除冗余的css代码
      new purifyCssWebpack({
        paths: glob.sync(path.join(__dirname, "../src/pages/*/*.html"))
      }),
    ]
  }
  // 获取html-webpack-plugin参数的方法
var getHtmlConfig = function (name, chunks) {
  return {
    template: `./src/pages/${name}/index.html`,
    filename: `${name}.html`,
    // favicon: './favicon.ico',
    // title: title,
    inject: true,
    hash: false, //开启hash  ?[hash]
    chunks: chunks,
    watchContentBase: true,
    minify: process.env.NODE_ENV === "development" ? false : {
      removeComments: true, //移除HTML中的注释
      collapseWhitespace: true, //折叠空白区域 也就是压缩代码
      removeAttributeQuotes: true, //去除属性引用
    },
  };
};
//配置页面
const htmlArray = [{
    _html: 'index',
    title: '首页',
    chunks: ['index']
  },
  {
    _html: 'login',
    title: '登录',
    chunks: ['login']
  },
];

//自动生成html模板
htmlArray.forEach((element) => {
  module.exports.plugins.push(new HtmlWebpackPlugin(getHtmlConfig(element._html, element.chunks)));
})