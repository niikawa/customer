var crypto = require('crypto');
var async = require('async');
var Core = require('./core');

/** テーブル名 */
var tableName = 'M_SCENARIO';
var pk = 'scenario_id';

var scenario = function scenario()
{
    Core.call(this, tableName, pk);
};

//coreModelを継承する
var util = require('util');
util.inherits(scenario, Core);

var model = new scenario();

/**
 * 顧客の情報を取得する
 * 
 * @param {Object} req 画面からのリクエスト
 * @param {Object} res 画面へのレスポンス
 */
exports.getById = function(req, res)
{
    model.getById(req.params.id, function(err, data)
    {
        console.log(data);
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

/**
 * 全ユーザーを取得する
 */
exports.getAll = function(req, res)
{
    var col = "scenario_id, FORMAT(update_date, 'yyyy/MM/DD') AS update_date, scenario_name, " +
                "CASE approach WHEN 1 THEN 'アプローチ対象' WHEN 0 THEN 'アプローチ対象外' ELSE '未設定' END AS approach, " +
                "CASE status WHEN 1 THEN '有効' WHEN 0 THEN '無効' ELSE '未設定' END AS status";
    var where = "delete_flag = 0 AND scenario_type = @scenario_type";
    var order = "scenario_id";
    var qObj = model.getQueryObject(col, tableName, where, '', order);
    
    var scenarioType = ('trigger' == req.params.type) ? 1 : 2;
    qObj.request.input('scenario_type', model.db.SmallInt, scenarioType);

    model.select(qObj, qObj.request, function(err, data)
    {
        if (err.length > 0)
        {
            console.log(err);
            res.status(510).send('object not found');
        }
        res.json({data: data});
    });
};

exports.craete = function(req, res)
{
};

exports.update = function(req, res)
{
};

exports.remove = function(req, res)
{
    var user_id = req.params.id;
    model.removeById(user_id, function(err, data)
    {
        if (err.length > 0)
        {
            console.log(err);
            res.status(510).send('object not found');
        }
        res.status(200).send('remove ok');
    });
};

exports.delete = function(req, res)
{
    var user_id = req.params.id;
    model.deleteById(user_id, function(err, data)
    {
        if (err.length > 0)
        {
            console.log(err);
            res.status(510).send('object not found');
        }
        res.status(200).send('delete ok');
    });
};
