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

var querydoc = require('./api/querydoc');
router.get('/query/get', querydoc.getAllItem);
router.post('/query/create', querydoc.addItem);
router.delete('/query/:id', querydoc.removeItem);

var query = require('./api/query');
router.post('/query/execute', query.execute);

var segmentdoc = require("./api/segmentdoc");
router.post('/segment/savedoc', segmentdoc.saveItem);

var segment = require("./api/segment");
router.get('/segment', segment.getAll);
router.get('/segment/:id', segment.getById);
router.post('/segment/save', segment.save);
router.post('/segment/execute', segment.execute);
router.delete('/segment/remove/:id/:segment_document_id', segment.remove);
router.get('/segment/download/:id', segment.download);

var scenario = require("./api/scenario");
router.post('/scenario/save', scenario.save);
router.post('/scenario/name', scenario.isSameName);
router.post('/scenario/priority', scenario.savePriority);
router.get('/scenario/initialize/:type', scenario.initializeData);
router.get('/scenario/initialize/:type/:id', scenario.initializeData);
router.get('/scenario/valid', scenario.getValid);
router.get('/scenario/typecount', scenario.getScenarioCount);
router.get('/scenario/execute/plan', scenario.getExecutePlanScenario);
router.get('/scenario/:type', scenario.getAll);
router.get('/scenario/:type/:id', scenario.getById);
router.delete('/scenario/:type/remove/:id', scenario.remove);
router.get('/action/:name', scenario.getActionByName);

var approach = require("./api/approach");
router.get('/approach', approach.getOrCreate);
router.post('/approach', approach.save);

var user = require("./api/user");
router.get('/user', user.getList);
router.post('/user/mail', user.isSameMailAddress);
router.get('/user/:id', user.getById);
router.post('/user/create', user.craete);
router.post('/user/:id', user.update);
router.delete('/user/:id', user.remove);

var role = require("./api/role");
router.get('/role', role.getAll);
router.get('/role/:id', role.getById);


//
// ## SimpleServer `SimpleServer(obj)`
//
// Creates a new instance of SimpleServer with the following options:
//  * `port` - The HTTP port to listen on. If `process.env.PORT` is set, _it overrides this value_.
//
process.on('uncaughtException', function(err)
{
    console.log(err);
    
});

var server = http.createServer(router);
server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("server listening at", addr.address + ":" + addr.port);
});


