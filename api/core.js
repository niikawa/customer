/**
 * core collection class
 * 
 * @author niikawa
 * @namespace collection
 * @class core
 * @constructor
 */
var core = function core(modelName)
{
    this.modelName = modelName;
};

core.prototype.async = require('async');

core.prototype.db = require('mssql');

core.prototype.getRequest = function()
{
    return new this.db.Request();
};

core.prototype.getQueryObject = function(col, table, where, groupby, orderby)
{
    return {
        col: col, 
        table: table, 
        where: where,
        groupby: groupby,
        orderby: orderby,
        request: this.getRequest()};
};

/**
 * 値をすべて取得する.
 * 
 * @author niikawa
 * @method getAllSync
 * @param {Function} callback
 */
core.prototype.getAll = function(callback){

    var result = [];
    var errList = [];
    var request = new this.db.Request();

    request.stream = true;
    var sql = 'select * from ' + this.modelName + ' order by Id';
    request.query(sql);
    request.on('recordset', function(columns)
    {
       console.log(columns);
    });
    
    request.on('row', function(row)
    {
       result.push(row);
    });

    request.on('error', function(err)
    {
        errList.push(err);
    });

    request.on('done', function(returnValue)
    {
        callback(errList, result);
    });
    
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
    var request = new this.db.Request();
    request.input('id', this.db.Int, id);
    var sql = 'select * from ' + this.modelName + ' where id = @id';
    this.execute(sql, request, callback);
};

core.prototype.select = function(queryObject, request, callback)
{
    var sql = 'SELECT ' + queryObject.col + ' FROM ' + queryObject.table;
    
    if (void 0 !== queryObject.where && '' !== queryObject.where)
    {
        sql +=  ' WHERE ' + queryObject.where;
    }

    if (void 0 !== queryObject.groupby && '' !== queryObject.groupby)
    {
        sql +=  ' GROUP BY ' + queryObject.groupby;
    }
    
    if (void 0 !== queryObject.orderby && '' !== queryObject.orderby)
    {
        sql +=  ' ORDER BY ' + queryObject.orderby;
    }

    this.execute(sql, request, callback);
};

core.prototype.execute = function(sql, request, callback)
{
    var result = [];
    var errList = [];
    
    //auery実行
    request.query(sql);
    
    // レコードセットを取得するたびに呼び出される
    request.on('recordset', function(columns)
    {
       console.log(columns);
    });
    
    // 行を取得するたびに呼ばれる
    request.on('row', function(row)
    {
       result.push(row);
    });

   // エラーが発生するたびによばれる
    request.on('error', function(err)
    {
       errList.push(err);
    });

    // 常時最後によばれる
    request.on('done', function(returnValue)
    {
        console.log('core execute');
        console.log(sql);
        console.log(result);
        
        callback(errList, result);
        this.db.close();
    });
};

//モジュール化
module.exports = core;