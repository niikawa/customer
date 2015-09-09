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
var FUNCTION_NUMBER = 4;

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
    this.validator = new Validator();
    this.parametersRulesMap = 
    {
        save: 
        {
            query_name:
            [
                {
                    func: this.validator.isRequire
                },
                {
                    func: this.validator.isNotMaxOrver,
                    condition: {max: 50}
                }
            ],
            query_document_id:
            [
                {
                    func: this.validator.isRequireIfExistsProp
                }
            ],
            conditionList:
            [
                {
                    func: this.validator.isRequire
                }
            ],
            tables:
            [
                {
                    func: this.validator.isRequire
                }
            ],
        }
    };
};

//coreModelを継承する
var util = require('util');
util.inherits(Query, Core);

/**
 * リクエストパラメータのチェックを行う
 * 
 * @method validation
 * @param {string} key 実行対象メソッド名
 * @param {Object} parameters チェック対象パラメータオブジェクト
 * @return {bool} 
 */
Query.prototype.validation = function(key ,parameters)
{
    var rules = this.parametersRulesMap[key];
    return this.validator.execute(rules, parameters);
};

var model = new Query();

/**
 * クエリー一覧を生成するための情報を取得する
 * 
 * @method getAll
 * @param {object} req リクエストオブジェクト
 * @param {object} res レスポンスオブジェクト
 * @return {json} data 操作履歴の取得結果<br>
 * 以下のプロパティを持つobjectの配列をjsonとして返却する
 * <ul>
 * <li>{String} id : ドキュメントID</li>
 * <li>{String} query_name: クエリー名</li>
 * <li>{Object} tables: key->利用テーブル名 value->カラム情報のオブジェクト</li>
 * <li>{Bool} isUse: セグメントで利用されているか</li>
 * <li>{Number} useNum: 利用しているセグメント数</li>
 * </ul>
 */
exports.getAll = function(req, res)
{
    QueryDoc.getAllItemForWeb(function(err, doc)
    {
        if (err)
        {
            console.log(model.appendUserInfoString(Message.COMMON.E_102, req).replace("$1", FUNCTION_NAME+"[query.getAll]"));
            console.log(err);
            res.status(510).send(Message.QUERY.E_001);
            return;
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
                    console.log(model.appendUserInfoString(
                        Message.COMMON.E_102, req).replace("$1", FUNCTION_NAME+"[query.getAll -> setmentdoc.countByQueryId]"));
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
                res.status(510).send(Message.QUERY.E_001);
                return;
            }
            model.insertLog(req.session.userId, FUNCTION_NUMBER, Message.COMMON.I_004);
            res.json({data: doc});
        });
    });
};

/**
 * パラメータからクエリーを作成し実行する
 * 
 * @method execute
 * @param {object} req リクエストオブジェクト
 *  @param {object} req.body POSTされたパラメータを格納したオブジェクト
 *   @param {Object} req.body.tables 利用テーブルとカラムを保持したオブジェクト
 *   @param {Array} req.body.conditionList 条件句を生成するための条件を保持した配列
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
        if (0 < err.length)
        {
            console.log(model.appendUserInfoString(Message.QUERY.E_002, req).replace("$1", FUNCTION_NAME+"[query.execute]"));
            console.log(err);
            model.insertLog(req.session.userId, FUNCTION_NUMBER, Message.QUERY.E_002);
            res.status(510).send(Message.QUERY.E_002);
            return;
        }
        
        model.insertLog(req.session.userId, FUNCTION_NUMBER, Message.QUERY.I_001);
        res.json({result: data[0].count});
    });
};

/**
 * クエリーの登録/更新を行う
 * 
 * @method save
 * @param {object} req リクエストオブジェクト
 *  @param {object} req.body POSTされたパラメータを格納したオブジェクト
 *   @param {Object} req.body.tables 利用テーブルとカラムを保持したオブジェクト
 *   @param {Array} req.body.conditionList 条件句を生成するための条件を保持した配列
 * @param {object} res レスポンスオブジェクト
 * @return {json} result 実行結果の件数
 */
exports.save = function(req, res)
{
    if (!model.validation("save", req.body))
    {
        console.log(model.appendUserInfoString(Message.COMMON.E_101, req).replace("$1", FUNCTION_NAME+"[approach.save]"));
        res.status(511).send(Message.COMMON.E_101);
        return;
    }
    QueryDoc.addItem(req.body, function(err, isUpdate)
    {
        var message = "";
        if (err)
        {
            message = isUpdate ? Message.COMMON.E_002 : Message.COMMON.E_001;
            model.insertLog(req.session.userId, 8, message, req.body.query_name);
            res.status(512).send(Message.COMMON.E_002, req.body.query_name);
            return;
        }
        message = isUpdate ? Message.COMMON.I_002 : Message.COMMON.I_001;
        model.insertLog(req.session.userId, 8, Message.COMMON.E_002, req.body.query_name);
        res.status(200).send();
    });
};
