var Core = require('./core');
var Creator = require("./common/createSql");
var Message = require('../config/message.json');
var QueryDoc = require("./querydoc");

//特定のテーブル情報はもたない
/** テーブル名 */
var tableName = '';
/** pk */
var pk = '';

/** 機能名 */
var functionName = 'クエリー管理';

var query = function query()
{
    Core.call(this, tableName, pk);
};

//coreModelを継承する
var util = require('util');
util.inherits(query, Core);

var model = new query();

exports.getAll = function(req, res)
{
    QueryDoc.getAllItemForWeb(function(err, doc)
    {
        if (err)
        {
            console.log('query get all error');
            console.log(err);
        }
        
        if (null === doc || 0 === doc.length) 
        {
            res.json({data: []});
        }

        var segmentdoc = require("./segmentdoc");
        model.async.forEach(doc, function(item, callback)
        {
            segmentdoc.useSegmentByQueryIdForWeb(item.id, function(err, num)
            {
                item.isUse = (0 < num);
                callback(err);
            });
        },
        function (err) 
        {
            if (err)
            {
                console.log('query get all error');
                console.log(err);
            }
            res.json({data: doc});
        });
    });
};

exports.execute = function(req, res)
{
    var request = model.getRequest();
    var creator = new Creator('query', req.body.conditionList, request);
    var sql = creator.getCountSql(req.body.tables);
    model.execute(sql, request, function(err, data)
    {
        if (err.length > 0)
        {
            console.log(err);
            res.status(510).send('data not found');
        }
        
        model.insertLog(req.session.userId, 8, Message.QUERY.I_001);
        res.json({result: data[0].count});
    });
};