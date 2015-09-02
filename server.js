//
// # SimpleServer
//
// A simple chat server using Socket.IO, Express, and Async.
//
var http = require('http');
var path = require('path');
var express = require('express');
var router = express();

var morgan = require("morgan");
if (process.env.ENVIRONMENT == 'develop')
{
    // 開発環境のみ
    router.use(morgan({ format: 'dev', immediate: false }));
    
}
else if (process.env.ENVIRONMENT == 'stage')
{
    // ステージ環境のみ
}
else if (process.env.ENVIRONMENT == 'production')
{
    // 本番環境のみ
}

var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var multer = require('multer');

router.set('secretKey', 'ix-cpm-forazure');
router.set('cookieSessionKey', 'sid');
router.use(cookieParser(router.get('secretKey')));
router.use(session({
     secret : router.get('secretKey'),
     resave : true,
     saveUninitialized : true,
}));

router.use(express.static(path.resolve(__dirname, 'client')));
router.use(express.static(path.resolve(__dirname, 'files')));
//var upload = multer({ dest: 'uploads/'})

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));
router.use(multer({dest: 'uploads/'}).single("file"));

//router.use(bodyParser.urlencoded());


var auth = require('./api/auth');
router.post('/auth/login', auth.login);
router.post('/auth/isLogin', auth.isLogin);
router.post('/auth/logout', auth.logout);

var customer = require('./api/customer');
router.get('/customer', customer.getAll);
router.get('/customer/:id', customer.getById);
router.get('/custmoer/detail/:id', customer.getDetail);
router.get('/custmoer/orders/:id', customer.orders);

var azure = require('./api/azureapi');
router.get('/azure/recomender/:id', azure.recommenderItem);

var table = require('./api/table');
router.get('/query', table.getTables);

var query = require('./api/query');
router.get('/query/list', query.getAll);
router.post('/query/execute', query.execute);

var querydoc = require('./api/querydoc');
router.get('/query/get', querydoc.getAllItem);
router.get('/query/control/:id', querydoc.getByIdForInit);
router.post('/query/create', querydoc.addItem);
router.delete('/query/:id', querydoc.removeItem);

var segmentdoc = require("./api/segmentdoc");
router.post('/segment/savedoc', segmentdoc.saveItem);

var segment = require("./api/segment");
router.get('/segment', segment.getList);
router.get('/segment/:id', segment.getById);
router.post('/segment/save', segment.save);
router.post('/segment/execute', segment.execute);
router.post('/segment/query/use', segment.getByQueryDocId);
router.delete('/segment/remove/:id/:segment_document_id', segment.remove);
router.get('/segment/:id/download', segment.download);

var scenario = require("./api/scenario");
router.post('/scenario/save', scenario.save);
router.post('/scenario/name', scenario.isSameName);
router.post('/scenario/priority', scenario.savePriority);
router.get('/scenario/initialize/:type', scenario.initializeData);
router.get('/scenario/initialize/:type/:id', scenario.initializeData);
router.get('/scenario/valid', scenario.getValid);
router.get('/scenario/typecount', scenario.getScenarioCount);
router.get('/scenario/execute/plan', scenario.getExecutePlanScenario);
router.get('/scenario/bulkInvalid', scenario.bulkInvalid);
router.get('/scenario/bulkEnable', scenario.bulkEnable);
router.get('/scenario/:type', scenario.getAll);
router.get('/scenario/:type/:id', scenario.getById);
router.delete('/scenario/:type/remove/:id', scenario.remove);
router.get('/action/:name', scenario.getActionByName);

router.get('/calendar', scenario.getExecutePlanScenarioToCalendar);
router.get('/calendar/one/:day', scenario.getExecutePlanScenarioToCalendar);
router.get('/calendar/:year/:month', scenario.getExecutePlanScenarioToCalendar);

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

var access = require("./api/access");
router.post('/access', access.getDayAll);

var bug = require("./api/bug");
router.get('/bug/main/download/:id', bug.download);
router.get('/bug/comment/download/:id', bug.downloadByCommentId);
router.get('/bug/resolve/:id', bug.resolve);
router.get('/bug/vote/:id', bug.vote);
router.get('/bug/comment/:id', bug.getComment);
router.post('/bug/save', bug.save);
router.post('/bug/save/upload', bug.save);
router.post('/bug/save/comment', bug.saveComment);
router.post('/bug/save/comment/upload', bug.saveComment);
router.post('/bug', bug.getByConditon);

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
server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function()
{
  var addr = server.address();
  console.log("server listening at", addr.address + ":" + addr.port);
  
    var mssql = require('mssql');
    var config = 
    {
      user: 'vxc-databese-master',
      password: 'VirtUaleX001',
      server: 'oufq8kwys5.database.windows.net',
      database: 'CustomerReport',
      stream: true, // You can enable streaming globally
    
      options: {
        encrypt: true // Use this if you're on Windows Azure
      },
      pool: {
            max: 10,
            min: 0,
            idleTimeoutMillis: 50000
        }  
    };
    
    mssql.connect(config, function(err)
    {
      
      if (null != err)
      {
        console.log('データベースコネクションエラー');
        console.log(err);
      }
    });
});


