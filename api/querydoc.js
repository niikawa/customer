var DocumentDBClient = require('documentdb').DocumentClient;
var query = require('../collection/query');
var Creator = require("../helper/createSql");
var Core = require('./core');
var core = new Core();
var Message = require('../config/message.json');
var logger = require("../helper/logger");

/** 
 * コレクション名
 * @property COLLECTION_NAME
 * @type {string}
 * @final
 */
var COLLECTION_NAME = 'query';
/** 
 * 機能名
 * @property FUNCTION_NAME
 * @type {string}
 * @final
 */
var FUNCTION_NAME = 'クエリー管理';
/** 
 * 機能番号
 * @property FUNCTION_NAME
 * @type {Number}
 * @final
 */
var FUNCTION_NUMBER = 4;

var conf = require("../config/doc");
var docconf = conf();
var docDbClient = new DocumentDBClient(docconf.url, { masterKey: docconf.key });

/** 
 * クエリーDocument機能APIのクラス
 * 
 * @namespace api
 * @class QueryDoc
 * @constructor
 */
var QueryDoc = new query(docDbClient, docconf.docDbName, COLLECTION_NAME);
QueryDoc.init();

/**
 * IDに合致したQueryコレクションの情報と読み込み可能テーブル情報を取得する
 * 
 * @method getByIdForInit
 * @param {object} req リクエストオブジェクト
 *  @param {object} req.params GETされたパラメータを格納したオブジェクト
 *   @param {Number} req.body.id クエリーコレクションのID
 * @param {object} res レスポンスオブジェクト
 * @return {json}
 * 以下のプロパティを持つobjectをjsonとして返却する
 * <ul>
 * <li>{Objject} tables : 利用可能テーブル情報 {{#crossLink "table"}}{{/crossLink}}</li>
 * <li>{Objject} data: コレクション情報 {{#crossLink "collection.query:getItem"}}{{/crossLink}}</li>
 * </ul>
 */
exports.getByIdForInit = function(req, res)
{
    console.log('query doc getByIdForInit start');
    QueryDoc.getItem(req.params.id, function(err, doc)
    {
        if (err)
        {
            logger.error(Message.COMMON.E_102.replace("$1", FUNCTION_NAME+"[querydoc.getByIdForInit]"), req, err);
            core.insertLog(req.session.userId, FUNCTION_NUMBER, Message.COMMON.E_004, "クエリー情報");
            res.status(512).send(Message.COMMON.E_102.replace("$1", "クエリー情報"));
            return;
        }

        core.insertLog(req.session.userId, FUNCTION_NUMBER, Message.COMMON.I_004, doc.query_name);
        
        var table = require('./table');
        table.getTablesListForWeb(function(err, tables)
        {
            if (null !== err)
            {
                logger.error(Message.COMMON.E_102.replace("$1", FUNCTION_NAME+"[querydoc.getByIdForInit -> table.getTablesListForWeb]"), req, err);
                res.status(511).send(Message.COMMON.E_102.replace("$1", "クエリー情報"));
                return;
            }
            res.json({table: tables, data: doc});
        });
    });
};

/**
 * IDに合致したQueryコレクションの情報を取得する
 * 
 * @method getItem
 * @param {object} req リクエストオブジェクト
 *  @param {object} req.params GETされたパラメータを格納したオブジェクト
 *   @param {Number} req.body.id クエリーコレクションのID
 * @param {object} res レスポンスオブジェクト
 * @return {json}
 * 以下のプロパティを持つobjectをjsonとして返却する
 * <ul>
 * <li>{Objject} data: コレクション情報 {{#crossLink "collection.query:getItem"}}{{/crossLink}}</li>
 * </ul>
 */
exports.getItem = function(req, res)
{
    QueryDoc.getItem(req.params.id, function(err, doc)
    {
        if (err)
        {
            logger.error(Message.COMMON.E_102.replace("$1", FUNCTION_NAME+"[querydoc.getItem]"), req, err);
            core.insertLog(req.session.userId, FUNCTION_NUMBER, Message.COMMON.E_004, "クエリー情報");
            res.status(511).send(Message.COMMON.E_102.replace("$1", "クエリー情報"));
            return;
        }
        res.json({data: doc});
    });
};

