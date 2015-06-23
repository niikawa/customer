var moment = require('moment');
var logInfo = require('../config/controlLog');

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

core.prototype.merge = function(source, add)
{
    if (!add) add = {};
    for (var attrname in add)
    {
        if (add.hasOwnProperty(attrname))
        {
            source[attrname] = add[attrname];
        }
    }
    return source;
};

core.prototype.getRequest = function()
{
    var ms = require('mssql');
    return new ms.Request();
};

core.prototype.getInsCommonColumns = function()
{
    var date =  moment().format("YYYY/MM/DD HH:mm:ss");
    return {
        delete_flag: 0, create_by: 1, create_date: date, update_by: 1, update_date: date
    };
};

core.prototype.getUpdCommonColumns = function()
{
    var date =  moment().format("YYYY/MM/DD HH:mm:ss");
    return {
        create_date: date, update_by: 1, update_date: date
    };
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
    var request = this.getRequest();
    request.input(this.pk, this.db.Int, id);
    var sql = 'select * from ' + this.modelName + ' WHERE ' + this.pk + ' = @' + this.pk;
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

core.prototype.insert = function(table, data, request, callback)
{
    var dataList = [];
    var columns = Object.keys(data);
    var len = columns.length;
    for (var i = 0; i < len; i ++)
    {
        var item = '@' + columns[i];
        dataList.push(item);
    }

    var sql = 'INSERT INTO ' + this.modelName + ' (' + columns.join(',') + ') VALUES ( ' + dataList.join(',') + ' )';
    
    this.execute(sql, request, callback);
};

core.prototype.updateById = function(data, request, callback)
{
    var id = data[this.pk];
    if (void 0 === id) { console.log('pk is undefined'); return;}
    request.input(this.pk, this.db.Int, id);
    delete data[this.pk];

    var dataList = [];
    var columns = Object.keys(data);
    var len = columns.length;
    for (var i = 0; i < len; i ++)
    {
        var item = columns[i] + ' = @' + columns[i];
        dataList.push(item);
    }
    
    var sql = 'UPDATE ' + this.modelName + ' SET ' + dataList.join(',') + ' WHERE ' + this.pk + ' = @' + this.pk;
    this.execute(sql, request, callback);
};

core.prototype.removeById = function(idValue, callback)
{
    var request = this.getRequest();
    request.input(this.pk, this.db.Int, idValue);
    var sql = 'UPDATE ' + this.modelName + ' SET delete_flag = 1' + ' WHERE ' + this.pk + ' = @' + this.pk;
    this.execute(sql, request, callback);
};

core.prototype.deleteById = function(idValue, callback)
{
    var request = this.getRequest();
    request.input(this.pk, this.db.Int, idValue);
    var sql = 'DELETE FROM ' + this.modelName + ' WHERE ' + this.pk + ' = @' + this.pk;
    this.execute(sql, request, callback);
};

core.prototype.isSameItem = function(columns, value, type, callback)
{
    var request = this.getRequest();
    request.input(columns, type, value);
    var sql = 'SELECT COUNT(1) AS count FROM ' + this.modelName + ' WHERE ' + columns + ' = @' + columns;
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

core.prototype.insertLog = function(userId, controlType, appendString, callback)
{
    console.log('insertLog');
    var logData = logInfo.get(controlType);
    var detail = (void 0 !== appendString) ? logData.detail + appendString : logData.detail;
    var sql = "INSERT INTO T_LOG (delete_flag, create_by, create_date, update_by, update_date, user_id, show_flag, control_type, detail)";
    sql += " VALUES (@delete_flag, @create_by, @create_date, @update_by, @update_date, @user_id, @show_flag, @control_type, @detail)";
    var request = this.getRequest();
    request.input('delete_flag', this.db.SmallInt, 0);
    request.input('create_by', this.db.Int, userId);
    request.input('create_date', this.db.NVarChar, moment().format('YYYY/MM/DD hh:mm:ss'));
    request.input('update_by', this.db.Int, userId);
    request.input('update_date', this.db.NVarChar, moment().format('YYYY/MM/DD hh:mm:ss'));
    request.input('user_id', this.db.Int, userId);
    request.input('show_flag', this.db.Int, logData.show_flag);
    request.input('control_type', this.db.Int, controlType);
    request.input('detail', this.db.NVarChar, detail);
    this.execute(sql, request, function(err, ret)
    {
        console.log(err);
    });
    if (void 0 !== callback) callback();
};
//モジュール化
module.exports = core;