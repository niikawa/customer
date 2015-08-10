var Core = require('./core');
var Message = require('../config/message.json');

/** テーブル名 */
var tableName = 'T_SCENARIO_TAG';
var pk = 'scenario_tag_id';
/** SEQ */
var seqName = 'seq_scenario_tag';

var scenarioTag = function scenarioTag()
{
    Core.call(this, tableName, pk, seqName);
};

//coreModelを継承する
var util = require('util');
util.inherits(scenarioTag, Core);

var model = new scenarioTag();

exports.getByScenarioId = function(scenarioId, callback)
{
    var col = "T2.tag_id, T2.tag_name";
    var where = "T2.delete_flag = 0 AND T1.delete_flag = 0 AND T1.scenario_id = @scenario_id";
    var table = tableName + " T1 INNER JOIN T_TAG T2 ON T1.tag_id = T2.tag_id";
    var orderBy = "T1." + pk;
    
    var qObj = model.getQueryObject(col, table, where, '', orderBy);
    qObj.request.input('scenario_id', model.db.SmallInt, scenarioId);

    model.select(qObj, qObj.request, function(err, data)
    {
        callback(err, data);
    });
};

exports.save = function(transaction, userId, scenarioId, tagList, mainCallback)
{
    console.log("scenario tag save start");
    console.log(tagList);
    var commonColumns = model.getInsCommonColumns(userId);

    model.async.forEach(tagList, function(item, callback)
    {
        console.log(item);

        if (item.hasOwnProperty('tag_id'))
        {
            var insertData = model.merge(commonColumns, {tag_id: item.tag_id, scenario_id: scenarioId});
            console.log("go insert scenario tag ");
            
            var request = model.getRequest(transaction);
            request.input('delete_flag', model.db.SmallInt, insertData.delete_flag);
            request.input('create_by', model.db.Int, insertData.create_by);
            request.input('create_date', model.db.NVarChar, insertData.create_date);
            request.input('update_by', model.db.Int, insertData.update_by);
            request.input('update_date', model.db.NVarChar, insertData.update_date);
            request.input('tag_id', model.db.Int, insertData.tag_id);
            request.input('scenario_id', model.db.Int, insertData.scenario_id);
            
            console.log(insertData);
            model.insert(tableName, insertData, request, function(err, id)
            {
                var errInfo = (0 < err.length) ? err: null;
                callback(errInfo);
            });
        }
        else
        {
            callback(null);
        }
    },
    function(err)
    {
        console.log("last function for scenariotag.js");
        console.log(err);
        var errInfo = (void 0 === err) ? null : err;
        mainCallback(errInfo, tagList);
    });
};

exports.removeByScenarioId = function(transaction, scenarioId, callback)
{
    var request = "";
    if (null != transaction)
    {
        request = model.getRequest(transaction);
    }
    else
    {
        request = model.getRequest();
    }
    
    request.input("scenario_id", model.db.Int, scenarioId);
    var sql = 'DELETE FROM ' + tableName + ' WHERE scenario_id = @scenario_id';
    model.execute(sql, request, function(err)
    {
        var errInfo = (0 < err.length) ? err : null;
        callback(errInfo);
    });
};

exports.deleteInsert = function(params, callback)
{
    var save = this.save;
    this.removeByScenarioId(params.transaction, params.scenarioId, function(err)
    {
        if (null === err)
        {
            if (void 0 !== params.tagList)
            {
                console.log(this.save);
                
                save(params.transaction, params.userId, params.scenarioId, params.tagList, function(err, tagList)
                {
                    callback(err);
                });
            }
            else
            {
                callback(null);
            }
        }
        else
        {
            callback(err);
        }
    });
};