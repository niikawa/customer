var moment = require('moment');
var Core = require('./core');
var Message = require('../config/message.json');
var scenariodoc = require("./scenariodoc");
var Validator = require("../helper/validator");
var logger = require("../helper/logger");

/** 
 * テーブル名
 * @property TABLE_NAME
 * @type {string}
 * @final
 */
var TABLE_NAME = 'M_SCENARIO';
/** 
 * 主キー名 
 * @property PK_NAME
 * @type {string}
 * @final
 */
var PK_NAME = 'scenario_id';
/** 
 * SEQ名
 * @property SEQ_NAME
 * @type {string}
 * @final
 */
var SEQ_NAME = 'seq_scenario';
/** 
 * 機能名
 * @property FUNCTION_NAME
 * @type {string}
 * @final
 */
var FUNCTION_NAME = 'シナリオ管理';
/** 
 * 機能番号
 * @property FUNCTION_NAME
 * @type {Number}
 * @final
 */
var FUNCTION_NUMBER = 6;
/** 
 * レスポンスメッセージ文字列
 * @property RESPONSE_MESSAGE_BIND_STRING
 * @type {String}
 * @final
 */
var RESPONSE_MESSAGE_BIND_STRING = "シナリオ";
/** 
 * 週表示のデフォルト数
 * @property RESPONSE_MESSAGE_BIND_STRING
 * @type {Number}
 * @final
 */
var DEFAULT_PERIOD = 5;

/** 
 * シナリオ機能APIのクラス
 * 
 * @namespace api
 * @class Scenario
 * @constructor
 * @extends api.core
 */
var Scenario = function Scenario()
{
    Core.call(this, TABLE_NAME, PK_NAME, SEQ_NAME);
    //カレンダー生成用にmomentの設定を日本語にする
    moment.locale('ja', {
        weekdays: ["日曜日","月曜日","火曜日","水曜日","木曜日","金曜日","土曜日"],
        weekdaysShort: ["日","月","火","水","木","金","土"],
        weekdaysMin:["sun", "mon", "tue", "wed", "thu", "fri", "sat"],
    });
    this.validator = new Validator();
    var scenarioObjectRules =
    {
        approach: 
        [
            {func: this.validator.isRequire},
            {func: this.validator.isNumber},
            {func: this.validator.isMatchValueList, condition:[0, 1]}
        ],
        if_layout_id: 
        [
            {func: this.validator.isRequire},
        ],
        output_name: 
        [
            {func: this.validator.isRequire},
            {func: this.validator.isNotMaxOrver, condition: {max: 100}},
        ],
        scenario_name: 
        [
            {func: this.validator.isRequire},
            {func: this.validator.isNotMaxOrver, condition: {max: 100}},
        ],
        scenario_type: 
        [
            {func: this.validator.isRequire},
            {func: this.validator.isNumber},
            {func: this.validator.isMatchValueList, condition:[1, 2]},
        ],
        segment_id: 
        [
            {func: this.validator.isRequireIfExistsProp}
        ],
        status:
        [
            {func: this.validator.isRequire},
            {func: this.validator.isNumber},
            {func: this.validator.isMatchValueList, condition:[0, 1]},
        ],
    };
    this.parametersRulesMap = 
    {
        getById:
        {
            id:
            [
                {func: this.validator.isRequire},
                {func: this.validator.isNumber},
                {func: this.validator.isNotMaxOrver, condition: {max:9223372036854775807}}
            ],
        },
        getAll:
        {
            type:
            [
                {func: this.validator.isRequire},
                {func: this.validator.isMatchValueList, condition: ["trigger", "schedule"]}
            ]
        },
        save:
        {
            scenario:
            [
                {func: this.validator.isRequire},
                {func: this.validator.isMatchPropList, condition: scenarioObjectRules}
            ],
            scenario_id:
            [
                {func: this.validator.isRequireIfExistsProp}
            ]
        },
        remove:
        {
            id:
            [
                {func: this.validator.isRequire},
                {func: this.validator.isNumber},
                {func: this.validator.isNotMaxOrver, condition: {max:9223372036854775807}}
            ],
            type:
            [
                {func: this.validator.isRequire},
                {func: this.validator.isMatchValueList, condition: ["trigger", "schedule"]}
            ]
        }
    };
    
};

//coreModelを継承する
var util = require('util');
util.inherits(Scenario, Core);

/**
 * リクエストパラメータのチェックを行う
 * 
 * @method validation
 * @param {string} key 実行対象メソッド名
 * @param {Object} parameters チェック対象パラメータオブジェクト
 * @return {bool} 
 */
Scenario.prototype.validation = function(key ,parameters)
{
    var rules = this.parametersRulesMap[key];
    return this.validator.execute(rules, parameters);
};

var model = new Scenario();

/**
 * IDからデータを取得する
 * 
 * @method getById
 * @param {Object} req リクエストオブジェクト
 *  @param {Object} req.params GETされたパラメータを格納したオブジェクト
 *   @param {Number} req.params.id シナリオID
 * @param {Object} res レスポンスオブジェクト
 * @return 
 */
exports.getById = function(req, res)
{
    if (!model.validation("getById", req.params))
    {
        logger.error(Message.COMMON.E_103.replace("$1", FUNCTION_NAME+"[scenario.getById]"), req);
        res.status(511).send(Message.COMMON.E_101);
        return;
    }
    model.getById(req.params.id, function(err, data)
    {
        if (null !== err)
        {
            logger.error(Message.COMMON.E_102.replace("$1", FUNCTION_NAME+"[scenario.getById]"), req, err);
            model.insertLog(req.session.userId, FUNCTION_NUMBER, Message.COMMON.E_004, FUNCTION_NAME);
            res.status(511).send(Message.COMMON.E_004.replace("$1", RESPONSE_MESSAGE_BIND_STRING));
            return;
        }
        
        model.insertLog(req.session.userId, FUNCTION_NUMBER, Message.COMMON.I_004, data[0].scenario_name);
        res.json({data: data});
    });
};

