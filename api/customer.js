var Core = require('./core');
var async = require('async');
var mssql = require('mssql');

/** テーブル名 */
var tableName = 'M_CUSTOMER';

var custmoer = function custmoer()
{
    Core.call(this, tableName);
    var request = new mssql.Request();
};

//coreModelを継承する
var util = require('util');
util.inherits(custmoer, Core);


exports.getById = function(req, res)
{
    custmoer.getById(req.body.id, function(value)
    {
        res.json({data: value});
    });
};


/**
 * 顧客の一覧を取得する
 * 
 * @param {Object} req 画面からのリクエスト
 * @param {Object} res 画面へのレスポンス
 */
exports.getAll = function(req, res) {
    
};

