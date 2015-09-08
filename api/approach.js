var Core = require('./core');
var Message = require('../config/message.json');

/** 
 * テーブル名
 * @property TABLE_NAME
 * @type {string}
 * @final
 */
var TABLE_NAME = 'M_APPROACH_SETTING';
/** 
 * 主キー名 
 * @property PK_NAME
 * @type {string}
 * @final
 */
var PK_NAME = 'approach_setting_id';
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
var FUNCTION_NAME = 'アプローチ管理';
/** 
 * 機能名番号
 * @property FUNCTION_NAME
 * @type {int}
 * @final
 */
var FUNCTION_NUMBER = 8;

/** 
 * アプローチ機能APIのクラス
 * 
 * @constructor
 * @extends api.core
 */
var Approach = function Approach()
{
    Core.call(this, TABLE_NAME, PK_NAME, SEQ_NAME);
};

//coreModelを継承する
var util = require('util');
util.inherits(Approach, Core);

var model = new Approach();

/**
 * アプローチマスタのデータが存在している場合は取得し、存在していない場合は新規作成する
 * 
 * @method getOrCreate
 * @param {object} req リクエストオブジェクト
 * @param {object} res レスポンスオブジェクト
 * @return {json} data 操作履歴の取得結果<br>
 * 以下のプロパティを持つobjectをjsonとして返却する
 *     <ul>
 *     <li>daily_limit_num: 1日の制限回数</li>
 *     <li>weekly_limit_num: 1週間の制限回数</li>
 *     </ul>
 */
exports.getOrCreate = function(req, res)
{
    model.insertLog(req.session.userId, 8, Message.COMMON.I_004, FUNCTION_NAME);
    model.getAll(function(err, data)
    {
        if (err.length > 0)
        {
            console.log('approach data get error');
            console.log(err);
            res.status(510).send('data get faild').end();
            
        }
        var approachData = data[0];
        
        model.async.waterfall(
        [
            function(callback)
            {
                if (0 === data.length)
                {
                    approachData = {daily_limit_num: 0, weekly_limit_num: 0};
                    //データが存在しない場合は作る
                    var commonColumns = model.getInsCommonColumns();
                    var request = model.getRequest();
                    request.input('delete_flag', model.db.SmallInt, commonColumns.delete_flag);
                    request.input('create_by', model.db.Int, req.session.userId);
                    request.input('create_date', model.db.NVarChar, commonColumns.create_date);
                    request.input('update_by', model.db.Int, req.session.userId);
                    request.input('update_date', model.db.NVarChar, commonColumns.update_date);
                    model.insert(TABLE_NAME, commonColumns, request, callback);
                }
                else
                {
                    callback(null);
                }
            },
        ], function(err)
        {
            if (null !== err)
            {
                console.log(err);
                res.status(510).send('object not found');
            }
            else
            {
                var ret = {daily_limit_num: 0, weekly_limit_num: 0};
                ret.daily_limit_num = approachData.daily_limit_num;
                ret.weekly_limit_num = approachData.weekly_limit_num;
                
                res.json({data: ret});
            }
        });
    });
};

/**
 * アプローチマスタのデータを保存する
 * 
 * @method save
 * @param {object} req リクエストオブジェクト
 * @param {object} res レスポンスオブジェクト
 * @return {json} data 操作履歴の取得結果<br>
 * 以下のプロパティを持つobjectをjsonとして返却する
 *     <ul>
 *     <li>daily_limit_num: </li>
 *     <li>weekly_limit_num: </li>
 *     </ul>
 */
exports.save = function(req, res)
{
    if (void 0 === req.body) res.status(510).send('params is not found');
    
    //approach_settingは1レコードしか存在しない
    var data = {
        approach_setting_id: 1,
        daily_limit_num: req.body.daily_limit_num, 
        weekly_limit_num: req.body.weekly_limit_num
    };
    
    var commonColumns = model.getUpdCommonColumns();
    var updateData = model.merge(data, commonColumns);

    var request = model.getRequest();
    request.input('update_by', model.db.Int, req.session.userId);
    request.input('update_date', model.db.NVarChar, updateData.update_date);
    
    request.input('approach_setting_id', model.db.Int, updateData.approach_setting_id);
    request.input('daily_limit_num', model.db.Int, updateData.daily_limit_num);
    request.input('weekly_limit_num', model.db.Int, updateData.weekly_limit_num);

    model.updateById(updateData, request, function(err, data)
    {
        if (err.length > 0)
        {
            model.insertLog(req.session.userId, FUNCTION_NUMBER, Message.COMMON.E_002, FUNCTION_NAME);
            console.log('approach update faild');
            console.log(err);
        }
        
        model.insertLog(req.session.userId, FUNCTION_NUMBER, Message.COMMON.I_002, FUNCTION_NAME);
        res.status(200).send('update ok');
    });
};

exports.remove = function(req, res)
{
    if (void 0 === req.params.id || void 0 === req.params.segment_document_id) res.status(510).send('parameters not found');
    
    var segmentdoc = require("./segmentdoc");
    segmentdoc.removeItemForWeb(req.params.segment_document_id, function(err, doc)
    {
        if (err) res.status(510).send('document is not found');
        
        model.removeById(req.params.id, function(err, data)
        {
            if (err.length > 0)
            {
                console.log(err);
                res.status(510).send('object not found');
            }
           
            model.insertLog(req.session.userId, FUNCTION_NUMBER, Message.COMMON.I_003, FUNCTION_NAME);
            res.status(200).send('delete ok');
        });
    });
};