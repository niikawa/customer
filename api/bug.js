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
    var col = "T1.id, FORMAT(T1.create_date, 'yyyy-MM-dd hh:mm:ss') as create_date, T1.resolve, T1.type, T1.category, T1.title, T1.contents, ";
    col += "T2.name";
    var tableName = "T_DEMAND_BUG T1 INNER JOIN M_USER T2 ON T1.create_by = T2.user_id";
    var where = '';
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
    var qObj = model.getQueryObject(col, tableName, where, '', order);

    model.select(qObj, request, function(err, data)
    {
        if (err.length > 0)
        {
            console.log('get execute plan scenario faild');
            console.log(err);
            res.status(510).send('scenario crate faild');
        }

        res.json({data: data, role: req.session.roleId});
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
        model.insertLog(req.session.userId, 5, Message.COMMON.I_002, updateData.segment_name);
        res.status(200).send('update ok');
    });
};