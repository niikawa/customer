var async = require('async');
var Core = require('./core');
var Creator = require("../helper/createSql");
var Message = require('../config/message.json');
var querydoc = require("./querydoc");
var segmentdoc = require("./segmentdoc");
var Validator = require("../helper/validator");
var logger = require("../helper/logger");

/** 
 * テーブル名
 * @property TABLE_NAME
 * @type {string}
 * @final
 */
var TABLE_NAME = 'M_SEGMENT';
/** 
 * 主キー名 
 * @property PK_NAME
 * @type {string}
 * @final
 */
var PK_NAME = 'segment_id';
/** 
 * SEQ名
 * @property SEQ_NAME
 * @type {string}
 * @final
 */
var SEQ_NAME = 'seq_segment';
/** 
 * 機能名
 * @property FUNCTION_NAME
 * @type {string}
 * @final
 */
var FUNCTION_NAME = 'セグメント管理';
/** 
 * 機能番号
 * @property FUNCTION_NAME
 * @type {Number}
 * @final
 */
var FUNCTION_NUMBER = 5;

/** 
 * セグメント機能APIのクラス
 * 
 * @namespace api
 * @class Segment
 * @constructor
 * @extends api.core
 */
var Segment = function Segment()
{
    Core.call(this, TABLE_NAME, PK_NAME, SEQ_NAME);
    this.validator = new Validator();
    this.parametersRulesMap = 
    {
        getById:
            {id: [{func: this.validator.isRequire}] },
        getByQueryDocId:
        {
            qId: [{func: this.validator.isRequire}],
            count: [{func: this.validator.isRequire}, {func: this.validator.isNumber}]
        },
        execute:
        {
            qIds: [{func: this.validator.isRequire}]
        },
        save:
        {
            segment_name: 
            [
                {func: this.validator.isRequire},
                {func: this.validator.isNotMaxOrver, condition: {max: 100}},
            ],
            segment_document_id: [{func: this.validator.isRequire}],
            status: 
            [
                {func: this.validator.isRequire},
                {func: this.validator.isMatchValueList, condition: [0, 1]},
            ]
        },
        remove:
        {
            id: 
            [
                {func: this.validator.isRequire}, 
                {func: this.validator.isNumber}, 
                {func: this.validator.isNotMaxOrver, condition: 9223372036854775807}
            ],
            segment_document_id: [{func: this.validator.isRequire}],
        },
        download:
        {
            id: 
            [
                {func: this.validator.isRequire}, 
                {func: this.validator.isNumber}, 
                {func: this.validator.isNotMaxOrver, condition: 9223372036854775807}
            ]
        }
    };
    
};

//coreModelを継承する
var util = require('util');
util.inherits(Segment, Core);

/**
 * リクエストパラメータのチェックを行う
 * 
 * @method validation
 * @param {string} key 実行対象メソッド名
 * @param {Object} parameters チェック対象パラメータオブジェクト
 * @return {bool} 
 */
Segment.prototype.validation = function(key ,parameters)
{
    var rules = this.parametersRulesMap[key];
    return this.validator.execute(rules, parameters);
};

var model = new Segment();