/**
 * シナリオをすべて取得する<br>
 * 並び順はPKの昇順
 * 
 * @method getAll
 * @param {object} req リクエストオブジェクト
 * @param {object} res レスポンスオブジェクト
 * 
 * @return {}
 */
exports.getAll = function(req, res)
{
    if (!model.validation("getAll", req.params))
    {
        logger.error(Message.COMMON.E_103.replace("$1", FUNCTION_NAME+"[scenario.getById]"), req);
        res.status(511).send(Message.COMMON.E_101);
        return;
    }
    
    var col = "T1.scenario_id, FORMAT(T1.update_date, 'yyyy/MM/dd') AS update_date, T1.scenario_name, " +
                "CASE T1.approach WHEN 1 THEN N'対象' WHEN 0 THEN N'対象外' ELSE N'未設定' END AS approach, " +
                "CASE T1.status WHEN 1 THEN N'有効' WHEN 0 THEN N'無効' ELSE N'未設定' END AS status, T3.tag_name";
    var table = TABLE_NAME + " T1 LEFT JOIN T_SCENARIO_TAG T2 ON T1.scenario_id = T2.scenario_id AND T2.delete_flag = 0 LEFT JOIN T_TAG T3 ON T2.tag_id = T3.tag_id AND T3.delete_flag = 0";
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
        if (null !== err)
        {
            logger.error(Message.COMMON.E_102.replace("$1", FUNCTION_NAME+"[scenario.getAll -> core.getById]"), req, err);
            model.insertLog(req.session.userId, FUNCTION_NUMBER, Message.COMMON.E_004, functionName);
            res.status(511).send(Message.COMMON.E_102.replace("$1", RESPONSE_MESSAGE_BIND_STRING));
            return;
        }
        var num = data.length;
        var last = num - 1;
        var tagList = [];
        var newData = [];
        if (0 < num)
        {
            var defore = data[0].scenario_id;
            //タグは複数シナリオに設定できるため取得レコードをまとめる
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
            
            //まとめた結果データが1件しかない、またはすべて同じデータだった場合
            if (0 === newData.length)
            {
                data[0].searchTag = tagList.join(" ");
                newData.push(data[0]);
            }
        }
            
        model.insertLog(req.session.userId, FUNCTION_NUMBER, Message.COMMON.I_004, functionName);
        res.json({data: newData});
    });
};

/**
 * アプローチ対象のシナリオを取得する<br>
 * 並び順はpriorityとscenario_idの昇順
 * 
 * @method getValid
 * @param {object} req リクエストオブジェクト
 * @param {object} res レスポンスオブジェクト
 * @return {}
 */
exports.getValid = function(req, res)
{
    var col = "scenario_id, scenario_name, status, priority, valid_flag," +
                "CASE scenario_type WHEN 1 THEN 'schedule' WHEN 2 THEN 'trigger' ELSE N'未設定' END AS scenario_type_key, " +
                "CASE scenario_type WHEN 1 THEN N'スケジュール' WHEN 2 THEN N'トリガー' ELSE N'未設定' END AS scenario_type";

    //アプローチ対象となる条件は、削除フラグが0かつアプローチが対象（1）のもの。
    var where = "delete_flag = 0 AND approach = 1";
    var order = "priority, scenario_id";
    var qObj = model.getQueryObject(col, TABLE_NAME, where, '', order);
    
    model.select(qObj, qObj.request, function(err, data)
    {
        if (null !== err)
        {
            logger.error(Message.COMMON.E_102.replace("$1", FUNCTION_NAME+"[scenario.getValid->select]"), req, err);
            model.insertLog(req.session.userId, FUNCTION_NUMBER, Message.COMMON.E_102, FUNCTION_NAME);
            res.status(511).send(Message.COMMON.E_102.replace("$1", RESPONSE_MESSAGE_BIND_STRING));
            return;
        }
        res.json({data: data});
    });
};

/**
 * アプローチ対象のシナリオを取得する
 * 並び順はpriorityとscenario_idの昇順
 * 
 * @method getScenarioCount
 * @param {object} req リクエストオブジェクト
 * @param {object} res レスポンスオブジェクト
 * @return {}
 */
