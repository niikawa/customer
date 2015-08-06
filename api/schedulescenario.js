/**
 * 本テーブルはアプリケーションから直接データ操作が行われる想定はない
 */

var Core = require('./core');

/** テーブル名 */
var tableName = 'M_SCHEDULE_SCENARIO';
/** PK */
var pk = 'schedule_scenario_id';
/** SEQ */
var seqName = 'seq_schedule_scenario';

var scheduleScenario = function scheduleScenario()
{
    Core.call(this, tableName, pk, seqName);
};

//coreModelを継承する
var util = require('util');
util.inherits(scheduleScenario, Core);

var model = new scheduleScenario();

/**
 * PKからデータを取得する
 * 
 * @param {Object} req 画面からのリクエスト
 * @param {Object} res 画面へのレスポンス
 */
exports.getById = function(req, res)
{
    model.getById(req.params.id, function(err, data)
    {
        if (err.length > 0)
        {
            console.log(err);
            res.status(510).send('data not found');
            res.json({data: []});
        }
        else
        {
            res.json({data: data});
        }
    });
};

exports.getByScenarioId = function(scenario_id, callback)
{
    var col = "schedule_scenario_id, scenario_id, repeat_flag, expiration_start_date, expiration_end_date, scenario_action_document_id";
    var where = "delete_flag = 0 AND scenario_id = @scenario_id";
    var qObj = model.getQueryObject(col, tableName, where, '', '');
    qObj.request.input('scenario_id', model.db.SmallInt, scenario_id);

    model.select(qObj, qObj.request, function(err, data)
    {
        callback(err, data);
    });
};

exports.saveForParent = function(insertData, request, callback)
{
    model.insert(tableName, insertData, request, callback);
};

exports.updateByScenarioId = function(updateData, request, callback)
{
    request.input('update_date', model.db.NVarChar, updateData.update_date);
    request.input('repeat_flag', model.db.Int, updateData.repeat_flag);
    request.input('expiration_start_date', model.db.NVarChar, updateData.expiration_start_date);
    request.input('expiration_end_date', model.db.NVarChar, updateData.expiration_end_date);
    request.input('scenario_id', model.db.Int, updateData.scenario_id);

    model.updateByForeignKey(updateData, 'scenario_id', request, callback);
};

exports.remove = function(id, callback)
{
    model.removeById(id, callback);
};