exports.getById = function(req, res)
{
    if (!model.validation("getById", req.params))
    {
        logger.error(Message.COMMON.E_103.replace("$1", FUNCTION_NAME+"[segment.getById]"), req);
        res.status(511).send(Message.COMMON.E_101);
        return;
    }

    model.async.waterfall
    ([
        function(callback)
        {
            if (isFinite(req.params.id, 10))
            {
                model.getById(req.params.id, function(err, data)
                {
                    if (null !== err)
                    {
                        logger.error(Message.COMMON.E_102.replace("$1", FUNCTION_NAME+"[segment.getById -> core.getById]"), req, err);
                        model.insertLog(req.session.userId, FUNCTION_NUMBER, Message.COMMON.E_102, FUNCTION_NAME);
                    }
                    callback(err, data[0]);
                });
            }
            else
            {
                var col = "*";
                var where = "delete_flag = 0 AND segment_document_id = @segment_document_id";
                var qObj = model.getQueryObject(col, TABLE_NAME, where, '', '');
                qObj.request.input('segment_document_id', model.db.NVarChar, req.params.id);
                model.select(qObj, qObj.request, function(err, data)
                {
                    if (null !== err)
                    {
                        logger.error(Message.COMMON.E_102.replace("$1", FUNCTION_NAME+"[segment.getById -> getByDocumentId]"), req, err);
                        model.insertLog(req.session.userId, FUNCTION_NUMBER, Message.COMMON.E_102, FUNCTION_NAME);
                    }
                    callback(err, data[0]);
                });
            }
        }
    ],
    function(err, data)
    {
        if (null !== err)
        {
            res.status(511).send(req.session.userId, FUNCTION_NUMBER, Message.COMMON.E_102, FUNCTION_NAME);
            return;
        }
        //ドキュメント情報を取得する
        segmentdoc.getItemByIdForWeb(data.segment_document_id, function(err, doc)
        {
            if (null !== err)
            {
                logger.error(Message.COMMON.E_002+" "+FUNCTION_NAME+"[segment.getById -> segmentdoc.getItemByIdForWeb]", req, err);
                model.insertLog(req.session.userId, FUNCTION_NUMBER, Message.COMMON.E_102, FUNCTION_NAME);
                res.status(511).send(Message.SEGMENT.E_004.replace("$1", FUNCTION_NAME));
                return;
            }
            
            res.json({
                segment_name: data.segment_name, 
                segment_document_id: data.segment_document_id,
                whereList: doc.whereList,
                qIds: doc.qIds
            });
        });
    });
};

/**
 * クエリーコレクションIDからセグメント情報を取得する
 * 
 * @method getByQueryDocId
 * @param {Object} req リクエストオブジェクト
 *  @param {object} req.body POSTされたパラメータを格納したオブジェクト
 *   @param {String} req.body.qId クエリーコレクションID
 *   @param {Number} req.body.count 件数
 * @param {Object} res レスポンスオブジェクト
 * @return 
 *     <ul>
 *     <li>正常終了の場合:ステータスコード200</li>
 *     <li>以上終了の場合:ステータスコード510</li>
 *     </ul>
 */
