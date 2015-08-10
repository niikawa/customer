/**
 * 本テーブルはアプリケーションから直接データ操作が行われる想定はない
 */

var Core = require('./core');

/** テーブル名 */
var tableName = 'M_TRIGGER_SCENARIO';
/** PK */
var pk = 'trigger_scenario_id';
/** SEQ */
var seqName = 'seq_trigger_scenario';

var triggerScenario = function triggerScenario()
{
    Core.call(this, tableName, pk, seqName);
};

//coreModelを継承する
var util = require('util');
util.inherits(triggerScenario, Core);

var model = new triggerScenario();

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
    var col = "trigger_scenario_id, scenario_id, after_event_occurs_num, inoperative_num, scenario_action_document_id";
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
    delete updateData.trigger_scenario_id;
    console.log(updateData);
    request.input('update_date', model.db.NVarChar, updateData.update_date);
    request.input('scenario_id', model.db.Int, updateData.scenario_id);
    request.input('after_event_occurs_num', model.db.Int, updateData.after_event_occurs_num);
    request.input('inoperative_num', model.db.Int, updateData.inoperative_num);
    request.input('scenario_action_document_id', model.db.NVarChar, updateData.scenario_action_document_id);
    
    model.updateByForeignKey(updateData, 'scenario_id', request, callback);
};

exports.remove = function(id, transaction, callback)
{
    model.removeByIdAndTran(id, transaction, function(err, data)
    {
        var errInfo = (0 < err.length) ? err : null;
        callback(errInfo);
    });
};
