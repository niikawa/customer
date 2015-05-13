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
    var result = [];
    console.log('custmoer getById');
    var request = new mssql.Request();
    
    request.stream = true;
    request.input('id', mssql.Int, req.params.id);
    console.log(req.query.id);
    console.log(req.params.id);
    var sql = 'select * from ' + tableName + ' where Id = @id';
//    var sql = 'select * from M_CUSTOMER';
    request.query(sql);
    request.on('recordset', function(columns) {
       // レコードセットを取得するたびに呼び出される
       console.log(columns);
    });
    request.on('row', function(row) {
       // 行を取得するたびに呼ばれる
       result.push(row);
    });

    request.on('error', function(err) {
       // エラーが発生するたびによばれる
       console.log(err);
    });

    request.on('done', function(returnValue) {
        // 常時最後によばれる
        console.log('done');
        res.json({data: result});
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

