var Core = require('./core');
var Validator = require("../helper/validator");
var Message = require('../config/message.json');
var logger = require("../helper/logger");

/** 
 * テーブル名
 * @property TABLE_NAME
 * @type {string}
 * @final
 */
var TABLE_NAME = 'T_SCENARIO_TAG';
/** 
 * 主キー名 
 * @property PK_NAME
 * @type {string}
 * @final
 */
var PK_NAME = 'scenario_tag_id';
/** 
 * SEQ名
 * @property SEQ_NAME
 * @type {string}
 * @final
 */
var SEQ_NAME = 'seq_scenario_tag';

/** 
 * タグ機能APIのクラス
 * 
 * @namespace api
 * @class ScenarioTag
 * @constructor
 * @extends api.core
 */
 var ScenarioTag = function ScenarioTag()
{
    Core.call(this, TABLE_NAME, PK_NAME, SEQ_NAME);
};

//coreModelを継承する
var util = require('util');
util.inherits(ScenarioTag, Core);

var model = new ScenarioTag();

/**
 * シナリオIDでタグを取得する
 * 
 * @method getByScenarioId
 * @param {Number} scenarioId シナリオID
 * @param {Function} callback コールバック
 * @return 
 */
exports.getByScenarioId = function(scenarioId, callback)
{
    var col = "T2.tag_id, T2.tag_name";
    var where = "T2.delete_flag = 0 AND T1.delete_flag = 0 AND T1.scenario_id = @scenario_id";
    var table = TABLE_NAME + " T1 INNER JOIN T_TAG T2 ON T1.tag_id = T2.tag_id";
    var orderBy = "T1." + PK_NAME;
    
    var qObj = model.getQueryObject(col, table, where, '', orderBy);
    qObj.request.input('scenario_id', model.db.SmallInt, scenarioId);

    model.select(qObj, qObj.request, function(err, data)
    {
        callback(err, data);
    });
};

/**
 * シナリオにタグを設定する
 * 
 * @method getByScenarioId
 * @param {Object} transaction トランザクション
 * @param {Number} userId ユーザーID
 * @param {Number} scenarioId シナリオID
 * @param {Array} tagList タグリスト
 * @param {Function} mainCallback コールバック
 * @return 
 */
exports.save = function(transaction, userId, scenarioId, tagList, mainCallback)
{
    var commonColumns = model.getInsCommonColumns(userId);
    model.async.forEach(tagList, function(item, callback)
    {
        if (item.hasOwnProperty('tag_id'))
        {
            var insertData = model.merge(commonColumns, {tag_id: item.tag_id, scenario_id: scenarioId});

            var request = model.getRequest(transaction);
            request.input('delete_flag', model.db.SmallInt, insertData.delete_flag);
            request.input('create_by', model.db.Int, insertData.create_by);
            request.input('create_date', model.db.NVarChar, insertData.create_date);
            request.input('update_by', model.db.Int, insertData.update_by);
            request.input('update_date', model.db.NVarChar, insertData.update_date);
            request.input('tag_id', model.db.Int, insertData.tag_id);
            request.input('scenario_id', model.db.Int, insertData.scenario_id);
            
            model.insert(TABLE_NAME, insertData, request, function(err, id)
            {
                callback(err);
            });
        }
        else
        {
            callback(null);
        }
    },
    function(err)
    {
        mainCallback(err, tagList);
    });
};
/**
 * シナリオに設定したタグを削除する
 * 
 * @method removeByScenarioId
 * @param {Object} transaction トランザクション
 * @param {Number} scenarioId シナリオID
 * @param {Function} callback コールバック
 * @return 
 */
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
    var sql = 'DELETE FROM ' + TABLE_NAME + ' WHERE scenario_id = @scenario_id';
    model.execute(sql, request, function(err)
    {
        callback(err);
    });
};

/**
 * タグを登録する
 * 
 * @method deleteInsert
 * @param {Object} params トランザクション
 * @param {Function} callback コールバック
 * @return 
 */
exports.deleteInsert = function(params, callback)
{
    var save = this.save;
    this.removeByScenarioId(params.transaction, params.scenarioId, function(err)
    {
        if (null === err)
        {
            if (void 0 !== params.tagList)
            {
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