exports.getScenarioCount = function(req, res)
{
    //非同期でデータを取得する
    model.async.parallel(
    {
        //環境情報
        env: function(callback)
        {
            var env = require("./environment");
            env.get(callback);
        },
        //件数
        count: function(callback)
        {
            var col = "scenario_type, count(1) as regist_num, "+
                "CASE scenario_type WHEN 1 THEN 'schedule' WHEN 2 THEN 'trigger' ELSE N'未設定' END AS scenario_type_key, " +
                "CASE scenario_type WHEN 1 THEN N'スケジュール型シナリオ' WHEN 2 THEN N'トリガー型シナリオ' ELSE N'未設定' END AS scenario_type_name";
            var where = "delete_flag = 0";
            var grop = "scenario_type";
            var qObj = model.getQueryObject(col, TABLE_NAME, where, grop, '');
            
            model.select(qObj, qObj.request, callback);
        },
    },
    function complete(err, items)
    {
        if (null !== err)
        {
            logger.error(Message.COMMON.E_102.replace("$1", FUNCTION_NAME+"[scenario.getScenarioCount -> complete]"), req, err);
            model.insertLog(req.session.userId, FUNCTION_NUMBER, Message.COMMON.E_102, FUNCTION_NAME);
            res.status(511).send(Message.COMMON.E_102.replace("$1", RESPONSE_MESSAGE_BIND_STRING));
            return;
        }
        //取得した情報から、各シナリオの登録数と登録最大数のリストを作成する
        var list = [];
        var envInfo = items.env[0];
        //シナリオが登録されていない場合
        if (0 === items.count.length)
        {
            list.push({scenario_type_key: 'schedule', scenario_type_name:'スケジュール型シナリオ', regist_num: 0, regist_max: envInfo.schedule_scenario_max});
            list.push({scenario_type_key: 'trigger', scenario_type_name:'トリガー型シナリオ', regist_num: 0, regist_max: envInfo.trigger_scenario_max});
        }
        //どちらかのみ登録されている場合
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
        //両方登録されている場合
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
 * @method getExecutePlanScenario
 * @param {object} req リクエストオブジェクト
 * @param {object} res レスポンスオブジェクト
 * @return {}
 */
exports.getExecutePlanScenario = function(req, res)
{
    var col = "T1.scenario_id, T1.scenario_name, T1.valid_flag, FORMAT(T1.last_execute_date, 'yyyy/MM/dd') AS last_execute_date, T1.execute_target_num, "+
        "CASE T1.scenario_type WHEN 1 THEN N'スケジュール' WHEN 2 THEN N'トリガー' ELSE N'未設定' END AS scenario_type, "+
        "CASE T1.scenario_type WHEN 1 THEN 'schedule' WHEN 2 THEN 'trigger' ELSE N'未設定' END AS scenario_type_key";
    
    var table = TABLE_NAME + " T1 LEFT JOIN M_SCHEDULE_SCENARIO T2 ON T1.scenario_id = T2.scenario_id ";
    
    //実行予定となる条件は、削除フラグが0かつアプローチが対象（1）かつステータスが有効（1）
    //トリガーシナリオの場合は上記条件を満たせば実行予定となるため、開始期限日がnullであるレコードを条件として指定する。
    //スケジュール型シナリオの場合は日付を持っているので、追加で以下の条件を設定する
    // 開始期限日がnullではなく、終了期限日が本日よりも未来であること（機関指定されているレコードを特定する条件）
    // または、開始期限日が本日であり、終了期限日がnull (日付指定されているレコードを特定する条件)
    var where = "T1.delete_flag = 0 AND T1.approach = 1 AND T1.status = 1";
    where += " AND ( T2.expiration_start_date is null OR (T2.expiration_start_date is not null AND expiration_end_date >= @now) OR T2.expiration_start_date = @now AND T2.expiration_end_date is null)";
    
    var order = "T1.priority, T1.scenario_id";
    var qObj =  model.getQueryObject(col, table, where, '', order);
    
    var now = moment().format("YYYY/MM/DD") + " 00:00:00";

    qObj.request.input('now', model.db.NVarChar, now);

    model.select(qObj, qObj.request, function(err, data)
    {
        if (null !== err)
        {
            logger.error(Message.COMMON.E_102.replace("$1", FUNCTION_NAME+"[scenario.getExecutePlanScenario]"), req, err);
            model.insertLog(req.session.userId, FUNCTION_NUMBER, Message.SCENARIO.E_001);
            res.status(511).send(Message.SCENARIO.E_001);
            return ;
        }

        res.json({data: data});
    });
};

/**
 * 実行予定のシナリオをカレンダー表示用に整形した結果を取得する
 * 
 * @method getExecutePlanScenarioToCalendar
 * @param {Object} req リクエストオブジェクト
 * @param {Object} res レスポンスオブジェクト
 * @return
 */
exports.getExecutePlanScenarioToCalendar = function(req, res)
{
    var col = "T1.scenario_id, T1.scenario_name, T2.scenario_action_document_id, T2.expiration_start_date, T2.expiration_end_date, "+
        "T1.scenario_type AS scenario_type_value, " +
        "CASE T1.scenario_type WHEN 1 THEN N'スケジュール' WHEN 2 THEN N'トリガー' ELSE N'未設定' END AS scenario_type, "+
        "CASE T1.scenario_type WHEN 1 THEN 'schedule' WHEN 2 THEN 'trigger' ELSE N'未設定' END AS scenario_type_key";
    
    var table = TABLE_NAME + " T1 LEFT JOIN M_SCHEDULE_SCENARIO T2 ON T1.scenario_id = T2.scenario_id ";
    var where = "T1.delete_flag = 0 AND T1.approach = 1 AND T1.status = 1 AND ";
    //トリガー型を取得する条件
    where += "( T2.expiration_start_date is null ";
    //スケジュール型：日付指定を取得する条件
    where += "OR (T2.expiration_start_date BETWEEN @start AND @end AND T2.expiration_end_date is null)";
    //スケジュール型：期間指定を取得する条件
    where += "OR (T2.expiration_start_date is not null AND ( T2.expiration_end_date BETWEEN @start AND @end OR T2.expiration_end_date >=  @end) ) )";
    
    var order = "T1.priority, T1.scenario_id";
    var qObj =  model.getQueryObject(col, table, where, '', order);
    var period = 0;
    var start ='';
    var end ='';
    var isCalendar = req.params.hasOwnProperty("year") && req.params.hasOwnProperty("month");
    
    if (req.params.hasOwnProperty("day"))
    {
        start = moment(req.params.day).format("YYYY/MM/DD") + " 00:00:00";
        end = moment(req.params.day).format("YYYY/MM/DD") + " 23:59:59"; 
        period = 1;
    }
    else if (isCalendar)
    {
        var yearMonth = req.params.year + '/' + req.params.month;
        period = moment(yearMonth).daysInMonth();
        start = moment(yearMonth+"/01").format("YYYY/MM/DD") + " 00:00:00";
        end = moment(yearMonth+"/"+period).format("YYYY/MM/DD") + " 23:59:59"; 
    }
    else
    {
        //初期表示の場合
        period = DEFAULT_PERIOD;
        start = moment().format("YYYY/MM/DD") + " 00:00:00";
        end = moment().add(period, 'day').format("YYYY/MM/DD") + " 00:00:00" ;
    }
    var calendar = {};
    for (var i = 0; i < period; i++)
    {
        var prop = moment(start).add(i, 'day').format("YYYY/MM/DD (ddd)");
        calendar[prop] = [];
    }

    qObj.request.input('start', model.db.NVarChar, start);
    qObj.request.input('end', model.db.NVarChar, end);

    model.select(qObj, qObj.request, function(err, data)
    {
        if (null !== err)
        {
            logger.error(Message.COMMON.E_102.replace("$1", FUNCTION_NAME+"[scenario.getExecutePlanScenarioToCalendar]"), req, err);
            model.insertLog(req.session.userId, FUNCTION_NUMBER, Message.SCENARIO.E_001);
            res.status(511).send(Message.SCENARIO.E_001);
            return;
        }

        //スケジュールの期間指定はdocumentDBにデータが入っているため
        //データを取得する必要がある
        var dataNum = data.length;
        var docIdList = [];

        for (var index = 0; index < dataNum; index++)
        {
            var target = data[index];
            //スケジュール型期間指定の場合
            if (null !== target.scenario_action_document_id && 1 === target.scenario_type_value)
            {
                docIdList.push(target.scenario_action_document_id);
            }
        }
        
        //順番に処理をしていく
        model.async.waterfall(
        [
            function(callback)
            {
                if (0 < docIdList.length)
                {
                    //シナリオdocumentを取得する
                    scenariodoc.getItemByIdsForWeb(docIdList, ["*"], function(err, docs)
                    {
                        callback(err, docs);
                    });
                }
                else
                {
                    callback(null, null);
                }
            },
            function(docs, callback)
            {
                var docsObject = (null === docs) ? {} : createDocsObject(docs);

                for (var index = 0; index < dataNum; index++)
                {
                    pushCalendarItem(calendar, data[index], docsObject);
                }
                callback(null);
            }
        ], 
        function(err)
        {
            if (null !== err)
            {
                logger.error(Message.COMMON.E_102.replace("$1", FUNCTION_NAME+"[scenario.getExecutePlanScenarioToCalendar -> last block]"), req, err);
                model.insertLog(req.session.userId, FUNCTION_NUMBER, Message.SCENARIO.E_007);
                res.status(511).send(Message.SCENARIO.E_007);
                return;
            }
            //月カレンダーの場合はさらに整形する
            if (isCalendar)
            {
                var calendarOfMonth = createCalendar(calendar);
                var params = start.split("/");
                res.json({
                    data: calendarOfMonth, 
                    year: params[0],
                    month: params[1],
                });
            }
            else
            {
                res.json({data: calendar});
            }
        });
    });
};
//ドキュメントDBのデータをアクセスしやすいように整形する
function createDocsObject(docs)
{
    var docObject = {};
    var num = docs.length;
    for (var index = 0; index < num; index++)
    {
        var doc = docs[index];
        docObject[doc.id] = doc;
    }
    
    return docObject;
}
//日付毎にシナリオを追加する
function pushCalendarItem(calendar, target, docsObject)
{
    Object.keys(calendar).forEach(function(key)
    {
        var isAdd = false;
        if (2 === target.scenario_type_value)
        {
            //トリガー型
            isAdd = true;
            target.scenario_type_detail = 1;
        }
        else if (null === target.scenario_action_document_id && 1 === target.scenario_type_value)
        {
            //スケジュール型 日付指定の場合
            var day = moment(target.expiration_start_date).format("YYYY-MM-DD");
            isAdd = (moment(key).format("YYYY-MM-DD") === day);
            target.scenario_type_detail = 2;
        }
        else if (null !== target.scenario_action_document_id && 1 === target.scenario_type_value)
        {
            //スケジュール型 期間指定の場合
            var doc = docsObject[target.scenario_action_document_id];
            //期間内であるかの判定
            var keyDay = moment(key).format("YYYY-MM-DD");
            var isPeriod = (moment(keyDay).isAfter(moment(target.expiration_start_date))
                && moment(moment(target.expiration_end_date)).isAfter(keyDay) );

            //以下の条件に合わないものは不正データのため破棄
            if (2 === doc.interval)
            {
                var minDay = model.momoent(key).format("dd");
                isAdd = isPeriod && doc.weekCondition[minDay];
            }
            else if (3 === doc.interval)
            {
                var dayIndex = Number(model.momoent(key).format("D")) - 1;
                isAdd = isPeriod && doc.daysCondition[dayIndex].check;
                
                var targetDay = moment(key).format("YYYY-MM-DD");
                var targetYearMonth = moment(key).format("YYYY-MM") + "-" + moment(key).daysInMonth();
                if (targetDay == targetYearMonth)
                {
                    //最終日のチェックが優先される
                    var lastIndex = doc.daysCondition.length -1;
                    isAdd = isPeriod && doc.daysCondition[lastIndex].check; 
                }
            }
            target.scenario_type_detail = 3;
        }
        if (isAdd)
        {
            calendar[key].push({
                scenario_id: target.scenario_id, 
                scenario_name: target.scenario_name,
                scenario_type_value: target.scenario_type_value,
                scenario_type_detail: target.scenario_type_detail,
                scenario_type_key: target.scenario_type_key
            });
        }
    });
}
//画面表示しやすいようにカレンダーを作成する
function createCalendar(calendar)
{
    var calendarOfMonth = [];
    //angulerでリピートするときに、objectのプロパティの昇順になっちゃうから数値を含むキーを生成
    var weekList = {"0sun": {}, "1mon": {}, "2tue": {}, "3wed": {}, "4thu": {}, "5fri": {}, "6sat": {}};
    var deforeCount = 1;
    Object.keys(calendar).forEach(function(key)
    {
        //該当日が第N週かを求める
        var day = model.momoent(key).format("D");
        var weekdayNum = model.momoent(key).format("e");
        var weekCount = Math.floor((day - weekdayNum + 12) / 7);
        var weekday = model.momoent(key).format("dd");
        var weekDayKey = weekdayNum + weekday;
        
        if (weekCount !== deforeCount)
        {
            calendarOfMonth.push(weekList);
            weekList = {"0sun": {}, "1mon": {}, "2tue": {}, "3wed": {}, "4thu": {}, "5fri": {}, "6sat": {}};
        }
        
        weekList[weekDayKey].scenario = calendar[key];
        weekList[weekDayKey].date = model.momoent(key).format("DD");
        deforeCount = weekCount;
    });
    return calendarOfMonth;
}

/**
 * アプローチ対象のシナリオを無効にする
 * 
 * @method bulkInvalid
 * @param {Object} req 画面からのリクエスト
 * @param {Object} res 画面へのレスポンス
 */
exports.bulkInvalid = function(req, res)
{
    var commonColumns = model.getUpdCommonColumns();
    var sql = 'UPDATE ' + TABLE_NAME + ' SET status = @status, update_by = @update_by,  update_date = @update_date WHERE delete_flag = 0 AND approach = 1'; 
    var request = model.getRequest();
    request.input('update_by', model.db.Int, req.session.userId);
    request.input('update_date', model.db.NVarChar, commonColumns.update_date);
    request.input('status', model.db.Int, 0);

    model.execute(sql, request, function(err, data)
    {
        if (null !== err)
        {
            logger.error(Message.SCENARIO.E_003+FUNCTION_NAME+"[scenario.bulkInvalid]", req, err);
            model.insertLog(req.session.userId, FUNCTION_NUMBER, Message.SCENARIO.E_003, FUNCTION_NAME);
            res.status(511).send(Message.SCENARIO.E_003);
            return;
        }
        model.insertLog(req.session.userId, FUNCTION_NUMBER, Message.SCENARIO.I_003);
        res.status(200).send('scenario status bulk invalid ok');
    });
};

/**
 * アプローチ対象の無効なシナリオを有効にする
 * 
 * @method bulkEnable
 * @param {Object} req リクエストオブジェクト
 * @param {Object} res レスポンスオブジェクト
 * @return 
 */
exports.bulkEnable = function(req, res)
{
    var commonColumns = model.getUpdCommonColumns();
    var sql = 'UPDATE ' + TABLE_NAME + ' SET status = @status, update_by = @update_by,  update_date = @update_date WHERE delete_flag = 0 AND approach = 1'; 
    var request = model.getRequest();
    request.input('update_by', model.db.Int, req.session.userId);
    request.input('update_date', model.db.NVarChar, commonColumns.update_date);
    request.input('status', model.db.Int, 1);

    model.execute(sql, request, function(err, data)
    {
        if (null !== err)
        {
            logger.error(Message.SCENARIO.E_004+FUNCTION_NAME+"[scenario.bulkEnable]", req, err);
            model.insertLog(req.session.userId, FUNCTION_NUMBER, Message.SCENARIO.E_004, FUNCTION_NAME);
            res.status(511).send(Message.SCENARIO.E_004);
            return;
        }
        model.insertLog(req.session.userId, 8, Message.SCENARIO.I_002);
        res.status(200).send('scenario status bulk enable ok');
    });
};

/**
 * priorityとstatusを更新する
 * 
 * @method savePriority
 * @param {Object} req リクエストオブジェクト
 * @param {Object} res レスポンスオブジェクト
 * @return 
 */
exports.savePriority = function(req, res)
{
    var commonColumns = model.getUpdCommonColumns();

    model.async.forEach(req.body.data, function(item, callback)
    {
        //不要項目は削除
        delete item.scenario_name;
        delete item.scenario_type;
        delete item.valid_flag;
        delete item.scenario_type_key;
        
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
        if (null !== err)
        {
            logger.error(Message.SCENARIO.E_005+FUNCTION_NAME+"[scenario.savePriority]", req, err);
            model.insertLog(req.session.userId, FUNCTION_NUMBER, Message.SCENARIO.E_005, FUNCTION_NAME);
            res.status(511).send(Message.SCENARIO.E_005);
            return;
        }
        
        model.insertLog(req.session.userId, FUNCTION_NUMBER, Message.SCENARIO.I_001);
        res.status(200).send('scenario priority update ok');
    });    
};

/**
 * priorityとstatusを更新する
 * 
 * @method getBySegmentId
 * @param {Number} segment_id セグメントID
 * @param {Function} callback コールバック
 * @return 
 */
exports.getBySegmentId = function(segment_id, callback)
{
    var col = "scenario_id, scenario_name, valid_flag";
    var where = "delete_flag = 0 AND segment_id = @segment_id";
    var qObj = model.getQueryObject(col, TABLE_NAME, where, '', '');
    qObj.request.input('segment_id', model.db.Int, segment_id);
    model.select(qObj, qObj.request, callback);
};

/**
 * シナリオを保存する
 * パラメータにPKが存在するか否かで登録するか更新するかを決定する
 * 
 * @method save
 * @param {Object} req リクエストオブジェクト
 * @param {Object} res レスポンスオブジェクト
 * @return 
 */
exports.save = function(req, res)
{
    if (!model.validation("save", req.body))
    {
        console.log(model.appendUserInfoString(Message.COMMON.E_101, req).replace("$1", FUNCTION_NAME+"[scenario.save]"));
        res.status(510).send(Message.COMMON.E_101);
        return;
    }
    
    if (req.body.scenario.hasOwnProperty('scenario_id'))
    {
        update(req, res);
    }
    else
    {
        //非同期
        model.async.parallel(
        {
            //環境情報取得
            env: function(callback)
            {
                var env = require("./environment");
                env.get(callback);
            },
            //件数取得
            count: function(callback)
            {
                var col = "count(1) as count";
                var where = "delete_flag = 0 and scenario_type = @scenario_type";
                var qObj = model.getQueryObject(col, TABLE_NAME, where, '', '');
                qObj.request.input('scenario_type', model.db.SmallInt, req.body.scenario.scenario_type);
                model.select(qObj, qObj.request, callback);
            },
        },
        function complete(err, items)
        {
            if (null !== err)
            {
                logger.error(Message.COMMON.E_001.replace("$1", FUNCTION_NAME+"[scenario.save -> complete]"), req, err);
                model.insertLog(req.session.userId, FUNCTION_NUMBER, Message.COMMON.E_001, "シナリオ");
                res.status(511).send(Message.COMMON.E_001.replace("$1", "シナリオ"));
                return;
            }
            var envInfo = items.env[0];
            var max = (1 == req.body.scenario.scenario_type) 
                ? envInfo.schedule_scenario_max : envInfo.trigger_scenario_max;
                
            //登録最大件数に達していた場合
            if (max <= items.count[0].count)
            {
                res.status(511).send(Message.SCENARIO.E_006);
                return;
            }
            
            create(req, res);
        });
    }
};

//シナリオを登録する
function create(req, res)
{
    //はじめにドキュメント情報を作成する
    scenariodoc.saveItemForWeb(true, req.body.doc, function(err, doc)
    {
        if (null !== err)
        {
            logger.error(Message.COMMON.E_001.replace("$1", FUNCTION_NAME+"[scenario.create scenariodoc -> saveItemForWeb]"), req, err);
            model.insertLog(req.session.userId, FUNCTION_NUMBER, Message.SCENARIO.E_001, FUNCTION_NAME);
            res.status(511).send(Message.SCENARIO.E_001.replace("$1", "シナリオ"));
            return ;
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
                            if (null !== err)
                            {
                                logger.error(Message.COMMON.E_001.replace("$1", FUNCTION_NAME+"[scenario.create -> insertMine]"), req, err);
                            }
                            callback(err, scenarioId);
                        });
                    },
                    function(scenarioId, callback)
                    {
                        insertChildren(transaction, req, scenarioId, doc, function(err, childTabelName)
                        {
                            if (null !== err)
                            {
                                logger.error(Message.COMMON.E_001.replace("$1", FUNCTION_NAME+"[scenario.create -> insertChildren]"), req, err);
                            }
                            callback(err, scenarioId);
                        });
                    },
                    function(scenarioId, callback)
                    {
                        insertTags(transaction, req.session.userId, req.body.tags, function(err, tagList)
                        {
                            if (null !== err)
                            {
                                logger.error(Message.COMMON.E_001.replace("$1", FUNCTION_NAME+"[scenario.create -> insertTags]"), req, err);
                            }
                            callback(err, scenarioId, tagList);
                        });
                    },
                    function(scenarioId, tagList, callback)
                    {
                        insertScnarioTag(transaction, req.session.userId, scenarioId, tagList, function(err, tagList)
                        {
                            if (null !== err)
                            {
                                logger.error(Message.COMMON.E_001.replace("$1", FUNCTION_NAME+"[scenario.create -> insertScnarioTag]"), req, err);
                            }
                            callback(err);
                        });
                    }
                ],
                function(err)
                {
                    model.async.waterfall(
                    [
                        function(callback)
                        {
                            if (null !== err)
                            {
                                logger.error(Message.COMMON.E_001.replace("$1", FUNCTION_NAME+"[scenario.create -> last block]"), req, err);
                                if (null !== doc)
                                {
                                    //コレクション情報を削除する
                                    scenariodoc.removeItemForWeb(doc.id, function(docerr, doc)
                                    {
                                        if (null !== docerr)
                                        {
                                            logger.error(Message.COMMON.E_001.replace("$1", FUNCTION_NAME+"[scenario.create -> scenariodoc.removeItemForWeb]"), req, err);
                                        }
                                        //元のエラー情報をコールバックに渡す
                                        callback(err);
                                    });
                                }
                                else
                                {
                                    callback(err);
                                }
                            }
                            else
                            {
                                callback(null);
                            }
                        },
                    ],
                    function(err)
                    {
                        var message = (null === err) ? Message.COMMON.I_001 : Message.COMMON.E_001;
                        var code = (null === err) ? 200 : 511;
                        model.commitOrRollback(transaction, req, err, function(err)
                        {
                            if (null !== err)
                            {
                                model.insertLog(req.session.userId, FUNCTION_NUMBER, message, req.body.scenario.scenario_name);
                                res.status(511).send(Message.COMMON.E_100);
                                return;
                            }
    
                            model.insertLog(req.session.userId, FUNCTION_NUMBER, message, req.body.scenario.scenario_name);
                            res.status(code).send(message.replace("$1", req.body.scenario.scenario_name));
                        });
                    });
                });
            });
        }
    });
}

