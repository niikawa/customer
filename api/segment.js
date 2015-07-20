var async = require('async');
var Core = require('./core');
var Creator = require("./common/createSql");
var Message = require('../config/message.json');
var querydoc = require("./querydoc");
var segmentdoc = require("./segmentdoc");

/** テーブル名 */
var tableName = 'M_SEGMENT';
/** PK */
var pk = 'segment_id';
/** 機能名 */
var functionName = 'セグメント管理';

var segment = function segment()
{
    Core.call(this, tableName, pk);
};

//coreModelを継承する
var util = require('util');
util.inherits(segment, Core);

var model = new segment();

exports.getById = function(req, res)
{
    if (void 0 === req.params.id) return res.status(510).send('Invalid parameter');

    model.async.waterfall
    ([
        function(callback)
        {
            if (isFinite(parseInt(req.params.id, 10)))
            {
                model.getById(req.params.id, function(err, data)
                {
                    if (err.length > 0)
                    {
                        console.log(err);
                        res.status(510).send('該当するセグメント情報はありません');
                        return;
                    }
                    callback(null, data[0]);
                });
            }
            else
            {
                var col = "*";
                var where = "delete_flag = 0 AND segment_document_id = @segment_document_id";
                var qObj = model.getQueryObject(col, tableName, where, '', '');
                qObj.request.input('segment_document_id', model.db.NVarChar, req.params.id);
                model.select(qObj, qObj.request, function(err, data)
                {
                    if (err.length > 0)
                    {
                        console.log(err);
                        res.status(510).send('object not found');
                        return;
                    }
                    callback(null, data[0]);
                });
            }
        }
    ],
    function(err, data)
    {
        segmentdoc.getItemByIdForWeb(data.segment_document_id, function(err, doc)
        {
            if (err) res.status(510).send('document is not found');
            
            res.json({
                segment_name: data.segment_name, 
                segment_document_id: data.segment_document_id,
                whereList: doc.whereList,
                qIds: doc.qIds
            });
        });
    });
};

/** misiyou */
exports.getAll = function(req, res)
{
    model.getAll(function(err, data)
    {
        if (err)
        {
            console.log(err);
            //レスポンスコード確認
            res.json({data: data});
        }
        else
        {
            res.json({data: data});
        }
    });
};

exports.getList = function(req, res)
{
    var col = "segment_id, segment_name, FORMAT(update_date, 'yyyy/MM/dd') AS update_date, segment_document_id";
    var where = "delete_flag = 0";
    var qObj = model.getQueryObject(col, tableName, where, '', '');
    model.select(qObj, qObj.request, function(err, data)
    {
        //セグメントの利用状況を設定する
        var scenario = require("./scenario");
        async.forEach(data, function(segment, callback)
        {
            scenario.getBySegmentId(segment.segment_id, function(err, data)
            {
                segment.isUsed = (data.length > 0);
                callback(err);
            });
        },
        function (err) 
        {
            if (err.length > 0)
            {
                model.insertLog(req.session.userId, 5, Message.COMMON.E_004, functionName);
                console.log('get segment data faild');
                console.log(err);
                res.status(510).send('get segment data faild');
            }
            model.insertLog(req.session.userId, 5, Message.COMMON.I_004, functionName);
            res.json({data: data});
        });    
    });
};

exports.execute = function(req, res)
{
    console.log('segment exexute start');
    var colmunList = [];
    colmunList.push('*');
    
    querydoc.getItemByIdsForWeb(req.body.qIds, colmunList, function(err, docs)
    {
        if (err)
        {
            console.log(err);
            console.log(req.body.qIds);
            res.status(510).send('docs not found');
        }
        
        var request = model.getRequest();
        var params = {docs: docs, conditionMap: req.body.conditionMap};
        var creator = new Creator('segment', params, request);
        var sql = creator.getCountSql(req.body.tables);

        model.execute(sql, request, function(err, data)
        {
            if (err.length > 0)
            {
                console.log(err);
                res.status(510).send('data not found');
            }
            model.insertLog(req.session.userId, 5, Message.SEGMENT.I_001);
            res.json({result: data[0].count});
        });
    });
};

exports.save = function(req, res)
{
    var isCreate = 
        (void 0 === req.body.data.segment_id || '' === req.body.data.segment_id);
    if (isCreate)
    {
        create(req, res);
    }
    else
    {
        update(req, res);
    }
};

exports.remove = function(req, res)
{
    if (void 0 === req.params.id || void 0 === req.params.segment_document_id) res.status(510).send('parameters not found');
    
    segmentdoc.removeItemForWeb(req.params.segment_document_id, function(err, doc)
    {
        if (err) res.status(510).send('document is not found');
        
        model.removeById(req.params.id, function(err, data)
        {
           if (err.length > 0)
           {
                console.log(err);
                res.status(510).send('object not found');
           }
           res.status(200).send('delete ok').end();
        });
    });
};