/**
 * Queryコレクションの情報を取得する
 * 
 * @method getAllItem
 * @param {object} req リクエストオブジェクト
 * @param {object} res レスポンスオブジェクト
 * @return {json}
 * 以下のプロパティを持つobjectの配列をjsonとして返却する
 * <ul>
 * <li>{String} id: aueryコレクションID</li>
 * <li>{String} query_name: クエリー名</li>
 * <li>{Object} tables: 利用テーブル情報</li>
 * </ul>
 */
exports.getAllItem = function(req, res)
{
    var query = 'SELECT doc.id ,doc.query_name, doc.tables FROM doc';
    QueryDoc.find(query, function(err, doc)
    {
        if (err)
        {
            logger.error(Message.COMMON.E_004.replace("$1", FUNCTION_NAME+"[querydoc.getItem]"), req, err);
            core.insertLog(req.session.userId, FUNCTION_NUMBER, Message.COMMON.E_004, FUNCTION_NAME);
            res.status(511).send('access ng');
        }
        else
        {
            res.json({data: doc});
        }
    });
};

/**
 * Queryコレクションの情報を取得する
 * 
 * @method getAllItemForWeb
 * @param {Function} callback コールバック
 * @return {json}
 * 以下のプロパティを持つobjectの配列をjsonとして返却する
 * <ul>
 * <li>{String} id: aueryコレクションID</li>
 * <li>{String} query_name: クエリー名</li>
 * <li>{Object} tables: 利用テーブル情報</li>
 * </ul>
 * @example 
 * querydoc.getAllItemForWeb(function(err, data)<br>
 * { <br>
 *     //err is array<br>
 *     if (0 < err.length )<br>
 *     {<br> 
 *         //error時の処理<br>
 *     }<br>
 *     //data[0]で取得データにアクセスできる<br>
 * });<br>
 * 
 */
exports.getAllItemForWeb = function(callback)
{
    var query = 'SELECT doc.id ,doc.query_name, doc.tables FROM doc';
    QueryDoc.find(query, callback);
};

/**
 * Queryコレクションの情報を登録/更新する
 * callbackへはerr情報と更新フラグをセットして実行する
 * 
 * @method save
 * @param {Object} data 登録/更新用データオブジェクト
 * @param {Function} callback コールバック
 */
exports.save = function(data, callback)
{
    var creator = new Creator('query', data.conditionList);
    var sql = creator.getConstionString(data.tables);
    var values = creator.getValueList();
    var colTypes = creator.getColTypeList();
    
    var parameters =
    {
        query_name: data.query_name,
        tables: data.tables,
        whereList: data.whereList,
        sql: sql,
        bindInfo: values,
        columnTypeList: colTypes
    };
    var isUpdate = (data.hasOwnProperty('query_document_id'));
    if (isUpdate)
    {
        parameters.id = data.query_document_id;
        
        QueryDoc.updateItem(parameters, function(err, doc)
        {
            callback(err, isUpdate);
        });
    }
    else
    {
        QueryDoc.addItem(parameters, function(err, doc)
        {
            callback(err, isUpdate);
        });
    }
};

/**
 * Queryコレクションの情報を削除する。<br>
 * callbackへはerr情報と削除対象のコレクションをセットして実行する
 * 
 * @method removeById
 * @param {String} id queryコレクションID
 * @param {Function} callback コールバック
 */
exports.removeById = function(id, callback)
{
    QueryDoc.getItem(id, function(err, doc)
    {
        if (err)
        {
            callback(err);
        }
        else
        {
            QueryDoc.removeItem(id, function(err)
            {
                callback(err, doc);
            });
        }
    });
};

/**
 * IDに合致したQueryコレクションの情報と読み込み可能テーブル情報を取得する
 * callbackへはerr情報と対象のコレクションをセットして実行する
 * 
 * @method getItemByIdForWeb
 * @param {String} id queryコレクションID
 * @param {Function} callback コールバック
 */
exports.getItemByIdForWeb = function(id, callback)
{
    QueryDoc.getItem(id, function(err, doc)
    {
        callback(err,doc);
    });
};

/**
 * IDに合致したQueryコレクションの情報と読み込み可能テーブル情報を取得する<br>
 * callbackへはerr情報と取得結果のコレクションをセットして実行する
 * 
 * @method getItemByIdsForWeb
 * @param {Array} idList queryコレクションID
 * @param {Array} columnList 取得対象カラム
 * @param {Function} callback コールバック
 */
exports.getItemByIdsForWeb = function(idList, columnList, callback)
{
    QueryDoc.getItemByIds(idList, columnList, function(err, doc)
    {
        callback(err,doc);
    });
};
