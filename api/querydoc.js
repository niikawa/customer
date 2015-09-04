var DocumentDBClient = require('documentdb').DocumentClient;
var query = require('../collection/query');
var Creator = require("../helper/createSql");
var Core = require('./core');
var core = new Core();
var Message = require('../config/message.json');
var functionName = 'クエリー管理';

var conf = require("../config/doc");
console.log(conf());
var docconf = conf();
var docDbClient = new DocumentDBClient(docconf.url, { masterKey: docconf.key });

var Query = new query(docDbClient, 'ixcpm', 'query');
Query.init();

exports.getByIdForInit = function(req, res)
{
    console.log('query doc getByIdForInit start');
    Query.getItem(req.params.id, function(err, doc)
    {
        if (err)
        {
            console.log('query doc getByIdForInit error');
            console.log(err);
            res.status(511).send('クエリー情報の取得に失敗しました');
            core.insertLog(req.session.userId, 8, Message.COMMON.E_004, functionName);
        }

        core.insertLog(req.session.userId, 8, Message.COMMON.I_004, doc.query_name);
        
        var table = require('./table');
        table.getTablesListForWeb(function(err, tables)
        {
            if (0 < err.length)
            {
                console.log('get tableList faild');
                console.log(err);
                res.status(511).send('クエリー情報の取得に失敗しました');
                return;
            }
            res.json({table: tables, data: doc});
        });
    });
};


exports.getItem = function(req, res)
{
    Query.getItem(req.params.id, function(err, doc)
    {
        if (err)
        {
            res.status(511).send('access ng');
            
        }
        else
        {
            res.json({data: doc});
        }
    });
};

exports.getAllItem = function(req, res)
{
    var query = 'SELECT doc.id ,doc.query_name, doc.tables FROM doc';
    Query.find(query, function(err, doc)
    {
        if (err)
        {
            core.insertLog(req.session.userId, 8, Message.COMMON.E_004, functionName);
            res.status(511).send('access ng');
        }
        else
        {
            res.json({data: doc});
        }
    });
};

exports.getAllItemForWeb = function(callback)
{
    var query = 'SELECT doc.id ,doc.query_name, doc.tables FROM doc';
    Query.find(query, callback);
};

exports.addItem = function(req, res)
{
    if (!req.session.isLogin) {
        
        res.status(511).send('authentication faild');
    }
    
    if (void 0 === req.body)
    {
        res.status(511).send('parameters not found');
    }

    var creator = new Creator('query', req.body.conditionList);
    var sql = creator.getConstionString(req.body.tables);
    var values = creator.getValueList();
    var colTypes = creator.getColTypeList();
    
    var parameters =
    {
        query_name: req.body.query_name,
        tables: req.body.tables,
        whereList: req.body.whereList,
        sql: sql,
        bindInfo: values,
        columnTypeList: colTypes
    };
    var isUpdate = (req.body.hasOwnProperty('query_document_id'));
    if (isUpdate)
    {
        parameters.id = req.body.query_document_id;
        
        Query.updateItem(parameters, function(err, doc)
        {
            if (err)
            {
                core.insertLog(req.session.userId, 8, Message.COMMON.E_002, parameters.query_name);
                res.status(511).send('access ng');
                
            } else
            {
                core.insertLog(req.session.userId, 8, Message.COMMON.I_002, parameters.query_name);
                res.status(200).send('create query succsess');
            }
        });
    }
    else
    {
        Query.addItem(parameters, function(err, doc)
        {
            if (err)
            {
                core.insertLog(req.session.userId, 8, Message.COMMON.E_001, parameters.query_name);
                res.status(511).send('access ng');
                
            } else
            {
                core.insertLog(req.session.userId, 8, Message.COMMON.I_001, parameters.query_name);
                res.status(200).send('create query succsess');
            }
        });
    }
};

exports.removeItem = function(req, res)
{
    if (!req.session.isLogin) {
        
        res.status(511).send('authentication faild');
    }
    
    if (void 0 === req.params)
    {
        res.status(511).send('parameters not found');
    }

    Query.removeItem(req.params.id, function(err, doc)
    {
        if (err)
        {
            core.insertLog(req.session.userId, 8, Message.COMMON.I_001, 'クエリー');
            res.status(511).send('access ng');
            
        }
        else
        {
            core.insertLog(req.session.userId, 8, Message.COMMON.I_001, 'クエリー');
            res.json({data: doc});
        }
    });
};

exports.getItemByIdForWeb = function(id, callback)
{
    Query.getItem(id, function(err, doc)
    {
        callback(err,doc);
    });
};

exports.getItemByIdsForWeb = function(idList, columnList, callback)
{
    Query.getItemByIds(idList, columnList, function(err, doc)
    {
        callback(err,doc);
    });
};
