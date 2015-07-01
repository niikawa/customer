var async = require('async');
var Core = require('./core');

/** テーブル名 */
var tableName = 'M_SEGMENT';
var pk = 'segment_id';

var segment = function segment()
{
    Core.call(this, tableName, pk);
};

//coreModelを継承する
var util = require('util');
util.inherits(segment, Core);

var model = new segment();

exports.getById = function(req, res)
{
    if (void 0 === req.params.id) return res.status(510).send('Invalid parameter');
    model.getById(req.params.id, function(err, data)
    {
        if (err.length > 0)
        {
            return res.status(510).send('data not found');
        }
        var segmentdoc = require("./segmentdoc");
        segmentdoc.getItemByIdForWeb(data[0].segment_document_id, function(err, doc)
        {
            if (err) res.status(510).send('document is not found');
            res.json({
                segment_name: data[0].segment_name, 
                segment_document_id: data[0].segment_document_id,
                qIds: doc.qIds
            });
        });
    });
};

exports.getAll = function(req, res)
{
    model.getAll(function(err, data)
    {
        if (err)
        {
            console.log(err);
            //レスポンスコード確認
            res.json({data: data});
        }
        else
        {
            res.json({data: data});
        }
    });
};

exports.execute = function(req, res)
{
    var request = model.getRequest();
    var tableList = [];
    Object.keys(req.body.tables).forEach(function(key)
    {
        tableList.push(key);
    });
    
    var sql = "SELECT count(1) AS count FROM " + tableList.join(',') + ' WHERE ' + req.body.condition;
    model.execute(sql, request, function(err, data)
    {
        if (err.length > 0)
        {
            console.log(err);
            res.status(510).send('data not found');
        }
        res.json({result: data[0].count});
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
