var crypto = require('crypto');
var async = require('async');
var Core = require('./core');
var scenariodoc = require("./scenariodoc");

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

/**
 * delete_flagのたっていないシナリオをすべて取得する
 * 並び順はPKの昇順
 * 
 * @param {Object} req 画面からのリクエスト
 * @param {Object} res 画面へのレスポンス
 */
exports.getAll = function(req, res)
{
    var col = "scenario_id, FORMAT(update_date, 'yyyy/MM/dd') AS update_date, scenario_name, " +
                "CASE approach WHEN 1 THEN N'対象' WHEN 0 THEN N'対象外' ELSE N'未設定' END AS approach, " +
                "CASE status WHEN 1 THEN N'有効' WHEN 0 THEN N'無効' ELSE N'未設定' END AS status";
                
    var where = "delete_flag = 0 AND scenario_type = @scenario_type";
    var order = "scenario_id";
    var qObj = model.getQueryObject(col, tableName, where, '', order);
    
    var scenarioType = ('trigger' == req.params.type) ? 2 : 1;
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

exports.save = function(req, res)
{
    console.log('scenario save execute');
    console.log(req.body);
    if (void 0 === req.body.scenario) res.status(510).send('param is not found');
    if (void 0 === req.body.doc) res.status(510).send('param is not found');
    
    if (req.body.scenario.hasOwnProperty('scenario_id'))
    {
        update(req, res);
    }
    else
    {
        create(req, res);
    }
};

function create(req, res)
{
    scenariodoc.saveItemForWeb(true, req.body.doc, function(err, doc)
    {
        if (err)
        {
            console.log('scenario create doc faild');
            console.log(err);
            console.log(req.body);
            res.status(510).send('scenario crate faild');
        }
        
        model.async.waterfall(
        [
            function(callback)
            {
                var commonColumns = model.getInsCommonColumns();
                var insertData = model.merge(req.body.scenario, commonColumns);
                var request = model.getRequest();
                request.input('delete_flag', model.db.SmallInt, insertData.delete_flag);
                request.input('create_by', model.db.Int, req.session.userId);
                request.input('create_date', model.db.NVarChar, insertData.create_date);
                request.input('update_by', model.db.Int, req.session.userId);
                request.input('update_date', model.db.NVarChar, insertData.update_date);
                
                request.input('segment_id', model.db.Int, insertData.segment_id);
                request.input('if_layout_id', model.db.Int, insertData.if_layout_id);
                request.input('scenario_name', model.db.NVarChar, insertData.scenario_name);
                request.input('output_name', model.db.NVarChar, insertData.output_name);
                request.input('scenario_type', model.db.SmallInt, insertData.scenario_type);
                request.input('status', model.db.SmallInt, insertData.status);
                request.input('approach', model.db.SmallInt, insertData.approach);

                model.insert(tableName, insertData, request, function(err, date)
                {
                    if (err.length > 0)
                    {
                        console.log(err);
                        res.status(510).send('object not found');
                    }
                            
                    var col = "MAX(scenario_id) as scenario_id";
                    var where = "delete_flag = 0 ";
                    var qObj = model.getQueryObject(col, tableName, where, '', '');
                    model.select(qObj, qObj.request, function(err, data)
                    {
                        if (err.length > 0)
                        {
                            console.log(err);
                            res.status(510).send('object not found');
                        }
                        
                        console.log(data);
                        
                        callback(null, data[0]);
                    });
                });
            },
            function(data, callback)
            {
                var commonColumns = model.getInsCommonColumns();
                var insertData = model.merge(req.body.specificInfo, commonColumns);
                insertData.scenario_id = data.scenario_id;
                insertData.scenario_action_document_id = doc.id;
                
                var request = model.getRequest();
                request.input('delete_flag', model.db.SmallInt, insertData.delete_flag);
                request.input('create_by', model.db.Int, req.session.userId);
                request.input('create_date', model.db.NVarChar, insertData.create_date);
                request.input('update_by', model.db.Int, req.session.userId);
                request.input('update_date', model.db.NVarChar, insertData.update_date);
                
                request.input('scenario_id', model.db.Int, insertData.scenario_id);
                request.input('after_event_occurs_num', model.db.Int, insertData.after_event_occurs_num);
                request.input('inoperative_num', model.db.Int, insertData.inoperative_num);
                request.input('scenario_action_document_id', model.db.NVarChar, insertData.scenario_action_document_id);
                
                console.log(insertData);
                
                model.insert('M_TRIGGER_SCENARIO', insertData, request, function(err, date)
                {
                    if (err.length > 0)
                    {
                        console.log(err);
                        res.status(510).send('object not found');
                    }
                    
                    callback(null, data);
                });
            }
        ],
        function(err)
        {
            if (null != err)
            {
                console.log(err);
                res.status(510).send('object not found');
            }
            res.status(200).send('insert ok');
        });
        
    });
}

function update(req, res)
{
    console.log('scenario update start');
    
    var TriigerScenario = require("./triggerscenario");

    var commonColumns = model.getUpdCommonColumns();
    model.async.waterfall(
    [
        function(callback)
        {
            TriigerScenario.getByScenarioId(req.body.scenario.scenario_id, function(err, data)
            {
                if (err.length > 0)
                {
                    console.log('trigger scenario is not found');
                    console.log(err);
                    res.status(510).send('scenario update faild');
                    
                }
                callback(null, data);
            });
        },
        function(trigger, callback)
        {
            console.log(trigger);
            var doc = req.body.doc;
            doc.id = trigger[0].scenario_action_document_id;
            scenariodoc.saveItemForWeb(false, doc, function(err, doc)
            {
                callback(err);
            });
        },
        function(callback)
        {
            //scenarioマスタを更新
            delete req.body.scenario.delete_flag;
            delete req.body.scenario.create_by;
            delete req.body.scenario.create_date;
            
            var updateData = model.merge(req.body.scenario, commonColumns);
            var request = model.getRequest();
            request.input('update_by', model.db.Int, req.session.userId);
            request.input('update_date', model.db.NVarChar, updateData.update_date);
            
            request.input('segment_id', model.db.Int, updateData.segment_id);
            request.input('if_layout_id', model.db.Int, updateData.if_layout_id);
            request.input('scenario_name', model.db.NVarChar, updateData.scenario_name);
            request.input('output_name', model.db.NVarChar, updateData.output_name);
            request.input('scenario_type', model.db.SmallInt, updateData.scenario_type);
            request.input('status', model.db.SmallInt, updateData.status);
            request.input('approach', model.db.SmallInt, updateData.approach);

            model.updateById(updateData, request, callback);
        },
        function(callback)
        {
            //トリガーscenarioマスタを更新
            var updateData = model.merge(req.body.specificInfo, commonColumns);
            updateData.scenario_id = req.body.scenario.scenario_id;

            var request = model.getRequest();
            request.input('update_by', model.db.Int, req.session.userId);
            request.input('update_date', model.db.NVarChar, updateData.update_date);
            
            request.input('scenario_id', model.db.Int, updateData.scenario_id);
            request.input('after_event_occurs_num', model.db.Int, updateData.after_event_occurs_num);
            request.input('inoperative_num', model.db.Int, updateData.inoperative_num);

            TriigerScenario.updateById(updateData, request, callback);
        }
        
    ], function(err)
    {
        console.log(err);
        if (null != err)
        {
            console.log(err);
            res.status(510).send('object not found');
        }
        res.status(200).send('update ok');
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
    var id = req.params.id;
    
    var TriigerScenario = require("./triggerscenario");
    TriigerScenario.getByScenarioId(id, function(err, triggerData)
    {
        console.log(triggerData);
        if (err.length > 0)
        {
            console.log('scenario remove faild');
            console.log(id);
            console.log(err);
        }
        
        var exsitsTrriger = true;
        if (0 === triggerData.length)
        {
            console.log('scenario trigger data not found');
            console.log(id);
            exsitsTrriger = false;
        }
        
        model.async.parallel(
        [
            //トリガー情報削除
            function(callback)
            {
                if (exsitsTrriger)
                {
                    TriigerScenario.remove(
                        triggerData[0].trigger_scenario_id , callback);
                }
                else
                {
                    callback(null);
                }
            },
            
            //シナリオ情報削除
            function(callback)
            {
                model.removeById(id, callback);
            },
            
            //シナリオdox削除
            function(callback)
            {
                if (exsitsTrriger)
                {
                    var scenariodoc = require("./scenariodoc");
                    scenariodoc.removeItemForWeb(
                        triggerData[0].scenario_action_document_id, callback);
                }
                else
                {
                    callback(null);
                }
            }
            
        ], function complete(err, items)
            {
                console.log('complete');
                
                if (null === err)
                {
                    console.log(err);
                    res.status(510).send('scenario remove faild');
                }
                res.status(200).send('remove ok');
            }
        );
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
        //parallel実行した場合、5米のfunctionが実行完了前に
        //completeしてしまう。これはたぶんライブラリのバグだと思うけど、
        //どうにもならないのでここでさらに実行させる
        model.async.parallel(
        {
            specificData: function(callback)
            {
                if (void 0 !== req.params.id)
                {
                    if ('trigger' === req.params.type)
                    {
                        var TriigerScenario = require("./triggerscenario");
                        TriigerScenario.getByScenarioId(req.params.id, function(err, data)
                        {
                            scenariodoc.getItemByIdForWeb(data[0].scenario_action_document_id, function(err, doc)
                            {
                                callback(null, {specific: data[0], doc: doc});
                            });
                        });
                    }
                    else if ('schedule' === req.params.type)
                    {
                        callback(null, []);
                    }
                }
                else
                {
                    callback(null, []);
                }
                
            }
        },
        function complete(err, items2)
        {
            res.json(
                {
                    segment: items.segment,
                    ifLayout: items.ifLayout,
                    specific: items.action, 
                    target: items.target[0], 
                    specificInfo: items2.specificData
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
    var scenarioId = req.body.scenario_id;
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

