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
};

mssql.connect(config, function(err) {
  
  if (null != err)
  {
    console.log('データベースコネクションエラー');
    console.log(err);
  }
});

var router = express();
router.set('secretKey', 'ix-cpm-forazure');
router.set('cookieSessionKey', 'sid');
router.use(express.cookieParser(router.get('secretKey')));
router.use(express.session({secret: router.get('secretKey')}));

router.use(express.static(path.resolve(__dirname, 'client')));
router.use(express.bodyParser());
router.use(express.json());
router.use(express.urlencoded());
router.use(express.methodOverride());

var auth = require('./api/auth');
router.post('/auth/login', auth.login);
router.post('/auth/isLogin', auth.isLogin);

var customer = require('./api/customer');
router.get('/customer', customer.getAll);
router.get('/customer/:id', customer.getById);
router.get('/custmoer/detail/:id', customer.getDetail);
router.get('/custmoer/orders/:id', customer.orders);

var azure = require('./api/azureapi');
router.get('/azure/recomender/:id', azure.recommenderItem);

var table = require('./api/table');
router.get('/query', table.getTables);

var query = require("./api/query");
router.get('/query/get', query.getItem);
router.post('/query/create', query.addItem);

var segment = require("./api/segment");
router.get('/segment', segment.getItem);
router.post('/segment/create', segment.addItem);

var user = require("./api/user");
router.get('/user', user.getList);
router.get('/user/:id', user.getById);
router.post('/user/create', user.craete);
router.put('/user', user.update);
router.delete('/user/:id', user.remove);
router.post('/user/mail', user.isSameMailAddress);

var role = require("./api/role");
router.get('/role', role.getAll);
router.get('/role/:id', role.getById);


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


