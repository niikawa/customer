var Core = require('./core');
var async = require('async');
var mssql = require('mssql');

/** テーブル名 */
var tableName = 'M_CUSTOMER';

var custmoer = function custmoer()
{
    Core.call(this, tableName);
};

//coreModelを継承する
var util = require('util');
util.inherits(custmoer, Core);

exports.getById = function(req, res)
{
    console.log('custmoer getById');

    var request = new mssql.Request();
    request.stream = true;
//    request.input('id', mssql.Int, 2);
//    var sql = 'select * from ' + tableName + ' where Id = 1';
    var sql = 'select * from M_CUSTOMER';
    console.log(sql);
    request.query(sql);
    request.on('recordset', function(columns) {
       // レコードセットを取得するたびに呼び出される
       console.log('recordset');
       console.log(columns);
    });
    request.on('row', function(row) {
       // 行を取得するたびに呼ばれる
       console.log('row');
       console.log(row);
    });

    request.on('error', function(err) {
       // エラーが発生するたびによばれる
       console.log(err);
    });

    request.on('done', function(returnValue) {
        // 常時最後によばれる
        console.log('done');
        console.log(returnValue);
        res.json({data: returnValue});
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

