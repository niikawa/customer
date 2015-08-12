var moment = require('moment');
var Core = require('./core');
var Message = require('../config/message.json');
var scenariodoc = require("./scenariodoc");

/** テーブル名 */
var tableName = 'M_SCENARIO';
/** PK */
var pk = 'scenario_id';
/** SEQ */
var seqName = 'seq_scenario';

/** 機能名 */
//var functionName = 'シナリオ管理';

var scenario = function scenario()
{
    Core.call(this, tableName, pk, seqName);
};

//coreModelを継承する
var util = require('util');
util.inherits(scenario, Core);

var model = new scenario();

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
            model.insertLog(req.session.userId, 6, Message.COMMON.I_004, data[0].scenario_name);
            res.json({data: data});
        }
    });
};

/**
 * delete_flagのたっていないシナリオをすべて取得する
 * 並び順はPKの昇順
 * 
 * @param {Object} req 画面からのリクエスト
 * @param {Object} res 画面へのレスポンス
 */
exports.getAll = function(req, res)
{
    var col = "T1.scenario_id, FORMAT(T1.update_date, 'yyyy/MM/dd') AS update_date, T1.scenario_name, " +
                "CASE T1.approach WHEN 1 THEN N'対象' WHEN 0 THEN N'対象外' ELSE N'未設定' END AS approach, " +
                "CASE T1.status WHEN 1 THEN N'有効' WHEN 0 THEN N'無効' ELSE N'未設定' END AS status, T3.tag_name";
    var table = tableName + " T1 LEFT JOIN T_SCENARIO_TAG T2 ON T1.scenario_id = T2.scenario_id AND T2.delete_flag = 0 LEFT JOIN T_TAG T3 ON T2.tag_id = T3.tag_id AND T3.delete_flag = 0";
    var where = "T1.delete_flag = 0 AND T1.scenario_type = @scenario_type";
    var order = "T1.scenario_id";
    var qObj = model.getQueryObject(col, table, where, '', order);
    
    var functionName = '';
    var scenarioType = ''; 
    if ('trigger' == req.params.type) 
    {
        functionName = 'トリガーシナリオ管理';
        scenarioType = 2;
    }
    else
    {
        functionName = 'スケジュールシナリオ管理'; 
        scenarioType = 1;
    }
    qObj.request.input('scenario_type', model.db.SmallInt, scenarioType);

    model.select(qObj, qObj.request, function(err, data)
    {
        if (err.length > 0)
        {
            model.insertLog(req.session.userId, 6, Message.COMMON.E_004, functionName);
            console.log(err);
            return res.status(510).send('シナリオデータの取得に失敗しました。');
        }
        
        console.log(data);
        var num = data.length;
        var last = num - 1;
        var tagList = [];
        var newData = [];
        if (0 < num)
        {
            var defore = data[0].scenario_id;
            for (var index = 0; index < num; index++)
            {
                if (defore === data[index].scenario_id)
                {
                    tagList.push(data[index].tag_name);
                }
                else
                {
                    data[index-1].searchTag = tagList.join(" ");
                    newData.push(data[index-1]);
                    tagList = [];
                    tagList.push(data[index].tag_name);
                }
                if (last === index)
                {
                    data[index].searchTag = tagList.join(" ");
                    newData.push(data[index]);
                }
                
                defore = data[index].scenario_id;
            }
            
            //データが1件しかない、またはすべて同じデータだった場合
            if (0 === newData.length)
            {
                data[0].searchTag = tagList.join(" ");
                newData.push(data[0]);
                console.log(newData);
            }
        }
            
        model.insertLog(req.session.userId, 6, Message.COMMON.I_004, functionName);
        res.json({data: newData});
    });
};

/**
 * アプローチ対象のシナリオを取得する
 * 並び順はpriorityとscenario_idの昇順
 * 
 * @param {Object} req 画面からのリクエスト
 * @param {Object} res 画面へのレスポンス
 */
