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


var config = {
  user: 'vxc-databese-master',
//  user: 'databese_master',
  password: 'VirtUaleX001',
  server: 'oufq8kwys5.database.windows.net',
//  server: 'customerreport.c6ykdlikt0mb.ap-northeast-1.rds.amazonaws.com',
  database: 'CustomerReport',
//  databese: 'customerreport',
  stream: true, // You can enable streaming globally

  options: {
    encrypt: true // Use this if you're on Windows Azure
//    encrypt: false 
  }
};

exports.getById = function(req, res)
{
    
    console.log('custmoer getById');
    mssql.connect(config, function(err) {
        // ... error checks
        
        if (err) console.log(err);
        
        var request = new mssql.Request();
        request.stream = true; // You can set streaming differently for each request
        request.query('select * from M_CUSTOMER'); // or request.execute(procedure);
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
           console.log('err');
           console.log(err);
        });
    
        request.on('done', function(returnValue) {
            // 常時最後によばれる
            console.log('done');
            console.log(returnValue);
            res.json({data: returnValue});
        });
    
    });    
    



//    var request = new mssql.Request();
    
    
//    request.stream = true;
//    request.input('id', mssql.Int, 2);
//    var sql = 'select * from ' + tableName + ' where Id = 1';
//    var sql = 'select * from M_CUSTOMER';
//    console.log(sql);
//    request.query(sql);
};


/**
 * 顧客の一覧を取得する
 * 
 * @param {Object} req 画面からのリクエスト
 * @param {Object} res 画面へのレスポンス
 */
exports.getAll = function(req, res) {
    
};

