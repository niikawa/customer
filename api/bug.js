var Core = require('./core');
var Message = require('../config/message.json');

/** テーブル名 */
var tableName = 'T_DEMAND_BUG';
var pk = 'id';

var bug = function bug()
{
    Core.call(this, tableName, pk);
};

//coreModelを継承する
var util = require('util');
util.inherits(bug, Core);

var model = new bug();

exports.getByConditon = function(req, res)
{
    var request = model.getRequest();
    var col = "T1.id, FORMAT(T1.create_date, 'yyyy-MM-dd hh:mm:ss') as create_date, T1.resolve, T1.type, T1.category, T1.title, T1.contents, T1.vote, T2.name";
    col += ", count(T3.demand_bug_comment_id) as comment_count";
    var tableName = "T_DEMAND_BUG T1 LEFT JOIN M_USER T2 ON T1.create_by = T2.user_id LEFT JOIN T_DEMAND_BUG_COMMENT T3 ON T1.id = T3.demand_bug_id";
    var where = '';
    
    var groupBy = "T1.id, T1.create_date, T1.resolve, T1.type, T1.category, T1.title, T1.contents, T2.name, T1.vote";
    
    if (req.body.hasOwnProperty('resolve') && null !== req.body.resolve) 
    {
        where += "T1.resolve = @resolve AND ";
        request.input('resolve', model.db.Int, req.body.resolve);
    }
    
    if (req.body.hasOwnProperty('type') && null !== req.body.type) 
    {
        where += "T1.type = @type AND ";
        request.input('type', model.db.Int, req.body.type);
    }

    where += " T1.delete_flag = 0";

    var order = "T1.id DESC";
    var qObj = model.getQueryObject(col, tableName, where, groupBy, order);

    model.select(qObj, request, function(err, data)
    {
        if (err.length > 0)
        {
            console.log(err);
            res.status(510).send('get bugs faild sorry!!');
        }

        res.json({data: data, role: req.session.roleId});
    });
};

exports.getComment = function(req, res)
{
    var col = "T1.demand_bug_comment_id, FORMAT(T1.create_date, 'yyyy-MM-dd hh:mm:ss') as create_date, T1.comment, T2.name";
    var tableName = "T_DEMAND_BUG_COMMENT T1 LEFT JOIN M_USER T2 ON T1.create_by = T2.user_id";
    var where = 'T1.demand_bug_id = @demand_bug_id';
    var order = "T1.demand_bug_comment_id";
    var qObj = model.getQueryObject(col, tableName, where, '', order);

    qObj.request.input('demand_bug_id', model.db.Int, req.params.id);

    model.select(qObj, qObj.request, function(err, data)
    {
        if (err.length > 0)
        {
            console.log('get comment  faild');
            console.log(err);
            res.status(510).send('get comment faild');
        }

        res.json({data: data});
    });
};

exports.save = function(req, res)
{
    var commonColumns = model.getInsCommonColumns();
    var insertData = model.merge(req.body, commonColumns);
    insertData.resolve = 0;
    var request = model.getRequest();
    request.input('delete_flag', model.db.SmallInt, insertData.delete_flag);
    request.input('create_by', model.db.Int, req.session.userId);
    request.input('create_date', model.db.NVarChar, insertData.create_date);
    request.input('update_by', model.db.Int, req.session.userId);
    request.input('update_date', model.db.NVarChar, insertData.update_date);

    request.input('resolve', model.db.SmallInt, insertData.resolve);
    request.input('type', model.db.SmallInt, insertData.type);
    request.input('category', model.db.SmallInt, insertData.category);
    request.input('title', model.db.NVarChar, insertData.title);
    request.input('contents', model.db.NVarChar, insertData.contents);

    model.insert(tableName, insertData, request, function(err, date)
    {
        if (err.length > 0)
        {
            console.log(err);
            res.status(510).send('object not found');
        }
        model.insertLog(req.session.userId, 99, Message.COMMON.I_001, insertData.title);
        res.status(200).send('inset ok');
    });
};

exports.resolve = function(req, res)
{
    if (!req.params.hasOwnProperty('id')) res.status(510).send('parameter not found');
    
    var commonColumns = model.getUpdCommonColumns(req.session.userId);
    var updateData = model.merge(req.params, commonColumns);
    updateData.resolve = 1;
    var request = model.getRequest();
    request.input('update_by', model.db.Int, req.session.userId);
    request.input('update_date', model.db.NVarChar, updateData.update_date);
    request.input('resolve', model.db.SmallInt, updateData.resolve);
    request.input('id', model.db.SmallInt, updateData.id);

    model.updateById(updateData, request, function(err, date)
    {
        if (err.length > 0)
        {
            model.insertLog(req.session.userId, 5, Message.COMMON.E_002, updateData.segment_name);
            console.log(err);
            res.status(510).send('object not found');
        }
        else
        {
            model.insertLog(req.session.userId, 5, Message.COMMON.I_002, updateData.segment_name);
            res.status(200).send('update ok');
        }
    });
};

exports.saveComment = function(req, res)
{
    console.log("comment save execute");
    console.log(req.file);
    console.log(req.body.data.data);

    var params = {};
    
    if (req.file)
    {
        //fileアップロードと一緒にデータを渡すためこの形
        params = req.body.data.data;
    }
    else
    {
        params = req.body;
    }

    var commonColumns = model.getInsCommonColumns(req.session.userId);
    var insertData = model.merge(params, commonColumns);
    var request = model.getRequest();
    request.input('delete_flag', model.db.SmallInt, insertData.delete_flag);
    request.input('create_by', model.db.Int, req.session.userId);
    request.input('create_date', model.db.NVarChar, insertData.create_date);
    request.input('update_by', model.db.Int, req.session.userId);
    request.input('update_date', model.db.NVarChar, insertData.update_date);

    request.input('demand_bug_id', model.db.Int, insertData.demand_bug_id);
    request.input('comment', model.db.NVarChar, insertData.comment);

    model.insert("T_DEMAND_BUG_COMMENT", insertData, request, function(err, date)
    {
        if (err.length > 0)
        {
            console.log(err);
            res.status(510).send('comment save faild');
        }
        else
        {
            model.insertLog(req.session.userId, 99, Message.COMMON.I_001, insertData.title);
            res.status(200).send('inset ok');
        }
    });
};

exports.vote = function(req, res)
{
    model.tranBegin(function(err, transaction)
    {
        var request = model.getRequest(transaction);
        var col = "vote";
        var where = 'id = @id';
        var qObj = model.getQueryObject(col, tableName, where, '', '');
        request.input('id', model.db.Int, req.params.id);

        model.select(qObj, request, function(err, data)
        {
            if (err.length > 0)
            {
                console.log(err);
                res.status(510).send('vote faild');
            }

            var update = model.getUpdCommonColumns(req.session.userId);
            update.id = req.params.id;
            update.vote = Number(data[0].vote) + 1;
            var request = model.getRequest(transaction);
            request.input('id', model.db.Int, update.id);
            request.input('update_by', model.db.Int, update.update_by);
            request.input('update_date', model.db.NVarChar, update.update_date);
            request.input('vote', model.db.BigInt, update.vote);

            model.updateById(update, request, function(err, data)
            {
                transaction.commit(function(err)
                {
                    res.status(200).send('vote ok');
                });
            });
        });
    });
};