//シナリオマスタにデータを登録する
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

    model.insert(TABLE_NAME, insertData, request, function(err, id)
    {
        callback(err, id);
    });
}

//トリガーまたはスケジュールシナリオマスタに登録する
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
 */
function insertTags(transaction, userid, tags, callback)
{
    var tag = require("./tag");
    tag.save(transaction, userid, tags, function(err, tagList)
    {
        callback(err, tagList);
    });
}

//シナリオにタグを設定する
function insertScnarioTag(transaction, userid, scenarioId, tags, callback)
{
    var scenarioTag = require("./scenariottag");
    scenarioTag.save(transaction, userid, scenarioId, tags, function(err, tagList)
    {
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
    var childTabelObject = '';
    var isSchedule = (1 === req.body.scenario.scenario_type);
    if (isSchedule)
    {
        childTabelObject = require("./schedulescenario");
    }
    else
    {
        childTabelObject = require("./triggerscenario");
    }
    
    var commonColumns = model.getUpdCommonColumns();
    
    model.tranBegin(function(err, transaction)
    {
        model.async.waterfall(
        [
            function(callback)
            {
                var scenarioParameter = createUpdateData(req.body.scenario);
                var updateData = model.merge(commonColumns, scenarioParameter, true);
                //送信されてきたデータは信じない
                updateData.valid_flag = 1;

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
                request.input('valid_flag', model.db.SmallInt, updateData.valid_flag);
    
                model.updateById(updateData, request, function(err, data)
                {
                    if (null !== err)
                    {
                        logger.error(Message.COMMON.E_002.replace(
                            "$1", FUNCTION_NAME+"[scenario.update -> updateById]"), req, err);
                    }
                    callback(err);
                });
            },
            function(callback)
            {
                //子テーブル更新
                var updateData = model.merge(commonColumns, req.body.specificInfo, true);
                updateData.scenario_id = req.body.scenario.scenario_id;
                
                var request = model.getRequest(transaction);
                request.input('update_by', model.db.Int, req.session.userId);
                childTabelObject.updateByScenarioId(updateData, request, function(err, data)
                {
                    console.log("updateByScenarioId");
                    console.log(err);
                    if (null !== err)
                    {
                        logger.error(Message.COMMON.E_002.replace(
                            "$1", FUNCTION_NAME+"[scenario.update -> childTabelObject.updateByScenarioId]"), req, err);
                    }
                    callback(err);
                });
            },
            function(callback)
            {
                //新規タグがあれば新しく登録する
                insertTags(transaction, req.session.userId, req.body.tags, function(err, tagList)
                {
                    console.log("insertTags");
                    console.log(err);
                    if (null !== err)
                    {
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
            if (null !== err)
            {
                logger.error(Message.COMMON.E_002.replace(
                    "$1", FUNCTION_NAME+"[scenario.update -> last block]"), req, err);
                model.insertLog(req.session.userId, FUNCTION_NUMBER, Message.COMMON.E_002, req.body.scenario.scenario_name);
                
                //エラーがある場合はロールバック
                model.commitOrRollback(transaction, req, err, function(err)
                {
                    if (null !== err)
                    {
                        res.status(511).send(Message.COMMON.E_100);
                        return;
                    }
                    res.status(511).send(Message.COMMON.E_002.replace("$1", req.body.scenario.scenario_name));
                    return;
                });
            }
            else
            {
                //エラーがない場合はここでコレクション情報を更新する
                model.async.waterfall(
                [
                    function(callback)
                    {
                        childTabelObject.getByScenarioId(req.body.scenario.scenario_id, function(err, data)
                        {
                            if (null !== err)
                            {
                                logger.error(Message.COMMON.E_002.replace(
                                    "$1", FUNCTION_NAME+"[scenario.update -> childTabelObject.getByScenarioId]"), req, err);
                            }
                            callback(err, data);
                        });
                    },
                    function(data, callback)
                    {
                        //更新対象のドキュメントがあれば更新
                        if (req.body.hasOwnProperty('doc'))
                        {
                            var doc = req.body.doc;
                            doc.id = data[0].scenario_action_document_id;
                            if (null === doc.id)
                            {
                                callback(null);
                            }
                            else
                            {
                                scenariodoc.saveItemForWeb(false, doc, function(err, doc)
                                {
                                    if (null !== err)
                                    {
                                        logger.error(Message.COMMON.E_002.replace(
                                            "$1", FUNCTION_NAME+"[scenario.update -> scenariodoc.saveItemForWeb]"), req, err);
                                    }
                                    callback(err);
                                });
                            }
                        }
                        else
                        {
                            callback(null);
                        }
                    },
                ],
                function(err)
                {
                    model.commitOrRollback(transaction, req, err, function(err)
                    {
                        if (null !== err)
                        {
                            res.status(511).send(Message.COMMON.E_100);
                            return;
                        }
                        return res.status(200).send(Message.COMMON.I_002.replace("$1", req.body.scenario.scenario_name));
                    });
                });
            }
        });
    });
}

function createUpdateData(requestData)
{
    //更新時に必要な情報のみ設定する
    return {
        approach: requestData.approach,
        if_layout_id: requestData.if_layout_id,
        output_name: requestData.output_name,
        scenario_id: requestData.scenario_id,
        scenario_name: requestData.scenario_name,
        scenario_type: requestData.scenario_type,
        segment_id: requestData.segment_id,
        status: requestData.status
    };
}

/**
 * PKに合致したレコードのdelete_flagを1にする
 * 
 * @param {Object} req 画面からのリクエスト
 * @param {Object} res 画面へのレスポンス
 */
exports.remove = function(req, res)
{
    if (!model.validation("remove", req.params))
    {
        logger.error(Message.COMMON.E_103.replace("$1", FUNCTION_NAME+"[scenario.remove]"), req);
        res.status(511).send(Message.COMMON.E_101);
        return;
    }

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
    
    var id = req.params.id;
    scenarioTypeObject.getByScenarioId(id, function(err, typeData)
    {
        if (null !== err)
        {
            logger.error(Message.COMMON.E_001.replace("$1", FUNCTION_NAME+"[scenario.remove]"), req);
            res.status(511).send(Message.COMMON.E_003.replace("$1", "シナリオ"));
            return;
        }
        var exsitsData = (0 === typeData.length);

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
                        if (null !== err)
                        {
                            logger.error(Message.COMMON.E_003.replace("$1", FUNCTION_NAME+"[scenario.remove -> removeByIdAndTran]"), req, err);
                        }
                        callback(err);
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
                model.async.waterfall(
                [
                    function(callback)
                    {
                        callback(err);
                    },
                    function(callback)
                    {
                        //シナリオdoc削除
                        if (exsitsData && null !== typeData[0].scenario_action_document_id)
                        {
                            var scenariodoc = require("./scenariodoc");
                            scenariodoc.removeItemForWeb(typeData[0].scenario_action_document_id, function(err)
                            {
                                if (null !== err)
                                {
                                    logger.error(Message.COMMON.E_003.replace(
                                        "$1", FUNCTION_NAME+"[scenario.remove -> scenariodoc.removeItemForWeb]"), req, err);
                                }
                                callback(err);
                            });
                        }
                        else
                        {
                            callback(null);
                        }
                    }
                ], 
                function(err)
                {
                    var message = "";
                    var code = 0;
                    if (null != err)
                    {
                        logger.error(Message.COMMON.E_003.replace(
                            "$1", FUNCTION_NAME+"[scenario.remove -> last block]"), req, err);
                        code = 511;
                    }
                    else
                    {
                        message = Message.COMMON.I_003;
                        code = 200;
                    }
                    
                    model.commitOrRollback(transaction, req, err, function(err)
                    {
                        if (null !== err)
                        {
                            model.insertLog(req.session.userId, FUNCTION_NUMBER, Message.COMMON.E_003, typeData[0].scenario_name);
                            res.status(511).send(Message.COMMON.E_100);
                            return;
                        }

                        model.insertLog(req.session.userId, FUNCTION_NUMBER, message, typeData[0].scenario_name);
                        res.status(code).send(message.replace("$1", typeData[0].scenario_name));
                        return;
                    });
                });
            });
        });
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
                        if (null !== err)
                        {
                            logger.error(Message.COMMON.E_001.replace(
                                "$1", FUNCTION_NAME+"[scenario.initializeData -> typeObject.getByScenarioId]"), req, err);
                            callback(err);
                        }
                        scenariodoc.getItemByIdForWeb(data[0].scenario_action_document_id, function(err, doc)
                        {
                            callback(err, {specific: data[0], doc: doc});
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
                    scenarioTag.getByScenarioId(req.params.id, function(err, data)
                    {
                        callback(err, data);
                    });
                }
                else
                {
                    callback(null, []);
                }
                
            },
            tagList: function(callback)
            {
                var tag = require("./tag");
                tag.getAll(function(err, data){callback(err, data)});
            }
        },
        function complete(err, items2)
        {
            if (null !== err)
            {
                logger.error(Message.COMMON.E_001.replace("$1", FUNCTION_NAME+"[scenario.initializeData -> complete]"), req, err);
                model.insertLog(req.session.userId, FUNCTION_NUMBER, Message.COMMON.E_001, "シナリオ");
                res.status(511).send(Message.COMMON.E_001.replace("$1", "シナリオ"));
                return;
            }
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
 * @method isSameName
 * @param {Object} req 画面からのリクエスト
 * @param {Object} res 画面へのレスポンス
 * @return {Number} result 件数
 */
exports.isSameName = function(req, res)
{
    var scenarioId = req.body.id;
    if (void 0 === scenarioId)
    {
        model.isSameItem('scenario_name', req.body.scenario_name, model.db.NVarChar, function(err, result)
        {
            if (null !== err)
            {
                logger.error(Message.COMMON.E_001.replace("$1", FUNCTION_NAME+"[scenario.isSameName -> isSameItem]"), req, err);
                model.insertLog(req.session.userId, FUNCTION_NUMBER, Message.SCENARIO.E_008);
                res.status(511).send(Message.SCENARIO.E_008);
                return;
            }
            res.json({result: result[0]});
        });
    }
    else
    {
        var conditions = [
            {columns: PK_NAME, type: model.db.Int, value: scenarioId, symbol: '!='},
            {columns: 'scenario_name', type: model.db.NVarChar, value: req.body.scenario_name, symbol: '='},
        ];
        model.isSameItemByMultipleCondition(conditions , function(err, result)
        {
            if (null !== err)
            {
                logger.error(Message.COMMON.E_001.replace("$1", FUNCTION_NAME+"[scenario.isSameName -> isSameItem]"), req, err);
                model.insertLog(req.session.userId, FUNCTION_NUMBER, Message.SCENARIO.E_008);
                res.status(511).send(Message.SCENARIO.E_008);
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

    var action = require('../config/action.json');
    if (action.hasOwnProperty(physicalname))
    {
        res.json({data: action[physicalname]});
    }
    else
    {
        res.status(511).send(Message.COMMON.E_101);
    }
};