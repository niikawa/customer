/**
 * 本テーブルはアプリケーションから直接データ操作が行われる想定はない
 */

var Core = require('./core');
var Message = require('../config/message.json');
var logger = require("../helper/logger");
var Validator = require("../helper/validator");

/** 
 * テーブル名
 * @property TABLE_NAME
 * @type {string}
 * @final
 */
var TABLE_NAME = 'M_SCHEDULE_SCENARIO';
/** 
 * 主キー名 
 * @property PK_NAME
 * @type {string}
 * @final
 */
var PK_NAME = 'schedule_scenario_id';
/** 
 * SEQ名
 * @property SEQ_NAME
 * @type {string}
 * @final
 */
var SEQ_NAME = 'seq_schedule_scenario';

var scheduleScenario = function scheduleScenario()
{
    Core.call(this, TABLE_NAME, PK_NAME, SEQ_NAME);
};
/** 
 * 機能名
 * @property FUNCTION_NAME
 * @type {string}
 * @final
 */
var FUNCTION_NAME = 'スケジュールシナリオ';
/** 
 * 機能番号
 * @property FUNCTION_NAME
 * @type {Number}
 * @final
 */
var FUNCTION_NUMBER = 6;

/** 
 * トリガーシナリオ機能APIのクラス
 * 
 * @namespace api
 * @class TriggerScenario
 * @constructor
 * @extends api.core
 */
var ScheduleScenario = function ScheduleScenario()
{
    Core.call(this, TABLE_NAME, PK_NAME, SEQ_NAME);
    this.validator = new Validator();
    this.parametersRulesMap = 
    {
        getById :
        {
            id: 
            [
                {func: this.validator.isRequire},
                {func: this.validator.isNumber},
                {func: this.validator.isNotMaxOrver, condition: {max:9223372036854775807}}
            ]
        },
    };
    
};

//coreModelを継承する
var util = require('util');
util.inherits(scheduleScenario, Core);

/**
 * リクエストパラメータのチェックを行う
 * 
 * @method validation
 * @param {string} key 実行対象メソッド名
 * @param {Object} parameters チェック対象パラメータオブジェクト
 * @return {bool} 
 */
ScheduleScenario.prototype.validation = function(key ,parameters)
{
    var rules = this.parametersRulesMap[key];
    return this.validator.execute(rules, parameters);
};


var model = new ScheduleScenario();

/**
 * PKからデータを取得する
 * 
 * @param {Object} req 画面からのリクエスト
 * @param {Object} res 画面へのレスポンス
 */
exports.getById = function(req, res)
{
    if (!model.validation("getById", req.params))
    {
        logger.error(Message.COMMON.E_103.replace("$1", FUNCTION_NAME+"[scheduleScenario.getById]"), req);
        res.status(511).send(Message.COMMON.E_101);
        return;
    }
    
    model.getById(req.params.id, function(err, data)
    {
        if (null !== err)
        {
            logger.error(Message.COMMON.E_102.replace("$1", FUNCTION_NAME+"[scheduleScenario.getById]"), req, err);
            model.insertLog(req.session.userId, FUNCTION_NUMBER, Message.COMMON.E_004, FUNCTION_NAME);
            res.status(511).send(Message.COMMON.E_004.replace("$1", FUNCTION_NAME));
            return;
        }
        res.json({data: data});
    });
};

/**
 * シナリオIDからデータを取得する
 * 
 * @method getByScenarioId
 * @param {Nunber} scenario_id シナリオID
 * @param {Function} callback コールバック
 * @return 
 */
exports.getByScenarioId = function(scenario_id, callback)
{
    var col = "schedule_scenario_id, scenario_id, repeat_flag, expiration_start_date, expiration_end_date, scenario_action_document_id";
    var where = "delete_flag = 0 AND scenario_id = @scenario_id";
    var qObj = model.getQueryObject(col, TABLE_NAME, where, '', '');
    qObj.request.input('scenario_id', model.db.SmallInt, scenario_id);

    model.select(qObj, qObj.request, function(err, data)
    {
        callback(err, data);
    });
};

/**
 * トリガーシナリオデータを保存する
 * 
 * @method saveForParent
 * @param {Object} insertData 登録データ
 * @param {Object} request データベースリクエスト
 * @param {Function} callback コールバック
 * @return 
 */
exports.saveForParent = function(insertData, request, callback)
{
    model.insert(TABLE_NAME, insertData, request, callback);
};

/**
 * シナリオIDでトリガーシナリオを更新する
 * 
 * @method updateByScenarioId
 * @param {Object} updateData 更新データ
 * @param {Object} request データベースリクエスト
 * @param {Function} callback コールバック
 * @return 
 */
exports.updateByScenarioId = function(updateData, request, callback)
{
    //expiration_end_dateはから文字は許されないのでnullに変換
    if (updateData.hasOwnProperty("expiration_end_date"))
    {
        updateData.expiration_end_date = 
            (null === updateData.expiration_end_date || 0 === updateData.expiration_end_date.length) ? null : updateData.expiration_end_date;
    }
    else
    {
        updateData.expiration_end_date = null;
    }
    request.input('update_date', model.db.NVarChar, updateData.update_date);
    request.input('repeat_flag', model.db.Int, updateData.repeat_flag);
    request.input('expiration_start_date', model.db.NVarChar, updateData.expiration_start_date);
    request.input('expiration_end_date', model.db.NVarChar, updateData.expiration_end_date);
    request.input('scenario_id', model.db.Int, updateData.scenario_id);

    model.updateByForeignKey(updateData, 'scenario_id', request, callback);
};

/**
 * トリガーシナリオを削除する
 * 
 * @method remove
 * @param {Nunber} id トリガーシナリオID
 * @param {Object} transaction トランザクション
 * @param {Function} callback コールバック
 * @return 
 */
exports.remove = function(id, transaction, callback)
{
    model.removeByIdAndTran(id, transaction, function(err)
    {
        callback(err);
    });
};
