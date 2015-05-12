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
  user: 'vxc-databese-master',
  password: 'VirtUaleX001',
  server: 'oufq8kwys5.database.windows.net',
  database: 'CustomerReport',
  stream: true, // You can enable streaming globally

  options: {
    encrypt: true // Use this if you're on Windows Azure
  }
}

mssql.connect(config, function(err) {
  console.log(err);
  mssql.close();
});

//
// ## SimpleServer `SimpleServer(obj)`
//
// Creates a new instance of SimpleServer with the following options:
//  * `port` - The HTTP port to listen on. If `process.env.PORT` is set, _it overrides this value_.
//
var router = express();
var server = http.createServer(router);

router.use(express.static(path.resolve(__dirname, 'client')));

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("server listening at", addr.address + ":" + addr.port);
});
