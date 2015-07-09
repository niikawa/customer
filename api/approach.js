var async = require('async');
var Core = require('./core');

/** テーブル名 */
var tableName = 'M_APPROACH_SETTING';
var pk = 'approach_setting_id';

var approach = function approachsegment()
{
    Core.call(this, tableName, pk);
};

//coreModelを継承する
var util = require('util');
util.inherits(approach, Core);

var model = new approach();

exports.getOrCreate = function(req, res)
{
    model.getAll(function(err, data)
    {
        if (err.length > 0)
        {
            console.log('approach data get error');
            console.log(err);
            res.status(510).send('data get faild');
        }
        var approachData = data[0];
        
        model.async.waterfall(
        [
            function(callback)
            {
                if (0 === data.length)
                {
                    approachData = {daily_limit_num: 0, weekly_limit_num: 0};
                    //データが存在しない場合は作る
                    var commonColumns = model.getInsCommonColumns();
                    var request = model.getRequest();
                    request.input('delete_flag', model.db.SmallInt, commonColumns.delete_flag);
                    request.input('create_by', model.db.Int, req.session.userId);
                    request.input('create_date', model.db.NVarChar, commonColumns.create_date);
                    request.input('update_by', model.db.Int, req.session.userId);
                    request.input('update_date', model.db.NVarChar, commonColumns.update_date);
                    model.insert(tableName, commonColumns, request, callback);
                }
                else
                {
                    callback(null);
                }
            },
        ], function(err)
        {
            if (null !== err)
            {
                console.log(err);
                res.status(510).send('object not found');
            }
            else
            {
                var ret = {daily_limit_num: 0, weekly_limit_num: 0};
                ret.daily_limit_num = approachData.daily_limit_num;
                ret.weekly_limit_num = approachData.weekly_limit_num;
                
                res.json({data: ret});
            }
        });
    });
};

exports.save = function(req, res)
{
    if (void 0 === req.body) res.status(510).send('params is not found');
    
    //approach_settingは1レコードしか存在しない
    var data = {
        approach_setting_id: 1,
        daily_limit_num: req.body.approach.daily_limit_num, 
        weekly_limit_num: req.body.approach.weekly_limit_num
    };
    
    var commonColumns = model.getUpdCommonColumns();
    var updateData = model.merge(data, commonColumns);

    var request = model.getRequest();
    request.input('update_by', model.db.Int, req.session.userId);
    request.input('update_date', model.db.NVarChar, updateData.update_date);
    
    request.input('approach_setting_id', model.db.Int, updateData.approach_setting_id);
    request.input('daily_limit_num', model.db.Int, updateData.daily_limit_num);
    request.input('weekly_limit_num', model.db.Int, updateData.weekly_limit_num);

    model.updateById(updateData, request, function(err, data)
    {
        if (err.length > 0)
        {
            console.log('approach update faild');
            console.log(err);
        }
        res.status(200).send('update ok');
    });
};

exports.remove = function(req, res)
{
    if (void 0 === req.params.id || void 0 === req.params.segment_document_id) res.status(510).send('parameters not found');
    
    var segmentdoc = require("./segmentdoc");
    segmentdoc.removeItemForWeb(req.params.segment_document_id, function(err, doc)
    {
        if (err) res.status(510).send('document is not found');
        
        model.removeById(req.params.id, function(err, data)
        {
           if (err.length > 0)
           {
                console.log(err);
                res.status(510).send('object not found');
           }
           res.status(200).send('delete ok');
        });
    });
};