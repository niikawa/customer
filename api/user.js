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
    var where = '';
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

/**
 * 
 */
exports.orders = function(req, res)
{
    var id = req.params.id;
    if (void 0 === id)
    {
        //
    }

    //非同期でアプローチ方法と売り上げ推移を取得する
    async.series(
    [
        function(callback)
        {
            var col = "customer_id, FORMAT(date, 'yyyy/MM') as date, sum(price) as price";
            var table = 'T_READ_ORDERS';
            var groupby = "customer_id, FORMAT(date, 'yyyy/MM') having customer_id = @customer_id";
            var orderby = 'date';
        
            var qObj = model.getQueryObject(col, table, '', groupby, orderby);
            qObj.request.input('customer_id', model.db.Int, id);
            
            model.select(qObj, qObj.request, function(err, data){console.log('custmoer orders'); callback(null, data)});
        },
        function(callback)
        {
            var col = "T2.rank_id , FORMAT(T1.date, 'yyyy/MM') as date, avg(T1.price) as price";
            var table = 'T_READ_ORDERS T1 inner join M_CUSTOMER T2 on T1.customer_id = T2.customer_id';
            var groupby = "T2.rank_id, FORMAT(T1.date, 'yyyy/MM') having T2.rank_id = (select rank_id from M_CUSTOMER where customer_id = @customer_id)";
            var orderby = 'date';
        
            var qObj = model.getQueryObject(col, table, '', groupby, orderby);
            qObj.request.input('customer_id', model.db.Int, id);
            
            model.select(qObj, qObj.request,  function(err, data){console.log('orders avg'); callback(null, data)});
        }

    ],function final(err, items)
    {
        if (err)
        {
            console.log(err);
        }
        console.log('get getDetail items[0]');
        console.log(items[0]);
        console.log('get getDetail items[1]');
        console.log(items[1]);
        res.json({orders: items[0], orders_avg: items[1]});
    });
    
};
