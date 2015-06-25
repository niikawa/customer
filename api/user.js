var crypto = require('crypto');
var async = require('async');
var Core = require('./core');

/** テーブル名 */
var tableName = 'M_USER';
var pk = 'user_id';

var user = function user()
{
    Core.call(this, tableName, pk);
};

//coreModelを継承する
var util = require('util');
util.inherits(user, Core);

var model = new user();

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
 * 顧客の一覧を取得する
 * 
 * @param {Object} req 画面からのリクエスト
 * @param {Object} res 画面へのレスポンス
 */
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

/**
 * 全ユーザーを取得する
 */
exports.getList = function(req, res)
{
    var table = 'M_USER T1 INNER JOIN M_ROLE T2 ON T1.role_id = T2.role_id ';
    var col = 'T1.user_id, T1.mailaddress, T1.name, T2.role_name';
    var where = 'T1.delete_flag = 0';
    var order = 'T1.user_id';
    var qObj = model.getQueryObject(col, table, where, '', order);

    model.select(qObj, qObj.request,  function(err, data)
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
    var commonColumns = model.getInsCommonColumns();
    var insertData = model.merge(req.body.data, commonColumns);
    delete insertData.password_confirm;
    
    var request = model.getRequest();
    request.input('delete_flag', model.db.SmallInt, insertData.delete_flag);
    request.input('create_by', model.db.Int, insertData.create_by);
    request.input('create_date', model.db.NVarChar, insertData.create_date);
    request.input('update_by', model.db.Int, insertData.update_by);
    request.input('update_date', model.db.NVarChar, insertData.update_date);
    request.input('mailaddress', model.db.VarChar, insertData.mailaddress);
    request.input('password', model.db.NVarChar, crypto.createHash('md5').update(insertData.password).digest("hex"));
    request.input('role_id', model.db.Int, insertData.role_id);
    request.input('name', model.db.NVarChar, insertData.name);
    
    model.insert(tableName, insertData, request, function(err, date)
    {
        if (err.length > 0)
        {
            console.log(err);
            res.status(510).send('object not found');
        }
        res.status(200).send('insert ok');
    });
};

exports.update = function(req, res)
{
    var commonColumns = model.getUpdCommonColumns();
    var updateData = model.merge(req.body.data, commonColumns);
    
    if (void 0 !== updateData.password_confirm) delete updateData.password_confirm;
    
    var request = model.getRequest();
    if (void 0 !== updateData.password)
    {
        delete updateData.password;
    }
    else
    {
        request.input('password', model.db.NVarChar, crypto.createHash('md5').update(updateData.password).digest("hex"));
    }
    
    request.input('delete_flag', model.db.SmallInt, 0);
    request.input('update_by', model.db.Int, updateData.update_by);
    request.input('update_date', model.db.NVarChar, updateData.update_date);
    request.input('mailaddress', model.db.VarChar, updateData.mailaddress);
    request.input('role_id', model.db.Int, updateData.role_id);
    request.input('name', model.db.NVarChar, updateData.name);

    model.updateById(updateData, request, function(err, date)
    {
        if (err.length > 0)
        {
            console.log(err);
            res.status(510).send('object not found');
        }
        res.status(200).send('update ok');
    });
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

exports.isSameMailAddress = function(req, res)
{
    var userId = req.body.user_id;
    if (void 0 === userId)
    {
        model.isSameItem('mailaddress', req.body.mailaddress, model.db.VarChar, function(err, result)
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
            {columns: 'user_id', type: model.db.Int, value: userId, symbol: '!='},
            {columns: 'mailaddress', type: model.db.VarChar, value: req.body.mailaddress, symbol: '='},
        ];
        console.log(conditions);
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
