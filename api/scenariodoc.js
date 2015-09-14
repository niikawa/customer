var DocumentDBClient = require('documentdb').DocumentClient;
var Core = require('./core');
var scenario = require('../collection/scenario');

var Validator = require("../helper/validator");
var logger = require("../helper/logger");
var Message = require('../config/message.json');

var conf = require("../config/doc");
var docconf = conf();
var docDbClient = new DocumentDBClient(docconf.url, { masterKey: docconf.key });
var ScenarioCollection = new scenario(docDbClient, 'ixcpm', 'scenario');
ScenarioCollection.init();

/** 
 * 機能名
 * @property FUNCTION_NAME
 * @type {string}
 * @final
 */
var FUNCTION_NAME = 'シナリオ管理';
/** 
 * 機能番号
 * @property FUNCTION_NAME
 * @type {Number}
 * @final
 */
var FUNCTION_NUMBER = 6;

/** 
 * シナリオドキュメント機能APIのクラス
 * 
 * @namespace api
 * @class ScenarioDoc
 * @constructor
 * @extends api.core
 */
var ScenarioDoc = function ScenarioDoc()
{
    Core.call(this, "", "", "");
    this.validator = new Validator();
    this.parametersRulesMap = 
    {
        saveItemForTrigger: 
        {
            actionName:
            [
                {func: this.validator.isRequire},
            ],
            conditionList:
            [
                {func: this.validator.isRequire},
            ]
        },
        saveItemForSchdule: 
        {
            daysCondition:
            [
                {func: this.validator.isRequireIfExistsProp}
            ],
            weekCondition:
            [
                {func: this.validator.isRequireIfExistsProp}
            ]
        }
    };
};

//coreModelを継承する
var util = require('util');
util.inherits(ScenarioDoc, Core);

var model = new ScenarioDoc();

/**
 * リクエストパラメータのチェックを行う
 * 
 * @method validation
 * @param {string} key 実行対象メソッド名
 * @param {Object} parameters チェック対象パラメータオブジェクト
 * @return {bool} 
 */
ScenarioDoc.prototype.validation = function(key ,parameters)
{
    var rules = this.parametersRulesMap[key];
    return this.validator.execute(rules, parameters);
};

exports.getItem = function(req, res)
{
    var query = 'SELECT * FROM doc';
    
    ScenarioCollection.find(query, function(err, doc)
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
/**
 * シナリオコレクションを保存する
 * 
 * @method saveItem
 * @param {Object} req リクエストオブジェクト
 * @param {Object} res レスポンスオブジェクト
 * @return 
 */
exports.saveItem = function(req, res)
{
    var key = req.body.data.hasOwnProperty('actionId') ? "saveItemForTrigger" : "saveItemForSchdule"; 
    if (!model.validation(key, req.body.data))
    {
        logger.error(Message.COMMON.E_103.replace("$1", FUNCTION_NAME+"[scenariodoc.saveItem]"), req);
        res.status(511).send(Message.COMMON.E_101);
        return;
    }

    var isCreate = 
        (void 0 === req.body.data.segment_document_id || '' === req.body.data.segment_document_id);
    
    if (isCreate)
    {
        ScenarioCollection.addItem(req.body.data, function(err, doc)
        {
            if (err)
            {
                logger.error(Message.COMMON.E_001.replace("$1", FUNCTION_NAME+"[scenariodoc.saveItem]"), req, err);
                res.status(511).send(Message.COMMON.E_001.replace("$1", req.body.data.scenario_name));
                return;
            }
            res.json({data: doc});
        });
    }
    else
    {
        ScenarioCollection.updateItem(req.body.data, function(err, doc)
        {
            if (err)
            {
                logger.error(Message.COMMON.E_002.replace("$1", FUNCTION_NAME+"[scenariodoc.saveItem]"), req, err);
                res.status(511).send(Message.COMMON.E_002.replace("$1", req.body.data.scenario_name));
                return;
            }
            res.json({data: doc});
        });
    }
};

/**
 * シナリオコレクションを取得する
 * 
 * @method getItemByIdForWeb
 * @param {String} id シナリオコレクションID
 * @param {Function} callback コールバック
 * @return 
 */
exports.getItemByIdForWeb = function(id, callback)
{
    if (null === id)
    {
        callback(null, null);
    }
    else
    {
        ScenarioCollection.getItem(id, function(err, doc)
        {
            callback(err, doc);
        });
    }
};

exports.saveItemForWeb = function(isCrate ,parameters, callback)
{
    if (void 0 === parameters)
    {
        callback(null, null);
    }
    else
    {
        if (isCrate)
        {
            ScenarioCollection.addItem(parameters, callback);
        }
        else
        {
            ScenarioCollection.updateItem(parameters, callback);
        }
    }
};

/**
 * シナリオコレクションを取得する
 * 
 * @method getItemByIdsForWeb
 * @param {Array} ids シナリオコレクションID
 * @param {Array} columnList 取得カラム
 * @param {Function} callback コールバック
 * @return 
 */
exports.getItemByIdsForWeb = function(idList, columnList, callback)
{
    //呼び出し元が同期処理を行っている場合、一度本メソッドで明示的に
    //callbackを指定しないとうまくいかない
    ScenarioCollection.getItemByIds(idList, columnList, function(err, doc)
    {
        callback(err,doc);
    });
};

/**
 * シナリオコレクションを削除する
 * 
 * @method removeItemForWeb
 * @param {String} id シナリオコレクションID
 * @param {Function} callback コールバック
 * @return 
 */
exports.removeItemForWeb = function(id, callback)
{
    //呼び出し元が同期処理を行っている場合、一度本メソッドで明示的に
    //callbackを指定しないとうまくいかない
    ScenarioCollection.removeItem(id, function(err, doc)
    {
        callback(err, doc);
    });
};

