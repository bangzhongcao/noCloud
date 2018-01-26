'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer'); 

const apiRoutes = express.Router();
app.use(apiRoutes);
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
// app.use(multer()); // for parsing multipart/form-data
//读取虚拟机数据
const InstanceData = require('../mock/instance_list.json');
const usersData = require('../mock/owner.json');
const networkData = require('../mock/network.json');
const ipPoolData = require('../mock/ipPools.json');
const pool_idData = require('../mock/ipPool_id.json');
const ipAddrData = require('../mock/ipAddr.json');
const rulesData = require('../mock/rules.json');
const metricData = require('../mock/metric.json');
const hostGroupsData = require('../mock/hostGroups.json');

const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  devServer: {
    before(app){
      // 虚拟机列表
      app.get('/noec2/instances',(req,res)=>{
          res.json({result:true,data:InstanceData});
      });
      // 虚拟机列表
      app.post('/noec2/instances',(req,res)=>{
          var data = req.body;
          console.log(data);

          res.json({result:'success'});
      });
      // 用户信息
      app.get('/auth/users',(req,res)=>{
        res.json({result:true,data:usersData});
      });
      // 网络
      app.get('/noec2/network',(req,res)=>{
        res.json({result:true,data:networkData});
      });
      // ip池
      app.get('/noec2/ippools',(req,res)=>{
        if(req.query.ippool_id){
          var id = req.query.ippool_id;
          res.json({result:true,data:pool_idData[id]});
        }else{
          res.json({result:true,data:ipPoolData});
        }
      });
      // 分配的ip地址
      app.get('/noec2/ippools/allcIP',(req,res)=>{
        res.json({result:true,data:ipAddrData});
      });
      // 单个虚拟机开机
      app.post("/noec2/instances/1001",(req,res)=>{
        res.json({result:true});
      });
      // 批量虚拟机开机
      app.post("/noec2/instances/batch/",(req,res)=>{
        res.json({result:true});
      });
      // 单个虚拟机删除
      app.delete("/noec2/instances/1001",(req,res)=>{
        res.json({result:true});
      });
      // 更新云主机信息
      app.patch("/noec2/instances/1001",(req,res)=>{
        res.json({result:true});
      });
      // 获取警告策略
      app.get('/monitor/rules/',(req,res)=>{
        res.json({result:true,data:rulesData});
      });
      // 获取监控项列表
      app.get('/monitor/metrics/',(req,res)=>{
        res.json({data:metricData});
      });
      // 获取机器组列表
      app.get('/monitor/hostgroups/',(req,res)=>{
        res.json({data:hostGroupsData});
      });
      // 新建机器组列表
      app.post('/monitor/hostgroups/',(req,res)=>{
        res.json({data:{
          "id": 343,
          "name": "test_group",
          "created_by": "root"
        }});
      });
    },
    clientLogLevel: 'warning',
    historyApiFallback: true,
    hot: true,
    compress: true,
    host: process.env.HOST || config.dev.host,
    port: process.env.PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    overlay: config.dev.errorOverlay ? {
      warnings: false,
      errors: true,
    } : false,
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxyTable,
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: config.dev.poll,
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
  ]
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${config.dev.host}:${port}`],
        },
        onErrors: config.dev.notifyOnErrors
        ? utils.createNotifierCallback()
        : undefined
      }))

      resolve(devWebpackConfig)
    }
  })
})
