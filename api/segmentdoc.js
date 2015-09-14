var DocumentDBClient = require('documentdb').DocumentClient;
var Core = require('./core');
var segment = require('../collection/segment');

var Validator = require("../helper/validator");
var logger = require("../helper/logger");
var Message = require('../config/message.json');

var conf = require("../config/doc");
var docconf = conf();
var docDbClient = new DocumentDBClient(docconf.url, { masterKey: docconf.key });
var SegmentCollection = new segment(docDbClient, 'ixcpm', 'segment');
SegmentCollection.init();

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
 * セグメントドキュメント機能APIのクラス
 * 
 * @namespace api
 * @class SegmentDoc
 * @constructor
 * @extends api.core
 */
var SegmentDoc = function SegmentDoc()
{
    Core.call(this, "", "", "");
    this.validator = new Validator();
    this.parametersRulesMap = 
    {
        saveItem: 
        {
            segment_document_id:
            [
                {func: this.validator.isRequireIfExistsProp},
            ],
            segment_name:
            [
                {func: this.validator.isRequire},
                {func: this.validator.isNotMaxOrver, condition: {max: 100}}
            ],
            condition:
            [
                {func: this.validator.isRequire}
            ],
            whereList:
            [
                {func: this.validator.isRequire}
            ],
            qIds:
            [
                {func: this.validator.isRequire}
            ]
        }
    };
};

//coreModelを継承する
var util = require('util');
util.inherits(SegmentDoc, Core);

var model = new SegmentDoc();

/**
 * リクエストパラメータのチェックを行う
 * 
 * @method validation
 * @param {string} key 実行対象メソッド名
 * @param {Object} parameters チェック対象パラメータオブジェクト
 * @return {bool} 
 */
SegmentDoc.prototype.validation = function(key ,parameters)
{
    var rules = this.parametersRulesMap[key];
    return this.validator.execute(rules, parameters);
};

/**
 * セグメントコレクションへパラメータのクエリーを発行する
 * 
 * @method getItemByQuery
 * @param {String} query クエリー
 * @param {Function} callback コールバック
 * @return 
 */
exports.getItemByQuery = function(query, callback)
{
    SegmentCollection.find(query, callback);
};

/**
 * クエリーコレクションIDを利用してセグメントコレクションの件数を取得する
 * 
 * @method getItemByQuery
 * @param {String} id クエリーコレクションID
 * @param {Function} callback コールバック
 * @return 
 */
exports.countByQueryId = function(id, callback)
{
    SegmentCollection.countByQueryId(id, callback);
};

/**
 * セグメントコレクションを保存する
 * 
 * @method saveItem
 * @param {Object} req リクエストオブジェクト
 * @param {Object} res レスポンスオブジェクト
 * @return 
 */
exports.saveItem = function(req, res)
{
    if (!model.validation("saveItem", req.body.data))
    {
        logger.error(Message.COMMON.E_103.replace("$1", FUNCTION_NAME+"[segmentdoc.saveItem]"), req);
        res.status(511).send(Message.COMMON.E_101);
        return;
    }

    var isCreate = 
        (void 0 === req.body.data.segment_document_id || '' === req.body.data.segment_document_id);
    
    if (isCreate)
    {
        SegmentCollection.addItem(req.body.data, function(err, doc)
        {
            if (err)
            {
                logger.error(Message.COMMON.E_001.replace("$1", FUNCTION_NAME+"[segmentdoc.saveItem]"), req, err);
                res.status(511).send(Message.COMMON.E_001.replace("$1", req.body.data.segment_name));
                return;
            }
            res.json({data: doc});
        });
    }
    else
    {
        SegmentCollection.updateItem(req.body.data, function(err, doc)
        {
            if (err)
            {
                logger.error(Message.COMMON.E_002.replace("$1", FUNCTION_NAME+"[segmentdoc.saveItem]"), req, err);
                res.status(511).send(Message.COMMON.E_002.replace("$1", req.body.data.segment_name));
                return;
            }
            res.json({data: doc});
        });
    }
};

/**
 * セグメントコレクションを取得する
 * 
 * @method getItemByIdForWeb
 * @param {String} id セグメントコレクションID
 * @param {Function} callback コールバック
 * @return 
 */
exports.getItemByIdForWeb = function(id, callback)
{
    //呼び出し元が同期処理を行っている場合、一度本メソッドで明示的に
    //callbackを指定しないとうまくいかない
    SegmentCollection.getItem(id, function(err, doc)
    {
        callback(err, doc);
    });
};

/**
 * セグメントコレクションを削除する
 * 
 * @method removeItemForWeb
 * @param {String} id セグメントコレクションID
 * @param {Function} callback コールバック
 * @return 
 */
exports.removeItemForWeb = function(id, callback)
{
    //呼び出し元が同期処理を行っている場合、一度本メソッドで明示的に
    //callbackを指定しないとうまくいかない
    SegmentCollection.removeItem(id, function(err, doc)
    {
        callback(err, doc);
    });
};
