//
// # SimpleServer
//
// A simple chat server using Socket.IO, Express, and Async.
//
var http = require('http');
var path = require('path');

var async = require('async');
var express = require('express');

var mssql = require('mssql');
var config = {
//  user: 'vxc-databese-master',
  user: 'databese_master',
  password: 'VirtUaleX001',
//  server: 'oufq8kwys5.database.windows.net',
  server: 'customerreport.c6ykdlikt0mb.ap-northeast-1.rds.amazonaws.com',
//  database: 'CustomerReport',
  databese: 'customerreport',
  stream: true, // You can enable streaming globally

  options: {
//    encrypt: true // Use this if you're on Windows Azure
    encrypt: false 
  }
};

mssql.connect(config, function(err) {
  if (null != err)
  {
    console.log('データベースコネクションエラー');
    console.log(err);
  }
});

var router = express();
router.use(express.static(path.resolve(__dirname, 'client')));

var customer = require('./api/customer');
router.get('/customer/:id', customer.getById);


//
// ## SimpleServer `SimpleServer(obj)`
//
// Creates a new instance of SimpleServer with the following options:
//  * `port` - The HTTP port to listen on. If `process.env.PORT` is set, _it overrides this value_.
//
process.on('uncaughtException', function(err) {
    console.log(err);
});

var server = http.createServer(router);
server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("server listening at", addr.address + ":" + addr.port);
});
