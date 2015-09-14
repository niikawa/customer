var crypto = require('crypto');
var Core = require('./core');
var Message = require('../config/message.json');

/** テーブル名 */
var tableName = 'M_USER';
/** PK */
var pk = 'user_id';
/** SEQ */
var seqName = 'seq_user';
/** 機能名 */
var functionName = 'ユーザー管理';

var user = function user()
{
    Core.call(this, tableName, pk, seqName);
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
        if (null !== err)
        {
            console.log(err);
            model.insertLog(req.session.userId, 3, Message.COMMON.E_001);
            res.status(510).send('data not found');
            res.json({data: []});
        }
        else
        {
            model.insertLog(req.session.userId, 3, Message.COMMON.I_001, data[0].name);
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
        if (null !== err)
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
        if (null !== err)
        {
            model.insertLog(req.session.userId, 3, Message.COMMON.E_004, functionName);
            console.log(err);
            res.status(510).send('object not found');
        }
        model.insertLog(req.session.userId, 3, Message.COMMON.I_004, functionName);
        res.json({data: data});
    });
};

exports.craete = function(req, res)
{
    var commonColumns = model.getInsCommonColumns(req.session.userId);
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
        if (null !== err)
        {
            model.insertLog(req.session.userId, 3, Message.COMMON.E_001, insertData.name);
            console.log(err);
            res.status(510).send('object not found');
        }
        model.insertLog(req.session.userId, 3, Message.COMMON.I_001, insertData.name);
        res.status(200).send('insert ok');
    });
};

exports.update = function(req, res)
{
    model.getById(req.body.data.user_id, function(err, data)
    {
        var commonColumns = model.getUpdCommonColumns(req.session.userId);
        var updateData = model.merge(req.body.data, commonColumns);
        
        var request = model.getRequest();
        if (updateData.hasOwnProperty("password"))
        {
            if (updateData.hasOwnProperty('password_confirm'))
            {
                if (data[0].password === updateData.password)
                {
                    delete updateData.password;
                }
                else
                {
                    request.input('password', model.db.NVarChar, crypto.createHash('md5').update(updateData.password).digest("hex"));
                }
                delete updateData.password_confirm;
            }
            else
            {
                //不正更新防止のため
                delete updateData.password;
            }
        }
        request.input('update_by', model.db.Int, updateData.update_by);
        request.input('update_date', model.db.NVarChar, updateData.update_date);
        request.input('mailaddress', model.db.VarChar, updateData.mailaddress);
        request.input('role_id', model.db.Int, updateData.role_id);
        request.input('name', model.db.NVarChar, updateData.name);
    
        model.updateById(updateData, request, function(err)
        {
            if (null !== err)
            {
                model.insertLog(req.session.userId, 3, Message.COMMON.E_002, updateData.name);
                console.log(err);
                return res.status(510).send('object not found');
            }
            model.insertLog(req.session.userId, 3, Message.COMMON.I_002, updateData.name);
            res.status(200).send('update ok');
        });
    });
};

exports.remove = function(req, res)
{
    var user_id = req.params.id;
    model.removeById(user_id, function(err, data)
    {
        if (null !== err)
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
        if (null !== err)
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
            if (null !== err)
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
            if (null !== err)
            {
                console.log(err);
                res.status(510).send('query execute faild');
            }
            res.json({result: result[0]});
        });
    }
};
