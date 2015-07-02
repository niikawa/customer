var async = require('async');
var DocumentDBClient = require('documentdb').DocumentClient;
var query = require('../collection/query');
var Creator = require("./common/createSql");

var docDbClient = new DocumentDBClient('https://ixcpm.documents.azure.com:443/', {
    masterKey: 'BAVJ6Lb3xefcLJVh7iShAAngAHrYC08mtTj2ieVIVXuoBkftXwxKSCJaOcNrvctBwhi6oFoG6GlDVrDiDyXOzg=='
});
var Query = new query(docDbClient, 'ixcpm', 'cpm');
Query.init();

exports.getItem = function(req, res)
{
    var query = 'SELECT * FROM doc';
    
    Query.find(query, function(err, doc)
    {
        if (err) {
            
            res.status(511).send('access ng');
            
        } else {
            
            res.json({data: doc});
        }
    });
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
    
    var creator = new Creator(req.body.conditionList);
    var sql = creator.getSql(req.body.tables);
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

    Query.addItem(parameters, function(err, doc)
    {
        if (err) {
            
            res.status(511).send('access ng');
            
        } else {
            
            res.status(200).send('create query succsess');
        }
    });
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
        if (err) {
            
            res.status(511).send('access ng');
            
        } else {
            
            res.json({data: doc});
        }
    });
};