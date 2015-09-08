var Core = require('./core');
var Message = require('../config/message.json');

/** 
 * テーブル名
 * @property TABLE_NAME
 * @type {string}
 * @final
 */
var TABLE_NAME = 'M_LOG';
/** 
 * 主キー名 
 * @property PK_NAME
 * @type {string}
 * @final
 */
var PK_NAME = 'log_id';
/** 
 * 機能名番号
 * @property FUNCTION_NAME
 * @type {int}
 * @final
 */
var FUNCTION_NUMBER = 9;
/** 
 * 機能名
 * @property FUNCTION_NAME
 * @type {string}
 * @final
 */
var FUNCTION_NAME = '操作履歴';
/** 
 * 操作履歴APIのクラス
 * 
 * @namespace api
 * @class log
 * @extends api.core
 * @constructor
 */
var Log = function Log()
{
    Core.call(this, TABLE_NAME, PK_NAME);
};

//coreModelを継承する
var util = require('util');
util.inherits(Log, Core);

var model = new Log();

/**
 * 指定された日の操作ログをすべて取得する
 * 
 * @method getDayAll
 * @param {object} req リクエストオブジェクト
 *  @param {object} req.body POSTされたパラメータを格納したオブジェクト
 *   @param {string} req.body.day 指定日 YYYY-MM-DD形式
 * @param {object} res レスポンスオブジェクト
 * @return {json} data 操作履歴の取得結果<br>
 * 以下のプロパティを持つobjectの配列をjsonとして返却する
 *     <ul>
 *     <li>log_id: PK</li>
 *     <li>date: 操作日(yyyy-MM-dd hh:mm:ss)</li>
 *     <li>user_id: ユーザーID</li>
 *     <li>detail: 内容</li>
 *     <li>name: ユーザー名</li>
 *     </ul>
 */
exports.getDayAll = function(req, res)
{
    var col = "T1.log_id, FORMAT(T1.create_date, 'yyyy-MM-dd hh:mm:ss') as date, T1.user_id, T1.detail, T2.name";
    var table = "T_LOG T1 INNER JOIN M_USER T2 ON T1.user_id = T2.user_id";
    var where = "T1.create_date BETWEEN @start AND @end AND T1.delete_flag = 0";
    var order = "T1.log_id DESC";
    var qObj = model.getQueryObject(col, table, where, '', order);
    var start = req.body.day + ' 00:00:00';
    var end = req.body.day + ' 23:59:59';
    qObj.request.input('start', model.db.NVarChar, start);
    qObj.request.input('end', model.db.NVarChar, end);
    
    model.select(qObj, qObj.request, function(err, data)
    {
        if (err.length == 0)
        {
            console.log(model.appendUserInfoString(Message.COMMON.E_102, req));
            console.log(err);
            model.insertLog(req.session.userId, FUNCTION_NUMBER, Message.COMMON.E_004, FUNCTION_NAME);
            res.status(510).send(Message.ACCESS.E_001);
            return ;
        }
        console.log("とまらない！");
        res.json({data: data});
    });
};

/**
 * 指定された日の操作ログをすべて取得する
 * 
 * @method getDayAllByUserId
 * @param {object} req リクエストオブジェクト
 *  @param {object} req.body POSTされたパラメータを格納したオブジェクト
 *   @param {int} req.body.id 指定日 YYYY-MM-DD形式
 *   @param {string} req.body.day 指定日 YYYY-MM-DD形式
 * @param {object} res レスポンスオブジェクト
 * @return {json} data 操作履歴の取得結果<br>
 * 以下のプロパティを持つobjectの配列をjsonとして返却する
 *     <ul>
 *     <li>log_id: PK</li>
 *     <li>date: 操作日(yyyy-MM-dd hh:mm:ss)</li>
 *     <li>user_id: ユーザーID</li>
 *     <li>detail: 内容</li>
 *     <li>name: ユーザー名</li>
 *     </ul>
 */
exports.getDayAllByUserId = function(req, res)
{
    var col = "T1.log_id, FORMAT(T1.create_date, 'yyyy-MM-dd hh:mm:ss') as date, T1.user_id, T1.detail, T2.name";
    var table = "T_LOG T1 INNER JOIN M_USER T2 ON T1.user_id = T2.user_id";
    var where = "T1.create_date BETWEEN @start AND @end AND T1.user_id = @userId AND T1.delete_flag = 0";
    var order = "T1.log_id ASC";
    var qObj = model.getQueryObject(col, table, where, '', order);
    var start = req.body.day + ' 00:00:00';
    var end = req.body.day + ' 23:59:59';
    qObj.request.input('start', model.db.NVarChar, start);
    qObj.request.input('end', model.db.NVarChar, end);
    qObj.request.input('userId', model.db.Int, req.body.id);
    
    model.select(qObj, qObj.request, function(err, data)
    {
        if (err.length > 0)
        {
            console.log(model.appendUserInfoString("getDayAllByUserId:"+Message.COMMON.E_102, req));
            console.log(err);
            model.insertLog(req.session.userId, FUNCTION_NUMBER, Message.COMMON.E_004, FUNCTION_NAME);
            res.status(510).send(Message.ACCESS.E_001).end();
        }
        res.json({data: data});
    });
};