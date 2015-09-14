var DocumentDBClient = require('documentdb').DocumentClient;
var iflayout = require('../collection/iflayout');

/** 
 * コレクション名
 * @property COLLECTION_NAME
 * @type {string}
 * @final
 */
var COLLECTION_NAME = 'iflayout';
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
 * @class IflayoutDoc
 * @constructor
 */
var IflayoutDoc = new iflayout(docDbClient, docconf.docDbName, COLLECTION_NAME);
IflayoutDoc.init();

/**
 * アクションの情報を取得する
 * 
 * @method getAllItemForWeb
 * @param {Function} callback コールバック
 * @return {json}
 */
exports.getAllItemForWeb = function(callback)
{
    var query = 'SELECT doc.id ,doc.layout_name FROM doc';
    IflayoutDoc.find(query, callback);
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
    IflayoutDoc.getItem(id, function(err, doc)
    {
        callback(err,doc);
    });
};