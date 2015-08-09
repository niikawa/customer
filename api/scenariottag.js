var Core = require('./core');
var Message = require('../config/message.json');

/** テーブル名 */
var tableName = 'T_SCENARIO_TAG';
var pk = 'scenario_tag';
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

exports.save = function(transaction, userId, scenarioId, tagList, mainCallback)
{
    console.log("scenario tag save start");
    console.log(tagList);
    var request = model.getRequest(transaction);
    var commonColumns = model.getInsCommonColumns(userId);

    model.async.forEach(tagList, function(item, callback)
    {
        console.log(item);

        if (item.hasOwnProperty('tag_id'))
        {
            var insertData = model.merge(commonColumns, {tag_id: item.tag_id, scenario_id: scenarioId});
            console.log("go insert scenario tag ");
            console.log(insertData);
            
            request.input('delete_flag', model.db.SmallInt, insertData.delete_flag);
            request.input('create_by', model.db.Int, insertData.create_by);
            request.input('create_date', model.db.NVarChar, insertData.create_date);
            request.input('update_by', model.db.Int, insertData.update_by);
            request.input('update_date', model.db.NVarChar, insertData.update_date);
            request.input('tag_id', model.db.NVarInt, insertData.tag_id);
            request.input('scenario_id', model.db.NVarInt, insertData.scenario_id);
            
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
        mainCallback(err, tagList);
    });
};