exports.download = function(req, res)
{
    if (!req.params.hasOwnProperty('id')) res.status(510).send('パラメータが不正です');
    console.log('segment download start');
    
    model.async.waterfall
    ([
        function(callback)
        {
            if (isFinite(parseInt(req.params.id, 10)))
            {
                model.getById(req.params.id, function(err, data)
                {
                    if (err.length > 0)
                    {
                        console.log(err);
                        res.status(510).send('該当するセグメント情報はありません');
                        return;
                    }
                    console.log('segment download get by id ');
                    console.log(data[0]);
                    callback(null, data[0]);
                });
            }
            else
            {
                var col = "*";
                var where = "delete_flag = 0 AND segment_document_id = @segment_document_id";
                var qObj = model.getQueryObject(col, tableName, where, '', '');
                qObj.request.input('segment_document_id', model.db.NVarChar, req.params.id);
                model.select(qObj, qObj.request, function(err, data)
                {
                    if (err.length > 0)
                    {
                        console.log(err);
                        res.status(510).send('object not found');
                        return;
                    }
                    callback(null, data[0]);
                });
            }
        }
    ],
    function(err, data)
    {
        console.log('segment download getItemByIdForWeb');
        console.log(data.segment_document_id);
        segmentdoc.getItemByIdForWeb(data.segment_document_id, function(err, doc)
        {
            if (err) res.status(510).send('document is not found');
            
            // res.json({
            //     segment_name: data.segment_name, 
            //     segment_document_id: data.segment_document_id,
            //     whereList: doc.whereList,
            //     qIds: doc.qIds
            // });
            console.log('query getItemByIdsForWeb');
            console.log(querydoc);
            
            querydoc.getItemByIdsForWeb(doc.qIds, ['*'], function(err, docs)
            {
                
                console.log('segment download getItemByIdsForWeb');
                console.log(docs);
                
                
                
                if (err)
                {
                    console.log(err);
                    console.log(doc.qIds);
                    res.status(510).send('docs not found');
                }
                
                // var request = model.getRequest();
                // var params = {docs: docs, conditionMap: req.body.conditionMap};
                // var creator = new Creator('segment', params, request);
                // var sql = creator.getCountSql(req.body.tables);
                
                // console.log();
        
                // model.execute(sql, request, function(err, data)
                // {
                //     if (err.length > 0)
                //     {
                //         console.log(err);
                //         res.status(510).send('data not found');
                //     }
                //     model.insertLog(req.session.userId, 5, Message.SEGMENT.I_001);
                //     res.json({result: data[0].count});
                // });
                
                res.download('files/test.csv', 'aaaaa.csv', function(err)
                {
                    if (err)
                    {
                        console.log(err);
                        res.status(err.status).end();
                    }
                });
        
                
            });
        });
    });
    
};

function create(req, res)
{
    var commonColumns = model.getInsCommonColumns();
    var insertData = model.merge(req.body.data, commonColumns);
    insertData.status = 1;
    var request = model.getRequest();
    request.input('delete_flag', model.db.SmallInt, insertData.delete_flag);
    request.input('create_by', model.db.Int, req.session.userId);
    request.input('create_date', model.db.NVarChar, insertData.create_date);
    request.input('update_by', model.db.Int, req.session.userId);
    request.input('update_date', model.db.NVarChar, insertData.update_date);
    request.input('segment_name', model.db.NVarChar, insertData.segment_name);
    request.input('status', model.db.SmallInt, insertData.status);
    request.input('segment_document_id', model.db.NVarChar, insertData.segment_document_id);

    model.insert(tableName, insertData, request, function(err, date)
    {
        if (err.length > 0)
        {
            model.insertLog(req.session.userId, 5, Message.COMMON.E_001, insertData.segment_name);
            console.log(err);
            res.status(510).send('object not found');
        }
        model.insertLog(req.session.userId, 5, Message.COMMON.I_001, insertData.segment_name);
        res.status(200).send('insert ok');
    });
}

function update(req, res)
{
    var commonColumns = model.getUpdCommonColumns();
    var updateData = model.merge(req.body.data, commonColumns);
    var request = model.getRequest();
    request.input('update_by', model.db.Int, req.session.userId);
    request.input('update_date', model.db.NVarChar, updateData.update_date);
    request.input('segment_name', model.db.NVarChar, updateData.segment_name);
    request.input('segment_document_id', model.db.NVarChar, updateData.segment_document_id);

    model.updateById(updateData, request, function(err, date)
    {
        if (err.length > 0)
        {
            model.insertLog(req.session.userId, 5, Message.COMMON.E_002, updateData.segment_name);
            console.log(err);
            res.status(510).send('object not found');
        }
        model.insertLog(req.session.userId, 5, Message.COMMON.I_002, updateData.segment_name);
        res.status(200).send('update ok');
    });
}
