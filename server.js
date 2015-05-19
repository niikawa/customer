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
//  user: 'databese_master',
  password: 'VirtUaleX001',
  server: 'oufq8kwys5.database.windows.net',
//  server: 'customerreport.c6ykdlikt0mb.ap-northeast-1.rds.amazonaws.com',
  database: 'CustomerReport',
//  databese: 'customerreport',
  stream: true, // You can enable streaming globally

  options: {
    encrypt: true // Use this if you're on Windows Azure
//    encrypt: false 
  }
};

mssql.connect(config, function(err) {
  
  if (null != err)
  {
    console.log('データベースコネクションエラー');
    console.log(err);
  }
});

var request = require('request');
var key = 'TwKosJWQXnOc4KZak2WKPnE0lyCjqQfmrVLgFTW20gH2UCmB9a0j66eSNU7GWH+8x4xVBEVhQi+gpJQr+AgENw==';
var param = {
  "Inputs": {
    "input1": {
      "ColumnNames": [
        "純広告",
        "リスティング",
        "CV_純広告",
        "CV_リスティング"
      ],
      "Values": [
        [
          "0",
          "0",
          "0",
          "0"
        ],
        [
          "0",
          "0",
          "0",
          "0"
        ]
      ]
    }
  },
  "GlobalParameters": {}
}
var s = JSON.stringify(param);
console.log(JSON.stringify(param));
console.log(JSON.parse(s));

var options = {
  uri: 'https://ussouthcentral.services.azureml.net/workspaces/bb07a48a7dce4617b33d3a20dd4e2604/services/82d002728e7842f5828b114a21511835/execute?api-version=2.0&details=true',
  form: JSON.stringify(param),
  //body: param,
  headers: {
      'Content-Type': 'application/json',    
      'Authorization': 'bearer ' + key
  },
  auth: {
    'user': 'new.river0314@gmail.com',
    'pass' : 'taku@0314',
    'sendImmediately': false,
    'bearer': key},
};


request.post(options, function(error, response, body){
  if (!error && response.statusCode == 200) {
    console.log('request ok!');
    console.log(body.name);
  } else {
    console.log('error: '+ response.statusCode);
    console.log(response);
    console.log(body);
  }
});

var router = express();
router.use(express.static(path.resolve(__dirname, 'client')));

var customer = require('./api/customer');
router.get('/customer', customer.getAll);
router.get('/customer/:id', customer.getById);
router.get('/custmoer/detail/:id', customer.getDetail);

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


