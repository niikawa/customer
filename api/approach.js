var Core = require('./core');
var Validator = require("../helper/validator");
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
 * 機能番号
 * @property FUNCTION_NAME
 * @type {Number}
 * @final
 */
var FUNCTION_NUMBER = 8;

/** 
 * アプローチ機能APIのクラス
 * 
 * @namespace api
 * @class Approach
 * @constructor
 * @extends api.core
 */
var Approach = function Approach()
{
    Core.call(this, TABLE_NAME, PK_NAME, SEQ_NAME);
    this.validator = new Validator();
    this.parametersRulesMap = 
    {
        save:
        {
            daily_limit_num: 
            [
                {
                    func: this.validator.isRequire
                },
                {
                    func: this.validator.isNumber
                },
                {
                    func: this.validator.isNotMaxOrver,
                    conditon: {max: 2147483647}
                }
            ],
            weekly_limit_num: 
            [
                {
                    func: this.validator.isRequire
                },
                {
                    func: this.validator.isNumber
                },
                {
                    func: this.validator.isNotMaxOrver,
                    conditon: {max: 2147483647}
                }
            ]
        }
    };
};

//coreModelを継承する
var util = require('util');
util.inherits(Approach, Core);

/**
 * リクエストパラメータのチェックを行う
 * 
 * @method validation
 * @param {string} key 実行対象メソッド名
 * @param {Object} parameters チェック対象パラメータオブジェクト
 * @return {bool} 
 */
Approach.prototype.validation = function(key ,parameters)
{
    var rules = this.parametersRulesMap[key];
    return this.validator.execute(rules, parameters);
};

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
        if (0 < err.length)
        {
            console.log(model.appendUserInfoString(Message.COMMON.E_102, req).replace("$1", FUNCTION_NAME+"[approach.getOrCreate]"));
            console.log(err);
            res.status(510).send(Message.APPROACH.E_001);
            return;
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
                console.log(model.appendUserInfoString(Message.COMMON.E_102, req).replace("$1", FUNCTION_NAME+"[approach.getOrCreate last block]"));
                console.log(err);
                res.status(510).send(Message.APPROACH.E_001);
                return;
            }
            var ret = {daily_limit_num: 0, weekly_limit_num: 0};
            ret.daily_limit_num = approachData.daily_limit_num;
            ret.weekly_limit_num = approachData.weekly_limit_num;
            
            res.json({data: ret});
        });
    });
};

/**
 * アプローチマスタのデータを保存する
 * 
 * @method save
 * @param {Object} req リクエストオブジェクト
 *  @param {object} req.body POSTされたパラメータを格納したオブジェクト
 *   @param {Number} req.body.daily_limit_num 1日の制限回数
 *   @param {Number} req.body.weekly_limit_num 1週間の制限回数
 * @param {Object} res レスポンスオブジェクト
 * @return 
 *     <ul>
 *     <li>正常終了の場合:ステータスコード200</li>
 *     <li>以上終了の場合:ステータスコード510</li>
 *     </ul>
 */
exports.save = function(req, res)
{
    if (!model.validation("save", req.body))
    {
        console.log(model.appendUserInfoString(Message.COMMON.E_101, req).replace("$1", FUNCTION_NAME+"[approach.save]"));
        res.status(510).send(Message.COMMON.E_101);
        return;
    }

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
        if (0 < err.length)
        {
            console.log(model.appendUserInfoString(Message.COMMON.E_102, req).replace("$1", FUNCTION_NAME+"[approach.save]"));
            console.log(err);
            model.insertLog(req.session.userId, FUNCTION_NUMBER, Message.COMMON.E_002, FUNCTION_NAME);
            res.status(510).send(Message.COMMON.E_002.replace("$1", FUNCTION_NAME));
            return;
        }
        
        model.insertLog(req.session.userId, FUNCTION_NUMBER, Message.COMMON.I_002, FUNCTION_NAME);
        res.status(200).send('update ok');
    });
};