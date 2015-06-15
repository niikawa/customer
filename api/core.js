/**
 * core collection class
 * 
 * @author niikawa
 * @namespace collection
 * @class core
 * @constructor
 */
var core = function core(modelName, pk)
{
    this.modelName = modelName;
    this.pk = pk;
};

core.prototype.async = require('async');

core.prototype.db = require('mssql');

core.prototype.getRequest = function()
{
    var ms = require('mssql');
    return new ms.Request();
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
core.prototype.getAll = function(condtion ,callback){

    var request = new this.db.Request();
    var columns;
    var option = ' asc';
    if (void 0 === condtion || '' === condtion || 'function' === typeof(condtion))
    {
        columns = this.pk;
        callback = condtion;
    }
    else
    {
        columns = condtion.columns;
        if (void 0 !== condtion.option)
        {
            option = condtion.option;
        }
    }
    
    var sql = '';
    if (void 0 === columns)
    {
        sql = 'select * from ' + this.modelName;
    }
    else
    {
        sql = 'select * from ' + this.modelName + ' order by ' + columns + option;
    }
    this.execute(sql, request, callback);
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
    console.log(sql);
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
        // console.log(sql);
        // console.log(result);
        callback(errList, result);
    });
};

//モジュール化
module.exports = core;