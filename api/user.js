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
        if (err > 0)
        {
            console.log(err);
            res.status(510).send('object not found');
        }
        res.json({data: data});
    });
};

exports.craete = function(req, res)
{
    var data = req.body.data;
    console.log(data);
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
    request.input('password', model.db.NVarChar, insertData.password);
    request.input('role_id', model.db.Int, insertData.role_id);
    request.input('name', model.db.NVarChar, insertData.name);
    
    model.insert(tableName, insertData, request, function(err, date)
    {
        if (err)
        {
            console.log(err);
            res.status(510).send('object not found');
        }
        res.status(200).send('insert ok');
    });
    
};

exports.update = function(req, res)
{
};

exports.remove = function(req, res)
{
    var user_id = req.params.id;
    console.log('remvoe target');
    console.log(user_id);
    model.removeById(user_id, function(err, data)
    {
        if (err)
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
        if (err)
        {
            console.log(err);
            res.status(510).send('object not found');
        }
        res.status(200).send('delete ok');
    });
};