exports.getByQueryDocId = function(req, res)
{
    if (!model.validation("getByQueryDocId", req.body))
    {
        logger.error(Message.COMMON.E_103.replace("$1", FUNCTION_NAME+"[segment.getByQueryDocId]"), req);
        res.status(511).send(Message.COMMON.E_101);
        return;
    }

    var query = "SELECT doc.id, doc.segment_name, doc.qIds FROM doc";
    segmentdoc.getItemByQuery(query, function(err, docs)
    {
        if (err)
        {
            logger.error(Message.COMMON.E_102.replace("$1", FUNCTION_NAME+"[segment.getByQueryDocId -> segmentdoc.getItemByQuery]"), req, err);
            model.insertLog(req.session.userId, FUNCTION_NUMBER, Message.COMMON.E_004, FUNCTION_NAME);
            res.status(511).send(Message.COMMON.E_102.replace("$1", "セグメント"));
            return;
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

/**
 * セグメント情報をすべて取得する
 * 
 * @method getList
 * @param {Object} req リクエストオブジェクト
 * @param {Object} res レスポンスオブジェクト
 * @return 
 *     <ul>
 *     <li>正常終了の場合:ステータスコード200</li>
 *     <li>以上終了の場合:ステータスコード510</li>
 *     </ul>
 */
exports.getList = function(req, res)
{
    var col = "segment_id, segment_name, FORMAT(update_date, 'yyyy/MM/dd') AS update_date, segment_document_id";
    var where = "delete_flag = 0";
    var qObj = model.getQueryObject(col, TABLE_NAME, where, '', '');
    model.select(qObj, qObj.request, function(err, data)
    {
        var scenario = require("./scenario");
        async.forEach(data, function(segment, callback)
        {
            scenario.getBySegmentId(segment.segment_id, function(err, data)
            {
                //セグメントの利用状況を設定する
                if (null !== err) segment.isUsed = (data.length > 0);
                callback(err);
            });
        },
        function (err) 
        {
            if (null !== err)
            {
                logger.error(Message.COMMON.E_102.replace("$1", FUNCTION_NAME+"[segment.getList]"), req, err);
                model.insertLog(req.session.userId, FUNCTION_NUMBER, Message.COMMON.E_004, FUNCTION_NAME);
                res.status(511).send(Message.COMMON.E_102.replace("$1", "セグメント"));
                return;
            }
            model.insertLog(req.session.userId, FUNCTION_NUMBER, Message.COMMON.I_004, FUNCTION_NAME);
            res.json({data: data});
        });    
    });
};

/**
 * 画面で選択されたクエリをもとにSQLを実行する
 * 
 * @method execute
 * @param {Object} req リクエストオブジェクト
 * @param {Object} res レスポンスオブジェクト
 * @return 
 *     <ul>
 *     <li>正常終了の場合:ステータスコード200</li>
 *     <li>以上終了の場合:ステータスコード510</li>
 *     </ul>
 */
exports.execute = function(req, res)
{
    var colmunList = [];
    colmunList.push('*');
    
    querydoc.getItemByIdsForWeb(req.body.qIds, colmunList, function(err, docs)
    {
        if (err)
        {
            logger.error(Message.COMMON.E_102.replace("$1", FUNCTION_NAME+"[segment.execute -> querydoc.getItemByIdsForWeb]"), req, err);
            model.insertLog(req.session.userId, FUNCTION_NUMBER, Message.SEGMENT.E_003, FUNCTION_NAME);
            res.status(511).send(Message.SEGMENT.E_003);
            return;
        }
        
        var request = model.getRequest();
        var params = {docs: docs, conditionMap: req.body.conditionMap};
        var creator = new Creator('segment', params, request);
        var sql = creator.getCountSql(req.body.tables);

        model.execute(sql, request, function(err, data)
        {
            if (null !== err)
            {
                logger.error(Message.COMMON.E_102.replace("$1", FUNCTION_NAME+"[segment.execute]"), req, err);
                model.insertLog(req.session.userId, FUNCTION_NUMBER, Message.SEGMENT.E_003, FUNCTION_NAME);
                res.status(511).send(Message.SEGMENT.E_003);
                return;
            }
            model.insertLog(req.session.userId, FUNCTION_NUMBER, Message.SEGMENT.I_001);
            res.json({result: data[0].count});
        });
    });
};

/**
 * セグメントを保存する
 * 
 * @method save
 * @param {Object} req リクエストオブジェクト
 * @param {Object} res レスポンスオブジェクト
 * @return 
 *     <ul>
 *     <li>正常終了の場合:ステータスコード200</li>
 *     <li>以上終了の場合:ステータスコード510</li>
 *     </ul>
 */
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

/**
 * セグメントを削除する
 * 
 * @method remove
 * @param {Object} req リクエストオブジェクト
 * @param {Object} res レスポンスオブジェクト
 * @return 
 *     <ul>
 *     <li>正常終了の場合:ステータスコード200</li>
 *     <li>以上終了の場合:ステータスコード510</li>
 *     </ul>
 */
 exports.remove = function(req, res)
{
    if (!model.validation("remove", req.params))
    {
        logger.error(Message.COMMON.E_103.replace("$1", "[segment.remove]"), req);
        res.status(511).send(Message.COMMON.E_101);
        return;
    }

    segmentdoc.removeItemForWeb(req.params.segment_document_id, function(err, doc)
    {
        var message = '';
        if (doc.hasOwnProperty('segment_name'))
        {
            message = Message.SEGMENT.E_003.replace("$1", "セグメント");
        }
        else
        {
            message = Message.COMMON.E_003.replace("$1", doc.segment_name);
        }
        
        if (err) 
        {
            logger.error(Message.COMMON.E_003.replace("$1", "[segment.remove -> segmentdoc.removeItemForWeb]"), req, err);
            model.insertLog(req.session.userId, FUNCTION_NUMBER, message);
            res.status(511).send(message);
            return;
        }

        model.tranBegin(function(err, transaction)
        {
            if (err)
            {
                logger.error(Message.COMMON.E_003.replace("$1", "[segment.remove -> tranBegin]"), req, err);
                model.insertLog(req.session.userId, FUNCTION_NUMBER, message);
                res.status(511).send(message);
            }
            model.async.waterfall(
            [
                function(callback)
                {
                    model.removeByIdAndTran(req.params.id, transaction, function(err, data)
                    {
                        if (null === err)
                        {
                            logger.error(Message.COMMON.E_003.replace("$1", "[segment.remove -> removeByIdAndTran]"), req, err);
                            model.insertLog(req.session.userId, FUNCTION_NUMBER, message);
                        }
                        callback(err, {});
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
                        if (null !== err)
                        {
                            logger.error(Message.COMMON.E_003.replace("$1", "[segment.remove -> update valid_flag]"), req, err);
                            model.insertLog(req.session.userId, FUNCTION_NUMBER, message);
                        }
                        callback(err);
                    });
                }
            ],
            function(err)
            {
                model.commitOrRollback(transaction, req, err, function(errInfo)
                {
                    if (null !== errInfo)
                    {
                        logger.error(Message.COMMON.E_003.replace("$1", "[segment.remove -> commitOrRollback]"), req, err);
                        model.insertLog(req.session.userId, FUNCTION_NUMBER, message);
                        res.status(511).send(message);
                    }
                    res.status(200).send('segment remove ok');
                });
            });
        });
    });
};

/**
 * セグメント結果をダウンロードする
 * 
 * @method download
 * @param {Object} req リクエストオブジェクト
 * @param {Object} res レスポンスオブジェクト
 * @return 
 *     <ul>
 *     <li>正常終了の場合:ステータスコード200</li>
 *     <li>以上終了の場合:ステータスコード510</li>
 *     </ul>
 */
 exports.download = function(req, res)
{
    if (!model.validation("download", req.params))
    {
        logger.error(Message.COMMON.E_103.replace("$1", "[segment.download]"), req);
        res.status(511).send(Message.COMMON.E_101);
        return;
    }
    
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
                    if (null !== err)
                    {
                        logger.error(Message.COMMON.E_003.replace("$1", "[segment.download -> getById]"), req, err);
                    }
                    callback(err, data[0]);
                });
            }
            else
            {
                var col = "*";
                var where = "delete_flag = 0 AND segment_document_id = @segment_document_id";
                var qObj = model.getQueryObject(col, TABLE_NAME, where, '', '');
                qObj.request.input('segment_document_id', model.db.NVarChar, req.params.id);
                model.select(qObj, qObj.request, function(err, data)
                {
                    if (null !== err)
                    {
                        logger.error(Message.COMMON.E_003.replace("$1", "[segment.download -> getById]"), req, err);
                    }
                    callback(err, data[0]);
                });
            }
        }
    ],
    function(err, data)
    {
        if (null !== err)
        {
            res.status(511).send(Message.SEGMENT.E_001+"<br>"+Message.COMMON.I_006);
            return ;
        }
        //segment_document_idからsegment情報をdocumentDBから取得する
        segmentdoc.getItemByIdForWeb(data.segment_document_id, function(err, doc)
        {
            if (err) 
            {
                logger.error(Message.COMMON.E_003.replace("$1", "[segment.download -> segmentdoc.getItemByIdForWeb]"), req, err);
                model.insertLog(req.session.userId, FUNCTION_NUMBER, Message.SEGMENT.E_001);
                res.status(511).send(Message.SEGMENT.E_001+"<br>"+Message.COMMON.I_006);
                return;
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
                if (err)
                {
                    logger.error(Message.COMMON.E_003.replace("$1", "[segment.download -> querydoc.getItemByIdsForWeb]"), req, err);
                    model.insertLog(req.session.userId, FUNCTION_NUMBER, Message.SEGMENT.E_005);
                    res.status(511).send(Message.SEGMENT.E_005);
                    return;
                }
                if (void 0 === docs || 0 === docs.length)
                {
                    logger.info(Message.COMMON.E_003.replace("$1", "[segment.download -> querydoc.getItemByIdsForWeb]"), req);
                    model.insertLog(req.session.userId, FUNCTION_NUMBER, Message.SEGMENT.E_005);
                    res.status(511).send(Message.SEGMENT.E_004);
                    return;
                }
                
                //セグメント結果を取得するためのSQLを生成し実行する
                var request = model.getRequest();
                var params = {docs: docs, conditionMap: conditionMap};
                var creator = new Creator('segment', params, request);
                var tables = creator.mergeTablesToQueryDocInfo(docs);
                var sql = creator.getSql(tables);
                model.execute(sql, request, function(err, data)
                {
                    if (null !== err)
                    {
                        logger.error(Message.COMMON.E_003.replace("$1", "[segment.download -> execute]"), req, err);
                        model.insertLog(req.session.userId, FUNCTION_NUMBER, Message.SEGMENT.E_005);
                        res.status(511).send(Message.SEGMENT.E_005);
                        return;
                    }
                    
                    var fileHelper = require("../helper/fileHelper");
                    var option = {path: "files/", outputCol: {id: "id"}};
                    fileHelper.write(data, option, function(err, fileInfo)
                    {
                        if (null !== err)
                        {
                            logger.error(Message.COMMON.E_104.replace("$1", "[segment.download -> write]"), req, err);
                            model.insertLog(req.session.userId, FUNCTION_NUMBER, Message.SEGMENT.E_005);
                            res.status(511).send(Message.SEGMENT.E_005);
                            return;
                        }
                        res.download(fileInfo.output, fileInfo.fileName, function(err)
                        {
                            if (err)
                            {
                                logger.error(Message.COMMON.E_105.replace("$1", "[segment.download -> download]"), req, err);
                                model.insertLog(req.session.userId, FUNCTION_NUMBER, Message.SEGMENT.E_005);
                                res.status(511).send(Message.SEGMENT.E_005);
                                return;
                            }
                        });
                    });
                });
            });
        });
    });
};
//セグメントを作成する
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

    model.insert(TABLE_NAME, insertData, request, function(err, date)
    {
        if (null !== err)
        {
            logger.error(Message.COMMON.E_001.replace("$1", "[segment.save -> create]"), req, err);
            model.insertLog(req.session.userId, FUNCTION_NUMBER, Message.COMMON.E_001, insertData.segment_name);
            res.status(511).send(Message.SEGMENT.E_001.replace("$1", insertData.segment_name));
            return;
        }
        model.insertLog(req.session.userId, FUNCTION_NUMBER, Message.COMMON.I_001, insertData.segment_name);
        res.status(200).send('insert ok');
    });
}
//セグメントを更新する
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
        if (null !== err)
        {
            logger.error(Message.COMMON.E_002.replace("$1", "[segment.save -> update]"), req, err);
            model.insertLog(req.session.userId, FUNCTION_NUMBER, Message.COMMON.E_002, updateData.segment_name);
            res.status(511).send(Message.SEGMENT.E_002.replace("$1", updateData.segment_name));
            return ;
        }
        model.insertLog(req.session.userId, FUNCTION_NUMBER, Message.COMMON.I_002, updateData.segment_name);
        res.status(200).send('update ok');
    });
}
