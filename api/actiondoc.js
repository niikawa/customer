var DocumentDBClient = require('documentdb').DocumentClient;
var action = require('../collection/action');
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
var COLLECTION_NAME = 'action';
/** 
 * 機能名
 * @property FUNCTION_NAME
 * @type {string}
 * @final
 */
var FUNCTION_NAME = 'アクション';

var conf = require("../config/doc");
var docconf = conf();
var docDbClient = new DocumentDBClient(docconf.url, { masterKey: docconf.key });

/** 
 * アクションDocument機能APIのクラス
 * 
 * @namespace api
 * @class ActionDoc
 * @constructor
 */
var ActionDoc = new action(docDbClient, docconf.docDbName, COLLECTION_NAME);
ActionDoc.init();

/**
 * アクションの情報を取得する
 * 
 * @method getAllItemForWeb
 * @param {Function} callback コールバック
 * @return {json}
 */
exports.getAllItemForWeb = function(callback)
{
    var query = 'SELECT doc.id ,doc.logicalname, doc.physicalname, doc.description, doc.column FROM doc';
    ActionDoc.find(query, callback);
};

/**
 * IDに合致したActionコレクションの情報を取得する
 * callbackへはerr情報と対象のコレクションをセットして実行する
 * 
 * @method getItemByIdForWeb
 * @param {String} id queryコレクションID
 * @param {Function} callback コールバック
 */
exports.getItemByIdForWeb = function(id, callback)
{
    ActionDoc.getItem(id, function(err, doc)
    {
        callback(err,doc);
    });
};