var async = require('async');
var Core = require('./core');

/** テーブル名 */
var tableName = 'M_ROLE';
/** PK */
var pk = 'role_id';
/** SEQ */
var seqName = 'seq_role';

var role = function role()
{
    Core.call(this, tableName, pk, seqName);
};

//coreModelを継承する
var util = require('util');
util.inherits(role, Core);

var model = new role();

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
