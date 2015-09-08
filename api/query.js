var Core = require('./core');
var Creator = require("../helper/createSql");
var Message = require('../config/message.json');
var QueryDoc = require("./querydoc");
var Validator = require("../helper/validator");

//特定のテーブル情報はもたない
/** 
 * テーブル名
 * @property TABLE_NAME
 * @type {string}
 * @final
 */
var TABLE_NAME = '';
/** 
 * 主キー名 
 * @property PK_NAME
 * @type {string}
 * @final
 */
var PK_NAME = '';

/** 
 * SEQ名
 * @property SEQ_NAME
 * @type {string}
 * @final
 */
var SEQ_NAME = 'seq_approach';
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
var FUNCTION_NUMBER = 8;

/** 
 * クエリー機能APIのクラス
 * 
 * @namespace api
 * @class Query
 * @constructor
 * @extends api.core
 */
var Query = function Query()
{
    Core.call(this, TABLE_NAME, PK_NAME);
};

//coreModelを継承する
var util = require('util');
util.inherits(Query, Core);

var model = new Query();

/**
 * クエリー一覧を生成するための情報を取得する
 * 
 * @method getAll
 * @param {object} req リクエストオブジェクト
 * @param {object} res レスポンスオブジェクト
 * @return {json} data 操作履歴の取得結果<br>
 * 以下のプロパティを持つobjectをjsonとして返却する
 */
exports.getAll = function(req, res)
{
    console.log('query getAll start');
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
            segmentdoc.countByQueryId(item.id, function(err, docs)
            {
                if (err)
                {
                    console.log('query countByQueryId error');
                    console.log(err);
                }
                var num = (void 0 === docs)? 0 : docs.length;
                item.isUse = (0 < num);
                item.useNum = num;
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

            console.log('query getAll end');
            console.log(doc);
            res.json({data: doc});
        });
    });
};

/**
 * パラメータからクエリーを作成し実行する
 * 
 * @method execute
 * @param {object} req リクエストオブジェクト
 * @param {object} res レスポンスオブジェクト
 * @return {json} result 実行結果の件数
 */
exports.execute = function(req, res)
{
    console.log('query execute');
    console.log(req.body);
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