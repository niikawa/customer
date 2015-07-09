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
        console.log(data);
        console.log(err);
        if (null !== err)
        {
            if (err.length > 0)
            {
                console.log('approach data get error');
                console.log(err);
                res.status(510).send('data get faild');
            }
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
            console.log(err);
            if (err.length > 0)
            {
                console.log(err);
                res.status(510).send('object not found');
            }
            
            var ret = {daily_limit_num: 0, weekly_limit_num: 0};
            ret.daily_limit_num = approachData.daily_limit_num;
            ret.weekly_limit_num = approachData.weekly_limit_num;
            
            res.json({data: ret});
        });
    });
};

exports.save = function(req, res)
{
    var isCreate = 
        (void 0 === req.body.data.segment_id || '' === req.body.data.segment_id);
    if (isCreate)
    {
        create(req, res);
    }
    else
    {
        update(req, res);
    }
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

exports.download = function(req, res)
{
   res.status(200).send('download ok');
};

function create(req, res)
{
    var commonColumns = model.getInsCommonColumns();
    var insertData = model.merge(req.body.data, commonColumns);
    insertData.status = 1;
    var request = model.getRequest();
    request.input('delete_flag', model.db.SmallInt, insertData.delete_flag);
    request.input('create_by', model.db.Int, req.session.userId);
    request.input('create_date', model.db.NVarChar, insertData.create_date);
    request.input('update_by', model.db.Int, req.session.userId);
    request.input('update_date', model.db.NVarChar, insertData.update_date);
    request.input('segment_name', model.db.NVarChar, insertData.segment_name);
    request.input('status', model.db.SmallInt, insertData.status);
    request.input('segment_document_id', model.db.NVarChar, insertData.segment_document_id);

    model.insert(tableName, insertData, request, function(err, date)
    {
        if (err.length > 0)
        {
            console.log(err);
            res.status(510).send('object not found');
        }
        res.status(200).send('insert ok');
    });
}

function update(req, res)
{
    var commonColumns = model.getUpdCommonColumns();
    var updateData = model.merge(req.body.data, commonColumns);
    var request = model.getRequest();
    request.input('update_by', model.db.Int, req.session.userId);
    request.input('update_date', model.db.NVarChar, updateData.update_date);
    request.input('segment_name', model.db.NVarChar, updateData.segment_name);
    request.input('segment_document_id', model.db.NVarChar, updateData.segment_document_id);

    model.updateById(updateData, request, function(err, date)
    {
        if (err.length > 0)
        {
            console.log(err);
            res.status(510).send('object not found');
        }
        res.status(200).send('update ok');
    });
}
