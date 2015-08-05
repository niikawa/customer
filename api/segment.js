var async = require('async');
var Core = require('./core');
var Creator = require("../helper/createSql");
var Message = require('../config/message.json');
var querydoc = require("./querydoc");
var segmentdoc = require("./segmentdoc");

/** テーブル名 */
var tableName = 'M_SEGMENT';
/** PK */
var pk = 'segment_id';
/** SEQ */
var seqName = 'seq_segment';
/** 機能名 */
var functionName = 'セグメント管理';

var segment = function segment()
{
    Core.call(this, tableName, pk, seqName);
};

//coreModelを継承する
var util = require('util');
util.inherits(segment, Core);

var model = new segment();

exports.getById = function(req, res)
{
    console.log('segment getById start');
    if (void 0 === req.params.id) return res.status(510).send('Invalid parameter');

    model.async.waterfall
    ([
        function(callback)
        {
            if (isFinite(req.params.id, 10))
            {
                console.log('koko1');
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
                console.log('koko2');
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

exports.getByQueryDocId = function(req, res)
{
    console.log('getByQueryDocId');
    if (!req.body.hasOwnProperty('qId')) res.status(510).send('Invalid parameter');
    if (req.body.hasOwnProperty('count'))
    {
        if (!isFinite(req.body.count, 10))
        {
            res.status(510).send('Invalid parameter');
        }
    }
    else
    {
        res.status(510).send('Invalid parameter');
    }
    
    
    var query = "SELECT doc.id, doc.segment_name, doc.qIds FROM doc";
    segmentdoc.getItemByQuery(query, function(err, docs)
    {
        if (err)
        {
            console.log('select segment document faild');
            console.log(err);
            res.status(510).send('セグメント情報の取得に失敗しました。');
        }
        var num = docs.length;
        var findCount = 0;
        var useSegmentList = [];
        for (var docIndex = 0; docIndex < num; docIndex++)
        {
            var targetDoc = docs[docIndex];
            var qNum = targetDoc.qIds.length;
            for (var qIndex = 0; qIndex < qNum; qIndex++)
            {
                if (targetDoc.qIds[qIndex] == req.body.qId)
                {
                    useSegmentList.push({id: targetDoc.id, segment_name: targetDoc.segment_name});
                    findCount++;
                    if (req.body.count == findCount) break;
                }
            }
        }
        res.json({data: useSegmentList});
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
        console.log('scenario.getBySegmentId for');
        console.log(data);
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
            if (void 0 !== err)
            {
                if (err.length > 0)
                {
                    model.insertLog(req.session.userId, 5, Message.COMMON.E_004, functionName);
                    console.log('get segment data faild');
                    console.log(err);
                    res.status(510).send('get segment data faild');
                }
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
    console.log('segment remove start');
    if (void 0 === req.params.id || void 0 === req.params.segment_document_id) res.status(510).send('parameters not found');
    
    segmentdoc.removeItemForWeb(req.params.segment_document_id, function(err, doc)
    {
        if (err) 
        {
            return res.status(510).send('document is not found');
        }
        console.log('segment doc removeItemForWeb ok');
        console.log(doc);
        
        model.tranBegin(function(err, transaction)
        {
            if (err)
            {
                console.log(err);
                
            }
            model.async.waterfall(
            [
                function(callback)
                {
                    model.removeByIdAndTran(req.params.id, transaction, function(err, data)
                    {
                        if (err.length > 0)
                        {
                            console.log("segment remove faild: segment_id="+req.params.id);
                            console.log(err);
                            callback(err, {});
                        }
                        else
                        {
                            callback(null);
                        }
                    });
                },
                function(callback)
                {
                    //削除したセグメントを利用しているシナリオの有効フラグを0にする
                    var sql = "UPDATE M_SCENARIO SET valid_flag = 0 WHERE segment_id = @segment_id";
                    var request = model.getRequest(transaction);
                    request.input("segment_id", model.db.Int, req.params.id);
                    model.execute(sql, request, function(err, data)
                    {
                        if (err.length > 0)
                        {
                            console.log("scenario.valid_flag update faild: segment_id="+req.params.id);
                            console.log(err);
                            callback(err, {});
                        }
                        else
                        {
                            callback(null);
                        }
                    });
                }
            ],
            function(err)
            {
                if (null !== err)
                {
                    console.log('scenario remove faild');
                    console.log(err);
                    
                    transaction.rollback(function(err)
                    {
                        if (err)
                        {
                            console.log('scenario remove rollback faild');
                            console.log(err);
                            res.status(510).send("システムエラーが発生しました。");
                        }
                        else
                        {
                            //model.insertLog(req.session.userId, 8, Message.COMMON.E_001, req.body.scenario.scenario_name);
                            res.status(510).send("シナリオの削除に失敗しました。");
                        }
                    });
                }
                else
                {
                    transaction.commit(function(err)
                    {
                        if (err)
                        {
                            console.log('scenario remove commit faild');
                            console.log(err);
                            res.status(510).send("システムエラーが発生しました。");
                        }
                        else
                        {
                            //model.insertLog(req.session.userId, 8, Message.COMMON.I_001, req.body.scenario.scenario_name);
                            res.status(200).send('segment remove ok');
                        }
                    });
                }
            });
        });
    });
};

exports.download = function(req, res)
{
    if (!req.params.hasOwnProperty('id')) res.status(510).send('パラメータが不正です');
    console.log('segment download start');
    
    //現状、segmentテーブルのIDしかパラメータとしてわたってこないが、拡張の可能性を考慮し
    //segment_document_idでも取得できるようにしておく
    model.async.waterfall
    ([
        function(callback)
        {
            if (isFinite(req.params.id, 10))
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
                        res.status(510).send('該当するセグメント情報はありません');
                        return;
                    }
                    callback(null, data[0]);
                });
            }
        }
    ],
    function(err, data)
    {
        //segment_document_idからsegment情報をdocumentDBから取得する
        segmentdoc.getItemByIdForWeb(data.segment_document_id, function(err, doc)
        {
            if (err) 
            {
                console.log(err);
                console.log('セグメント情報を取得できませんでした。');
                res.status(510).send('セグメント情報を取得できませんでした。');
            }
            
            //queryを組み立てるための情報を生成
            //docのwhereListにはqIdsの順番に条件句が格納されている
            var num = doc.whereList.length;
            var conditionMap = {};
            for (var index = 0; index < num; index++)
            {
                conditionMap[doc.qIds[index]] = doc.whereList[index];
            }

            //segment情報からquery情報をdocumentDBから取得する
            querydoc.getItemByIdsForWeb(doc.qIds, ['*'], function(err, docs)
            {
                console.log('segment download getItemByIdsForWeb');
                if (err)
                {
                    console.log(err);
                    console.log('セグメントするためのクエリが取得できませんでした。');
                    res.status(510).send('セグメントするためのクエリが取得できませんでした。');
                }
                
                //セグメント結果を取得するためのSQLを生成し実行する
                var request = model.getRequest();
                var params = {docs: docs, conditionMap: conditionMap};
                var creator = new Creator('segment', params, request);
                var tables = creator.mergeTablesToQueryDocInfo(docs);
                var sql = creator.getSql(tables);
                model.execute(sql, request, function(err, data)
                {
                    if (err.length > 0)
                    {
                        console.log('セグメント情報取得時にエラーが発生しました。');
                        console.log(err);
                        res.status(510).send('セグメント情報取得時にエラーが発生しました。');
                    }
                    
                    var fileHelper = require("../helper/fileHelper");
                    console.log(fileHelper);
                    var option = {path: "files/", outputCol: {id: "id"}};
                    fileHelper.write(data, option, function(err, fileInfo)
                    {

                        if (null !== err)
                        {
                            console.log(err);
                            res.status(err.status).end();
                        }
                        res.download(fileInfo.output, fileInfo.fileName, function(err)
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
