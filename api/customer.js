var Core = require('./core');

/** テーブル名 */
var tableName = 'M_CUSTOMER';

var custmoer = function custmoer()
{
    Core.call(this, tableName);
};

//coreModelを継承する
var util = require('util');
util.inherits(custmoer, Core);

var model = new custmoer();

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
 * 
 */
exports.getDetail = function(req, res)
{
    var id = req.params.id;
    if (void 0 === id)
    {
        //
    }
    model.getById(id, function(err, data)
    {
        if (err.length > 0 || null === data)
        {
            console.log(err);
            //レスポンスコード確認
            res.json({data: data});
        }
        
        //非同期でアプローチ方法と売り上げ推移を取得する
        model.async.parallel(
        [
            function(callback)
            {
                if (null === data.rank_id)
                {
                    callback();
                }
                else
                {
                    var sql = 'SELECT * FROM M_APPROACH T1 INNER JOIN M_RANK T2 ON T1.rank_id = T2.Id INNER JOIN M_MESSAGE T3 on T1.message_id = T3.Id';
                    sql += ' WHERE T1.rank_id = @rank_id';
                    var request = model.getRequest();
                    request.input('rank?id', model.db.Int, data.rank_id);
                    model.execute(sql, request, callback);
                }
                
            },
            function(callback)
            {
                //月刊サマリを取得
                callback();
            }
        ],function(err, items)
        {
            if (err)
            {
                console.log(err);
            }
            res.json({customer: data, approch: items[0], orders: []});
        });
        
    });
};

