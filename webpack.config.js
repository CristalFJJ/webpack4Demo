const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')
module.exports = {
  mode: 'development',
  // 输入配置
  entry: { 
    // 入口文件，如果是多页项目，可配置多个
    index: './src/index.js',
    common: './src/common/test.js' //抽离公共的
  },
  // 输出配置
  output:{
    // 输出目录
    path: path.resolve(__dirname, './dist'),
    // 输出文件名 name 为 entry 的 key 值，也可以加上 hash 值， 如：[name].[hash:8].js
    filename: '[name].js',
    publicPath: './'
  },
  // Web服务器配置
  devServer:{
    open: true,
    host:'localhost',
    port:'8086',
  },
  module: {
    rules:[
      {
        test: /\.scss$/,
        use: ExtractTextWebpackPlugin.extract({
          fallback: 'style-loader',
          use: [
            "css-loader",
            "sass-loader"
          ]
        })
      },
    ]
  },
  optimization:{
    splitChunks:{
      cacheGroups:{
        common: {
          chunks: 'initial',
          name: 'common',
          minChunks: 2,
          maxInitialRequests: 5,
          minSize: 0
        },
        vendor:{ // 抽离第三插件
          test:/node_modules/,
          chunks:'initial',
          name:'vendor',
          priority:10
        }
      }
    }
  },
  plugins:[
    new CleanWebpackPlugin(["./dist"]),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './index.html',
      chunks:['common','vendor','index'], // 多入口时需要用到
      hash: true, // 插入的文件后面加一段随机数
    }),
    new CopyWebpackPlugin([{
      from:'./src/public',
      to:'public'
    }]),
    new webpack.BannerPlugin('Cristal copyRight'),
    new ExtractTextWebpackPlugin({
      filename: "css/index.css",
      disable: false
    })
  ],
}