exports.getValid = function(req, res)
{
    var col = "scenario_id, scenario_name, status, priority, valid_flag," +
                "CASE scenario_type WHEN 1 THEN 'schedule' WHEN 2 THEN 'trigger' ELSE N'未設定' END AS scenario_type_key, " +
                "CASE scenario_type WHEN 1 THEN N'スケジュール' WHEN 2 THEN N'トリガー' ELSE N'未設定' END AS scenario_type";

    var where = "delete_flag = 0 AND approach = 1";
    var order = "priority, scenario_id";
    var qObj = model.getQueryObject(col, tableName, where, '', order);
    
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

/**
 * アプローチ対象のシナリオを取得する
 * 並び順はpriorityとscenario_idの昇順
 * 
 * @param {Object} req 画面からのリクエスト
 * @param {Object} res 画面へのレスポンス
 */
exports.getScenarioCount = function(req, res)
{
    model.async.parallel(
    {
        //セグメント情報
        env: function(callback)
        {
            var env = require("./environment");
            env.get(callback);
        },
        //count
        count: function(callback)
        {
            var col = "scenario_type, count(1) as regist_num, "+
                "CASE scenario_type WHEN 1 THEN 'schedule' WHEN 2 THEN 'trigger' ELSE N'未設定' END AS scenario_type_key, " +
                "CASE scenario_type WHEN 1 THEN N'スケジュール型シナリオ' WHEN 2 THEN N'トリガー型シナリオ' ELSE N'未設定' END AS scenario_type_name";
            var where = "delete_flag = 0";
            var grop = "scenario_type";
            var qObj = model.getQueryObject(col, tableName, where, grop, '');
            
            model.select(qObj, qObj.request, callback);
        },
    },
    function complete(err, items)
    {
        var list = [];
        var envInfo = items.env[0];
        if (0 === items.count.length)
        {
            list.push({scenario_type_key: 'schedule', scenario_type_name:'スケジュール型シナリオ', regist_num: 0, regist_max: envInfo.schedule_scenario_max});
            list.push({scenario_type_key: 'trigger', scenario_type_name:'トリガー型シナリオ', regist_num: 0, regist_max: envInfo.trigger_scenario_max});
        }
        else if (1 === items.count.length)
        {
            var isSchedule = (1 === items.count[0].scenario_type) ? true : false;
            if (isSchedule)
            {
                items.count[0].regist_max = envInfo.schedule_scenario_max;
                list.push(items.count[0]);
                list.push({scenario_type_key: 'trigger', scenario_type_name:'トリガー型シナリオ', regist_num: 0, regist_max: envInfo.trigger_scenario_max});
            }
            else
            {
                list.push({scenario_type_key: 'schedule', scenario_type_name:'スケジュール型シナリオ', regist_num: 0, regist_max: envInfo.schedule_scenario_max});
                items.count[0].regist_max = envInfo.trigger_scenario_max;
                list.push(items.count[0]);
            }
        }
        else
        {
            var num = items.count.length;
            for(var index = 0; index < num; index++)
            {
                if (1 === items.count[index].scenario_type)
                {
                    items.count[index].regist_max = envInfo.schedule_scenario_max;
                }
                else if (2 === items.count[index].scenario_type)
                {
                    items.count[index].regist_max = envInfo.trigger_scenario_max;
                }
            }
            list = items.count;
        }
        
        res.json({data: list});
    });
};

/**
 * 実行予定のシナリオを取得する
 * 並び順はpriorityとscenario_idの昇順
 * 
 * @param {Object} req 画面からのリクエスト
 * @param {Object} res 画面へのレスポンス
 */
exports.getExecutePlanScenario = function(req, res)
{
    var col = "T1.scenario_id, T1.scenario_name, T1.valid_flag, "+
        "CASE T1.scenario_type WHEN 1 THEN N'スケジュール' WHEN 2 THEN N'トリガー' ELSE N'未設定' END AS scenario_type, "+
        "CASE T1.scenario_type WHEN 1 THEN 'schedule' WHEN 2 THEN 'trigger' ELSE N'未設定' END AS scenario_type_key";
    
    var table = tableName + " T1 LEFT JOIN M_SCHEDULE_SCENARIO T2 ON T1.scenario_id = T2.scenario_id ";
    var where = "T1.delete_flag = 0 AND T1.approach = 1 AND T1.status = 1";
    where += " AND ( T2.expiration_start_date is null OR (T2.expiration_start_date >= @now AND expiration_end_date >= @now) OR T2.expiration_start_date = @now AND T2.expiration_end_date is null)";
    
    var order = "T1.priority, T1.scenario_id";
    var qObj =  model.getQueryObject(col, table, where, '', order);
    
    var now = moment().format("YYYY/MM/DD") + " 00:00:00";

    qObj.request.input('now', model.db.NVarChar, now);

    model.select(qObj, qObj.request, function(err, data)
    {
        if (err.length > 0)
        {
            console.log('get execute plan scenario faild');
            console.log(err);
            res.status(510).send('シナリオ情報の取得に失敗しました');
        }
        
        res.json({data: data});
    });
};

/**
 * 実行予定のシナリオをカレンダー表示用に整形した結果を取得する
 * 
 * @param {Object} req 画面からのリクエスト
 * @param {Object} res 画面へのレスポンス
 */
exports.getExecutePlanScenarioToCalendar = function(req, res)
{
    var col = "T1.scenario_id, T1.scenario_name, T2.scenario_action_document_id, T2.expiration_start_date, T2.expiration_end_date, "+
        "T1.scenario_type AS scenario_type_value, " +
        "CASE T1.scenario_type WHEN 1 THEN N'スケジュール' WHEN 2 THEN N'トリガー' ELSE N'未設定' END AS scenario_type, "+
        "CASE T1.scenario_type WHEN 1 THEN 'schedule' WHEN 2 THEN 'trigger' ELSE N'未設定' END AS scenario_type_key";
    
    var table = tableName + " T1 LEFT JOIN M_SCHEDULE_SCENARIO T2 ON T1.scenario_id = T2.scenario_id ";
    var where = "T1.delete_flag = 0 AND T1.approach = 1 AND T1.status = 1";
    where += " AND ( T2.expiration_start_date is null OR (T2.expiration_start_date BETWEEN @start AND @end) OR (T2.expiration_start_date is not null AND T2.expiration_end_date >= @end))";
    
    var order = "T1.priority, T1.scenario_id";
    var qObj =  model.getQueryObject(col, table, where, '', order);
    
    var period = 5;
    var start = moment().format("YYYY/MM/DD") + " 00:00:00";
    var end = moment().add(period, 'day').format("YYYY/MM/DD") + " 00:00:00" ;
    
    var calendar = {};
    for (var i = 0; i < period; i++)
    {
        var prop = moment().add(i, 'day').format("YYYY/MM/DD");
        calendar[prop] = [];
    }
    console.log(start);
    console.log(end);

    qObj.request.input('start', model.db.NVarChar, start);
    qObj.request.input('end', model.db.NVarChar, end);

    model.select(qObj, qObj.request, function(err, data)
    {
        if (err.length > 0)
        {
            console.log('get execute plan scenario faild');
            console.log(err);
            res.status(510).send('シナリオ情報の取得に失敗しました');
        }
        
        console.log(data);

        //スケジュールの期間指定はdocumentDBにデータが入っているため
        //データを取得する必要がある
        var num = data.length;
        var docIdList = [];
        var docIndexList = [];
        for (var index = 0; index < num; index++)
        {
            var target = data[index];
            console.log(target);

            //スケジュール型期間指定の場合
            if (null !== target.scenario_action_document_id && 1 === target.scenario_type_value)
            {
                docIdList.push(target.scenario_action_document_id);
                docIndexList.push(index);
            }
            
            //
            Object.keys(calendar).forEach(function(key)
            {
                if (2 === target.scenario_type_value)
                {
                    calendar[key].push({scenario_id: target.scenario_id, scenario_name: target.scenario_name});
                }
                else if (null === target.scenario_action_document_id && 1 === target.scenario_type_value)
                {
                    var keyDay = moment(key).format("YYYY-MM-DD");
                    var day = moment(target.expiration_start_date).format("YYYY-MM-DD");
                    if (keyDay === day)
                    {
                        calendar[key].push({scenario_id: target.scenario_id, scenario_name: target.scenario_name});
                    }
                }
                else
                {
                    console.log("nothing!!");
                }
            });
        }
        
        res.json({data: calendar});
        
        // if (0 < docIdList.length)
        // {
        //     //
        // }
        // else
        // {
        //     res.json({data: calendardata});
        // }

    });

};

/**
 * アプローチ対象のシナリオを無効にする
 * 
 * @param {Object} req 画面からのリクエスト
 * @param {Object} res 画面へのレスポンス
 */
exports.bulkInvalid = function(req, res)
{
    var commonColumns = model.getUpdCommonColumns();
    var sql = 'UPDATE ' + tableName + ' SET status = @status, update_by = @update_by,  update_date = @update_date WHERE delete_flag = 0 AND approach = 1'; 
    var request = model.getRequest();
    request.input('update_by', model.db.Int, req.session.userId);
    request.input('update_date', model.db.NVarChar, commonColumns.update_date);
    request.input('status', model.db.Int, 0);

    model.execute(sql, request, function(err, data)
    {
        if (err.length > 0)
        {
            console.log('execute plan scenario bulk invalid faild');
            console.log(err);
            return res.status(510).send('無効化に失敗しました。');
        }
        model.insertLog(req.session.userId, 8, Message.SCENARIO.I_003);
        res.status(200).send('scenario status bulk invalid ok');
    });
};

/**
 * アプローチ対象の無効なシナリオを有効にする
 * 
 * @param {Object} req 画面からのリクエスト
 * @param {Object} res 画面へのレスポンス
 */
exports.bulkEnable = function(req, res)
{
    var commonColumns = model.getUpdCommonColumns();
    var sql = 'UPDATE ' + tableName + ' SET status = @status, update_by = @update_by,  update_date = @update_date WHERE delete_flag = 0 AND approach = 1'; 
    var request = model.getRequest();
    request.input('update_by', model.db.Int, req.session.userId);
    request.input('update_date', model.db.NVarChar, commonColumns.update_date);
    request.input('status', model.db.Int, 1);

    model.execute(sql, request, function(err, data)
    {
        if (err.length > 0)
        {
            console.log('execute plan scenario bulk enable faild');
            console.log(err);
            return res.status(510).send('有効化に失敗しました。');
        }
        model.insertLog(req.session.userId, 8, Message.SCENARIO.I_002);
        res.status(200).send('scenario status bulk enable ok');
    });
};

/**
 * priorityとstatusを更新する
 * 
 * @param {Object} req 画面からのリクエスト
 * @param {Object} res 画面へのレスポンス
 */
exports.savePriority = function(req, res)
{
    console.log('scenario save priority execute');
    console.log(req.body);
    var commonColumns = model.getUpdCommonColumns();

    model.async.forEach(req.body.data, function(item, callback)
    {
        delete item.scenario_name;
        delete item.scenario_type;
        delete item.valid_flag;
        
        var updateData = model.merge(item, commonColumns);

        var request = model.getRequest();
        request.input('update_by', model.db.Int, req.session.userId);
        request.input('update_date', model.db.NVarChar, updateData.update_date);
        
        request.input('scenario_id', model.db.Int, updateData.scenario_id);
        request.input('priority', model.db.Int, updateData.priority);
        request.input('status', model.db.Int, updateData.status);

        model.updateById(updateData, request, callback);
    }, 
    function (err) 
    {
        if (err.length > 0)
        {
            console.log('scenario priority update faild');
            console.log(err);
            res.status(510).send('scenario crate faild');
        }
        
        model.insertLog(req.session.userId, 8, Message.SCENARIO.I_001);
        res.status(200).send('scenario priority update ok');
    });    
};

exports.getBySegmentId = function(segment_id, callback)
{
    var col = "scenario_id, scenario_name, valid_flag";
    var where = "delete_flag = 0 AND segment_id = @segment_id";
    var qObj = model.getQueryObject(col, tableName, where, '', '');
    qObj.request.input('segment_id', model.db.Int, segment_id);
    model.select(qObj, qObj.request, callback);
};

/**
 * シナリオを保存する
 * パラメータにPKが存在するか否かで登録するか更新するかを決定する
 * 
 * @param {Object} req 画面からのリクエスト
 * @param {Object} res 画面へのレスポンス
 */
exports.save = function(req, res)
{
    console.log('scenario save execute');
    if (!req.body.hasOwnProperty('scenario')) res.status(510).send('param is not found');

    if (req.body.scenario.hasOwnProperty('scenario_id'))
    {
        update(req, res);
    }
    else
    {
        model.async.parallel(
        {
            env: function(callback)
            {
                var env = require("./environment");
                env.get(callback);
            },
            count: function(callback)
            {
                var col = "count(1) as count";
                var where = "delete_flag = 0 and scenario_type = @scenario_type";
                var qObj = model.getQueryObject(col, tableName, where, '', '');
                qObj.request.input('scenario_type', model.db.SmallInt, req.body.scenario.scenario_type);
                model.select(qObj, qObj.request, callback);
            },
        },
        function complete(err, items)
        {
            if (0 < err.length)
            {
                console.log('scenario initialize data select faild');
                console.log(err);
                return res.status(510).send('システムエラーが発生しました。');
            }
            var envInfo = items.env[0];
            var max = (1 == req.body.scenario.scenario_type) 
                ? envInfo.schedule_scenario_max : envInfo.trigger_scenario_max;
                
            if (max <= items.count[0].count)
            {
                res.status(510).send('これ以上登録できません。<br>不要なシナリオを削除してください。');
            }
            else
            {
                create(req, res);
            }
        });
    }
};

/**
 * シナリオを登録する
 * 
 * @param {Object} req 画面からのリクエスト
 * @param {Object} res 画面へのレスポンス
 */
function create(req, res)
{
    scenariodoc.saveItemForWeb(true, req.body.doc, function(err, doc)
    {
        if (null !== err)
        {
            console.log('scenario create doc faild');
            console.log(err);
            console.log(req.body);
            return res.status(510).send('シナリオドキュメントの作成に失敗しました');
        }
        else
        {

            model.tranBegin(function(err, transaction)
            {
                model.async.waterfall(
                [
                    function(callback)
                    {
                        var commonColumns = model.getInsCommonColumns(req.session.userId);
                        var insertData = model.merge(req.body.scenario, commonColumns);
                        insertMine(transaction, insertData, function(err, scenarioId)
                        {
                            if (err.length > 0)
                            {
                                console.log('insert faild M_SCENARIO');
                                console.log(err);
                                callback(err, {});
                                return;
                            }
                            callback(null, scenarioId);
                        });
                    },
                    function(scenarioId, callback)
                    {
                        insertChildren(transaction, req, scenarioId, doc, function(err, childTabelName)
                        {
                            if (err.length > 0)
                            {
                                console.log(childTabelName + ' insert faild');
                                console.log(err);
                                callback(err, {});
                                return;
                            }
                            callback(null, scenarioId);
                        });
                    },
                    function(scenarioId, callback)
                    {
                        console.log("insert tag execute");
                        console.log(scenarioId);
                        insertTags(transaction, req.session.userId, req.body.tags, function(err, tagList)
                        {
                            console.log(err);
                            console.log(tagList);
                            if (null != err)
                            {
                                console.log("insert tags faild");
                                console.log(err);
                                callback(err);
                            }
                            else
                            {
                                callback(null, scenarioId, tagList);
                            }
                        });
                    },
                    function(scenarioId, tagList, callback)
                    {
                        console.log("insert scenario tag execute");
                        console.log(scenarioId);
                        console.log(tagList);
                        insertScnarioTag(transaction, req.session.userId, scenarioId, tagList, function(err, tagList)
                        {
                            callback(err);
                        });
                    }
                ],
                function(err)
                {
                    console.log("main last function");
                    console.log(err);
                    if (null != err)
                    {
                        console.log('scenario insert faild');
                        console.log(err);
                        
                        //documentを削除しなくちゃ
                        if (null !== doc)
                        {
                            scenariodoc.removeItemForWeb(doc.id, function(err, doc)
                            {
                                if (err)
                                {
                                    console.log('scenario document remove faild');
                                    console.log(err);
                                    console.log(doc);
                                }
                                transaction.rollback(function(err)
                                {
                                    if (err)
                                    {
                                        console.log('scenario data rollback faild');
                                        console.log(err);
                                        res.status(510).send("システムエラーが発生しました。");
                                    }
                                    else
                                    {
                                        model.insertLog(req.session.userId, 8, Message.COMMON.E_001, req.body.scenario.scenario_name);
                                        res.status(510).send("シナリオの登録に失敗しました。");
                                    }
                                });
                            });
                        }
                    }
                    else
                    {
                        transaction.commit(function(err)
                        {
                            if (err)
                            {
                                console.log('scenario data commit faild');
                                console.log(err);
                                res.status(510).send("システムエラーが発生しました。");
                            }
                            else
                            {
                                model.insertLog(req.session.userId, 8, Message.COMMON.I_001, req.body.scenario.scenario_name);
                                res.status(200).send('insert ok');
                            }
                        });
                    }
                });
            });
            
        }
    });
}

function insertMine(transaction, insertData, callback)
{
    var request = model.getRequest(transaction);

    request.input('delete_flag', model.db.SmallInt, insertData.delete_flag);
    request.input('create_by', model.db.Int, insertData.create_by);
    request.input('create_date', model.db.NVarChar, insertData.create_date);
    request.input('update_by', model.db.Int, insertData.update_by);
    request.input('update_date', model.db.NVarChar, insertData.update_date);
    
    request.input('segment_id', model.db.Int, insertData.segment_id);
    request.input('if_layout_id', model.db.Int, insertData.if_layout_id);
    request.input('scenario_name', model.db.NVarChar, insertData.scenario_name);
    request.input('output_name', model.db.NVarChar, insertData.output_name);
    request.input('scenario_type', model.db.SmallInt, insertData.scenario_type);
    request.input('status', model.db.SmallInt, insertData.status);
    request.input('approach', model.db.SmallInt, insertData.approach);
    request.input('priority', model.db.Int, 32767);

    model.insert(tableName, insertData, request, function(err, id)
    {
        callback(err, id);
    });
}

function insertChildren(transaction, req, id, doc, callback)
{
    var request = model.getRequest(transaction);
    var childTabelObject = '';
    var childTabelName = '';
    var specificInfo = {};
    
    if (1 === req.body.scenario.scenario_type)
    {
        var expiration_end_date = 
            (null === req.body.specificInfo.expiration_end_date || 0 === req.body.specificInfo.expiration_end_date.length) 
                ? null : req.body.specificInfo.expiration_end_date;
        specificInfo = 
        {
            repeat_flag: req.body.specificInfo.repeat_flag,
            expiration_start_date: req.body.specificInfo.expiration_start_date,
            expiration_end_date: expiration_end_date
        };
        
        childTabelObject = require("./schedulescenario");
        childTabelName = 'M_SCHEDULE_SCENARIO';
        request.input('repeat_flag', model.db.Int, specificInfo.repeat_flag);
        request.input('expiration_start_date', model.db.NVarChar, specificInfo.expiration_start_date);
        request.input('expiration_end_date', model.db.NVarChar, specificInfo.expiration_end_date);
    }
    else if (2 === req.body.scenario.scenario_type)
    {
        specificInfo = 
        {
            after_event_occurs_num: req.body.specificInfo.after_event_occurs_num,
            inoperative_num: req.body.specificInfo.inoperative_num
        };
        
        childTabelObject = require("./triggerscenario");
        childTabelName = 'M_TRIGGER_SCENARIO';
        request.input('after_event_occurs_num', model.db.Int, specificInfo.after_event_occurs_num);
        request.input('inoperative_num', model.db.Int, specificInfo.inoperative_num);
    }
    
    var commonColumns = model.getInsCommonColumns(req.session.userId);
    var insertData = model.merge(specificInfo, commonColumns);
    insertData.scenario_id = id;
    insertData.scenario_action_document_id = (null === doc) ? null : doc.id;

    request.input('delete_flag', model.db.SmallInt, insertData.delete_flag);
    request.input('create_by', model.db.Int, insertData.create_by);
    request.input('create_date', model.db.NVarChar, insertData.create_date);
    request.input('update_by', model.db.Int, insertData.update_by);
    request.input('update_date', model.db.NVarChar, insertData.update_date);
    request.input('scenario_id', model.db.Int, insertData.scenario_id);
    request.input('scenario_action_document_id', model.db.NVarChar, insertData.scenario_action_document_id);
    
    childTabelObject.saveForParent(insertData, request, function(err, data)
    {
        callback(err, childTabelName);
    });
}

/**
 * パラメータのtagsにidのプロパティがなければそれは新規作成となり
 * T_TAGに登録される。
 * ただし、同一名称のものが存在した場合は、登録しない。
 * 
 */
function insertTags(transaction, userid, tags, callback)
{
    console.log("insert tags");
    var tag = require("./tag");
    tag.save(transaction, userid, tags, function(err, tagList)
    {
        console.log("insert tags end");
        callback(err, tagList);
    });
}

/**
 * シナリオにタグを設定する
 * 
 */
function insertScnarioTag(transaction, userid, scenarioId, tags, callback)
{
    console.log("insert tags");
    var scenarioTag = require("./scenariottag");
    scenarioTag.save(transaction, userid, scenarioId, tags, function(err, tagList)
    {
        console.log("insert tags end");
        callback(err, tagList);
    });
}

/**
 * シナリオを更新する
 * 
 * @param {Object} req 画面からのリクエスト
 * @param {Object} res 画面へのレスポンス
 */
function update(req, res)
{
    console.log('scenario update start');
    var childTabelObject = '';
    var childTabelName = '';
    var isSchedule = (1 === req.body.scenario.scenario_type);
    if (isSchedule)
    {
        childTabelObject = require("./schedulescenario");
        childTabelName = 'M_SCHEDULE_SCENARIO';
    }
    else
    {
        childTabelObject = require("./triggerscenario");
        childTabelName = 'M_TRIGGER_SCENARIO';
    }
    
    var commonColumns = model.getUpdCommonColumns();
    
    model.tranBegin(function(err, transaction)
    {
        model.async.waterfall(
        [
            function(callback)
            {
                console.log('get scenario by id');
                console.log(req.body.scenario.scenario_id);
                childTabelObject.getByScenarioId(req.body.scenario.scenario_id, function(err, data)
                {
                    console.log(data);
                    if (err.length > 0)
                    {
                        console.log('trigger scenario is not found');
                        console.log(err);
                        res.status(510).send('scenario update faild');
                        
                    }
                    callback(null, data);
                });
            },
            function(data, callback)
            {
                if (req.body.hasOwnProperty('doc'))
                {
                    console.log('update scenario doc');
                    var doc = req.body.doc;
                    doc.id = data[0].scenario_action_document_id;
                    console.log(doc);
                    if (null === doc.id)
                    {
                        console.log('no update scenario doc');
                        callback(null);
                    }
                    else
                    {
                        scenariodoc.saveItemForWeb(false, doc, function(err, doc)
                        {
                            console.log('scenario doc update');
                            console.log(err);
                            console.log(doc);
                            callback(err);
                        });
                    }
                }
                else
                {
                    console.log('no update scenario doc');
                    callback(null);
                }
            },
            function(callback)
            {
                //scenarioマスタを更新
                delete req.body.scenario.delete_flag;
                delete req.body.scenario.create_by;
                delete req.body.scenario.create_date;
                delete req.body.scenario.priority;  //優先順位はここで更新したくないため削除
                delete req.body.scenario.valid_flag;
                console.log(commonColumns);
                var updateData = model.merge(commonColumns, req.body.scenario, true);
                console.log(updateData);
                
                var request = model.getRequest(transaction);
                request.input('update_by', model.db.Int, req.session.userId);
                request.input('update_date', model.db.NVarChar, updateData.update_date);
                
                request.input('segment_id', model.db.Int, updateData.segment_id);
                request.input('if_layout_id', model.db.Int, updateData.if_layout_id);
                request.input('scenario_name', model.db.NVarChar, updateData.scenario_name);
                request.input('output_name', model.db.NVarChar, updateData.output_name);
                request.input('scenario_type', model.db.SmallInt, updateData.scenario_type);
                request.input('status', model.db.SmallInt, updateData.status);
                request.input('approach', model.db.SmallInt, updateData.approach);
    
                console.log('update scenario info');
                model.updateById(updateData, request, function(err, data)
                {
                    var nextErr = (0 < err.length) ? err.length: null;
                    callback(nextErr);
                });
            },
            function(callback)
            {
                //子テーブル更新
                var updateData = model.merge(commonColumns, req.body.specificInfo, true);
                updateData.scenario_id = req.body.scenario.scenario_id;
                
                var request = model.getRequest(transaction);
                request.input('update_by', model.db.Int, req.session.userId);
                console.log('update ' + childTabelName);
                childTabelObject.updateByScenarioId(updateData, request, function(err, data)
                {
                    console.log(err);
                    console.log(data);
                    var nextErr = (0 < err.length) ? err.length: null;
                    callback(nextErr);
                });
            },
            function(callback)
            {
                insertTags(transaction, req.session.userId, req.body.tags, function(err, tagList)
                {
                    console.log("tag insert end next is sc tag");
                    console.log(err);
                    console.log(tagList);
                    if (null != err)
                    {
                        console.log("insert tags faild");
                        console.log(err);
                        callback(err);
                    }
                    else
                    {
                        //タグ更新
                        var scenarioTag = require("./scenariottag");
                        var param = {
                            userId: req.session.userId,
                            transaction: transaction, 
                            scenarioId: req.body.scenario.scenario_id, 
                            tagList: tagList};
                        scenarioTag.deleteInsert(param, callback);
                    }
                });
            }
        ], 
        function(err)
        {
            console.log('execute last function');
            if (null !== err && 0 !== err.length)
            {
                console.log(err);
                
                transaction.rollback(function(err)
                {
                    if (err)
                    {
                        console.log('scenario data rollback faild');
                        console.log(err);
                        return res.status(510).send("システムエラーが発生しました。");
                    }
                    else
                    {
                        model.insertLog(req.session.userId, 8, Message.COMMON.E_001, req.body.scenario.scenario_name);
                        return res.status(510).send("シナリオの更新に失敗しました。");
                    }
                });
            }
            else
            {
                console.log('commit execute');
                transaction.commit(function(err)
                {
                    console.log(err);
                    if (err)
                    {
                        console.log('scenario data commit faild');
                        console.log(err);
                        res.status(510).send("システムエラーが発生しました。");
                    }
                    else
                    {
//                        model.insertLog(req.session.userId, 8, Message.COMMON.I_001, req.body.scenario.scenario_name);
                        res.status(200).send('insert ok');
                    }
                });
            }
        });
    });
}

/**
 * PKに合致したレコードのdelete_flagを1にする
 * 
 * @param {Object} req 画面からのリクエスト
 * @param {Object} res 画面へのレスポンス
 */
exports.remove = function(req, res)
{
    console.log('scenario remove exexute');
    
    if (!req.params.hasOwnProperty('id')) res.status(510).send('scenario remove faild');
    if (!req.params.hasOwnProperty('type')) res.status(510).send('scenario remove faild');

    var id = req.params.id;
    var type = req.params.type;
    var scenarioTypeObject = ''; 
    if ('trigger' === type)
    {
        scenarioTypeObject = require("./triggerscenario");
    }
    else
    {
        scenarioTypeObject = require("./schedulescenario");
    }
    
    scenarioTypeObject.getByScenarioId(id, function(err, typeData)
    {
        console.log(typeData);
        
        if (err.length > 0)
        {
            console.log('scenario remove faild');
            console.log(id);
            console.log(err);
        }
        
        var exsitsData = true;
        if (0 === typeData.length)
        {
            console.log('scenario type data not found');
            console.log(id);
            exsitsData = false;
        }
        
        model.tranBegin(function(err, transaction)
        {
            //transactionはキューにしなきゃいけないからwaterfallで実効
            model.async.waterfall(
            [
                //トリガー情報削除
                function(callback)
                {
                    if (exsitsData)
                    {
                        var pk = 0;
                        if ('trigger' === type)
                        {
                            pk = typeData[0].trigger_scenario_id;
                        }
                        else if ('schedule' === type)
                        {
                            pk = typeData[0].schedule_scenario_id;
                        }
                        scenarioTypeObject.remove(pk, transaction, callback);
                    }
                    else
                    {
                        callback(null);
                    }
                },
                //シナリオ情報削除
                function(callback)
                {
                    model.removeByIdAndTran(id, transaction, function(err)
                    {
                        var errInfo = (0 < err.length) ? err : null;
                        callback(errInfo);
                    });
                },
                function(callback)
                {
                    var scenarioTtag = require("./scenariottag");
                    scenarioTtag.removeByScenarioId(transaction, id, callback);
                },
            ], 
            function(err)
            {
                console.log(err);
                
                if (null != err)
                {
                    console.log(err);
                    transaction.rollback(function(err)
                    {
                        if (err)
                        {
                            console.log('scenario data rollback faild');
                            console.log(err);
                            return res.status(510).send("システムエラーが発生しました。");
                        }
                        else
                        {
//                                        model.insertLog(req.session.userId, 8, Message.COMMON.E_001, typeData[0].);
                            return res.status(510).send("シナリオの削除に失敗しました。");
                        }
                    });
                }
                //シナリオdox削除
                if (exsitsData && null !== typeData[0].scenario_action_document_id)
                {
                    console.log("doc delete");
                    var scenariodoc = require("./scenariodoc");
                    scenariodoc.removeItemForWeb(typeData[0].scenario_action_document_id, function(err)
                    {
                        console.log("doc delete complete");
                        if (err)
                        {
                            transaction.rollback(function(err)
                            {
                                if (err)
                                {
                                    console.log('scenario data rollback faild');
                                    console.log(err);
                                    res.status(510).send("システムエラーが発生しました。");
                                }
                                else
                                {
//                                        model.insertLog(req.session.userId, 8, Message.COMMON.E_001, typeData[0].);
                                    return res.status(510).send("シナリオの削除に失敗しました。");
                                }
                            });
                        }
                        else
                        {
                            transaction.commit(function(err)
                            {
                                if (err)
                                {
                                    console.log('scenario data commit faild 1');
                                    console.log(err);
                                    res.status(510).send("システムエラーが発生しました。");
                                }
                                else
                                {
    //                                model.insertLog(req.session.userId, 8, Message.COMMON.I_001, req.body.scenario.scenario_name);
                                    return res.status(200).send('remove ok');
                                }
                            });
                        }
                    });
                }
                else
                {
                    transaction.commit(function(err)
                    {
                        if (err)
                        {
                            console.log('scenario data commit faild 2');
                            console.log(err);
                            res.status(510).send("システムエラーが発生しました。");
                        }
                        else
                        {
//                                model.insertLog(req.session.userId, 8, Message.COMMON.I_001, req.body.scenario.scenario_name);
                            return res.status(200).send('remove ok');
                        }
                    });
                }
            });
        });
    });
};

/**
 * PKに合致したレコードを物理削除する
 * 
 * @param {Object} req 画面からのリクエスト
 * @param {Object} res 画面へのレスポンス
 */
exports.delete = function(req, res)
{
    var id = req.params.id;
    model.deleteById(id, function(err, data)
    {
        if (err.length > 0)
        {
            console.log(err);
            res.status(510).send('object not found');
        }
        res.status(200).send('delete ok');
    });
};

/**
 * シナリオコントロール画面に表示する初期値を取得する
 * リクエストにシナリオIDが存在する場合は該当情報も取得する
 * 
 * @param {Object} req 画面からのリクエスト
 * @param {Object} res 画面へのレスポンス
 */
exports.initializeData = function(req, res)
{
    console.log('scenario control initializeData');
    model.async.parallel(
    {
        //セグメント情報
        segment: function(callback)
        {
            var table = 'M_SEGMENT';
            var col = 'segment_id, segment_name';
            var where = 'delete_flag = 0';
            var order = 'segment_id';
            var qObj = model.getQueryObject(col, table, where, '', order);

            model.select(qObj, qObj.request,  function(err, data){callback(null, data)});
        },
        //IF情報
        ifLayout: function(callback)
        {
            var data = [{if_layout_id: 1, if_name: 'デフォルトテンプレート'}];
            callback(null, data);
        },
        //アクション情報
        action: function(callback)
        {
            if ('trigger' === req.params.type)
            {
                var action = require('../config/action.json');
                var list = [];
                Object.keys(action).forEach(function(key)
                {
                    var target = action[key];
                    list.push({logicalname: target.logicalname, physicalname: target.physicalname, description: target.description});
                });
                
                callback(null, list);
            }
            else if ('schedule' === req.params.type)
            {
                callback(null, {});
            }
        },
        //該当情報
        target: function(callback)
        {
            if (void 0 !== req.params.id)
            {
                model.getById(req.params.id, callback);
            }
            else
            {
                callback(null, {});
            }
        }
        //個別情報
    },
    function complete(err, items)
    {
        console.log("complete fuction start");
        //parallel実行した場合、5こめのfunctionが実行完了前に
        //completeしてしまう。これはたぶんライブラリのバグだと思うけど、
        //どうにもならないのでここでさらに実行させる
        model.async.parallel(
        {
            specificData: function(callback)
            {
                if (req.params.hasOwnProperty("id"))
                {
                    var typeObject;
                    if ('trigger' === req.params.type)
                    {
                        typeObject = require("./triggerscenario");
                    }
                    else if ('schedule' === req.params.type)
                    {
                        typeObject = require("./schedulescenario");
                    }
                    typeObject.getByScenarioId(req.params.id, function(err, data)
                    {
                        console.log(data);
                        scenariodoc.getItemByIdForWeb(data[0].scenario_action_document_id, function(err, doc)
                        {
                            callback(null, {specific: data[0], doc: doc});
                        });
                    });
                }
                else
                {
                    callback(null, []);
                }
            },
            settinTags: function(callback)
            {
                var scenarioTag = require("./scenariottag");
                if (req.params.hasOwnProperty("id"))
                {
                    scenarioTag.getByScenarioId(req.params.id, function(err, data){callback(null, data)});
                }
                else
                {
                    callback(null, []);
                }
                
            },
            tagList: function(callback)
            {
                var tag = require("./tag");
                tag.getAll(function(err, data){callback(null, data)});
                
            }
        },
        function complete(err, items2)
        {
            console.log(err);
            res.json(
                {
                    segment: items.segment,
                    ifLayout: items.ifLayout,
                    specific: items.action, 
                    target: items.target[0], 
                    specificInfo: items2.specificData,
                    settinTags: items2.settinTags,
                    tagList: items2.tagList,
                });
        });
    });
};

/**
 * 同一名称が存在するかをチェックする
 * リクエスト値にシナリオIDが存在する場合は該当レコードの名称を除外してチェックする
 * 
 * @param {Object} req 画面からのリクエスト
 * @param {Object} res 画面へのレスポンス
 */
exports.isSameName = function(req, res)
{
    var scenarioId = req.body.id;
    if (void 0 === scenarioId)
    {
        model.isSameItem('scenario_name', req.body.scenario_name, model.db.NVarChar, function(err, result)
        {
            if (err.length > 0)
            {
                console.log(err);
                res.status(510).send('query execute faild');
            }
            res.json({result: result[0]});
        });
    }
    else
    {
        var conditions = [
            {columns: pk, type: model.db.Int, value: scenarioId, symbol: '!='},
            {columns: 'scenario_name', type: model.db.NVarChar, value: req.body.scenario_name, symbol: '='},
        ];
        model.isSameItemByMultipleCondition(conditions , function(err, result)
        {
            if (err.length > 0)
            {
                console.log(err);
                res.status(510).send('query execute faild');
            }
            res.json({result: result[0]});
        });
    }
};

/**
 * action.jsonからパラメータのnameと合致する情報を取得する
 * 
 * @param {Object} req 画面からのリクエスト
 * @param {Object} res 画面へのレスポンス
 */
exports.getActionByName = function(req, res)
{
    var physicalname = req.params.name;
    if (void 0 === physicalname) res.status(510).send('params not found');

    var action = require('../config/action.json');
    if (action.hasOwnProperty(physicalname))
    {
        res.json({data: action[physicalname]});
    }
    else
    {
        res.status(510).send('action is not found');
    }
};