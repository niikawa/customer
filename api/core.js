var async = require('async');
/**
 * core collection class
 * 
 * @author niikawa
 * @namespace collection
 * @class core
 * @constructor
 */
var core = function core(modelName) {

    this.modelName = modelName;
    this.db = require('mssql');
};

/**
 * 単一トランザクションの処理を実行する
 */
// core.prototype.tran = function(execute) {
   
//     var tran = new this.db.Transaction();
//     tran.begin(function(err)
//     {
//         var request = new this.db.Request(tran);
//         request.query(execute);
        
        
//     });

// };

/**
 * コレクションの値をすべて取得する.
 * createdの昇順で取得.
 * 
 * @author niikawa
 * @method getAllSync
 * @param {Function} callback
 */
core.prototype.getAll = function(callback){
};

/**
 * _idに合致した情報を取得する.
 * 
 * @author niikawa
 * @method getById
 * @param {Object} id
 * @param {Function} callback
 */
core.prototype.getById = function(id, callback)
{
    var result = [];
    var errList = [];
    
    var request = new this.db.Request();
    request.input('id', this.db.Int, id);
    var sql = 'select * from ' + this.modelName + 'where id = @id';
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
       errList.push(err);
    });

    request.on('done', function(returnValue) {
        // 常時最後によばれる
        callback(errList, request);
    });
};


//モジュール化
module.exports = core;