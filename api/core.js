var moment = require('moment');
var logInfo = require('../config/controlLog');
var logger = require("../helper/logger");

/**
 * core class
 * 
 * @namespace api
 * @class core
 * @constructor
 */
var core = function core(modelName, pk, seqName)
{
    this.modelName = modelName;
    this.pk = pk;
    this.seqName = seqName;
};

core.prototype.getPk = function()
{
    return this.pk;
};

core.prototype.momoent = require('moment');

core.prototype.async = require('async');

core.prototype.db = require('mssql');

core.prototype.merge = function(source, add, isNew)
{
    if (!add) add = {};
    if (void 0 === isNew || false === isNew)
    {
        for (var attrname in add)
        {
            if (add.hasOwnProperty(attrname))
            {
                source[attrname] = add[attrname];
            }
        }
        return source;
    }
    else
    {
        var newObj = {};
        Object.keys(source).forEach(function(name)
        {
            newObj[name] = source[name];
        });
        for (var attrname in add)
        {
            if (add.hasOwnProperty(attrname))
            {
                newObj[attrname] = add[attrname];
            }
        }
        return newObj;
    }
};

core.prototype.getRequest = function(transaction)
{
    var ms = require('mssql');
    if (void 0 === transaction)
    {
        //var connection = new ms.Connection(config);
        return new ms.Request();
    }
    else
    {
        return new ms.Request(transaction);
    }
};

core.prototype.tranBegin = function(callback)
{
    var tran = new this.db.Transaction();
    tran.begin(function(err)
    {
        callback(err, tran);
    });
};

core.prototype.getInsCommonColumns = function(userId)
{
    var date =  moment().format("YYYY/MM/DD HH:mm:ss");
    return {
        delete_flag: 0, create_by: userId, create_date: date, update_by: userId, update_date: date
    };
};

core.prototype.getUpdCommonColumns = function(userId)
{
    var date =  moment().format("YYYY/MM/DD HH:mm:ss");
    return {update_by: userId, update_date: date};
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
 * シーケンス値を取得する.
 * 
 * @author niikawa
 * @method getNextSeq
 * @param {Function} callback
 */
core.prototype.getNextSeq = function(callback)
{
    console.log("SEQ NAME IS " + this.seqName);
    var sql = "SELECT NEXT VALUE FOR " + this.seqName + " AS id";
    return this.execute(sql, this.getRequest(), callback);
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
    
    var sql = 'select * from ' + this.modelName + ' where delete_flag = 0 ';
    if (void 0 !== columns)
    {
        sql += ' order by ' + columns + option;
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
    var sql = 'select * from ' + this.modelName + ' WHERE ' + this.pk + ' = @' + this.pk + ' AND delete_flag = 0';
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
    //callbackからはprototypeを参照できないので一度変数に入れておく
    var p = this.getPk();
    var exe = this.execute;
    var type = this.db.Int;
    
    if (void 0 === this.seqName)
    {
        var dataList = [];
        //SEQを設定
        console.log(data);

        var columns = Object.keys(data);
        var len = columns.length;
        for (var i = 0; i < len; i ++)
        {
            var item = '@' + columns[i];
            dataList.push(item);
        }

        var sql = 'INSERT INTO ' + table + ' (' + columns.join(',') + ') VALUES ( ' + dataList.join(',') + ' )';
        exe(sql, request, function(errList, resultList)
        {
            callback(errList);
        });
    }
    else
    {
        this.getNextSeq(function(err, seqInfo)
        {
            if (null !== err)
            {
                callback(err);
            }
            else
            {
                var dataList = [];
                //SEQを設定
                data[p] = seqInfo[0].id;
                console.log(data);
    
                var columns = Object.keys(data);
                var len = columns.length;
                for (var i = 0; i < len; i ++)
                {
                    var item = '@' + columns[i];
                    dataList.push(item);
                }
                request.input(p, type, seqInfo[0].id);
                
                var sql = 'INSERT INTO ' + table + ' (' + columns.join(',') + ') VALUES ( ' + dataList.join(',') + ' )';
                exe(sql, request, function(errList, resultList)
                {
                    callback(errList, seqInfo[0].id);
                });
            }
        });
    }
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
        var item = columns[i] + ' =@' + columns[i];
        dataList.push(item);
    }
    
    var sql = 'UPDATE ' + this.modelName + ' SET ' + dataList.join(',') + ' WHERE ' + this.pk + ' = @' + this.pk + ' AND delete_flag = 0';
    this.execute(sql, request, callback);
};

core.prototype.updateByForeignKey = function(data, foreignKey, request, callback)
{
    var id = data[foreignKey];
    if (void 0 === id) { console.log('fk is undefined'); return;}
    request.input(foreignKey, this.db.Int, id);
    delete data[foreignKey];

    var dataList = [];
    var columns = Object.keys(data);
    var len = columns.length;
    for (var i = 0; i < len; i ++)
    {
        var item = columns[i] + ' =@' + columns[i];
        dataList.push(item);
    }
    
    var sql = 'UPDATE ' + this.modelName + ' SET ' + dataList.join(',') + ' WHERE ' + foreignKey + ' = @' + foreignKey + ' AND delete_flag = 0';
    this.execute(sql, request, callback);
};

core.prototype.removeById = function(idValue, callback)
{
    var request = this.getRequest();
    request.input(this.pk, this.db.Int, idValue);
    var sql = 'UPDATE ' + this.modelName + ' SET delete_flag = 1' + ' WHERE ' + this.pk + ' = @' + this.pk;
    this.execute(sql, request, callback);
};

core.prototype.removeByIdAndTran = function(idValue, transaction, callback)
{
    var request = this.getRequest(transaction);
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
    var sql = 'SELECT COUNT(1) AS count FROM ' + this.modelName + ' WHERE ' + columns + ' = @' + columns +' AND delete_flag=0';
    this.execute(sql, request, callback);
};

core.prototype.isSameItemByMultipleCondition = function(conditions, callback)
{
    var sql = 'SELECT COUNT(1) AS count FROM ' + this.modelName + ' WHERE ';
    var request = this.getRequest();
    var num = conditions.length;
    for(var index = 0; index < num; index++)
    {
        request.input(conditions[index].columns, conditions[index].type, conditions[index].value);
        sql += conditions[index].columns + ' ' + conditions[index].symbol +' @' + conditions[index].columns + ' AND ';
    }
    sql += 'delete_flag = 0';
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
       //console.log(columns);
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
        var errInfo = 0 < errList.length ? errList : null;
        callback(errInfo, result);
    });
};

core.prototype.commitOrRollback = function(transaction, req, err, callback)
{
    if (null !== err)
    {
        transaction.rollback(function(err)
        {
            if (err)
            {
                logger.error("ロールバックに失敗しました", req, err);
            }
            var errInfo = (void 0 === err) ? null : err;
            callback(errInfo);
        });
    }
    else
    {
        transaction.commit(function(err)
        {
            if (err)
            {
                logger.error("コミットに失敗しました", req, err);
            }
            var errInfo = (void 0 === err) ? null : err;
            callback(errInfo);
        });
    }
};

core.prototype.insertLog = function(userId, controlType, appendString, replace, data, callback)
{
    var logData = logInfo.get(controlType);
    var detail = logData.detail;
    if ((void 0 !== appendString))
    {
        var repString = appendString;
        if (void 0 !== replace)
        {
            repString = appendString.replace("$1", replace);
        }
        detail += "<br>" + repString;
    }
    
    if (void 0 !== data)
    {
//        detail += 'NCHAR(13) + NCHAR(10)' ;
        // Object.keys(data).forEach(function(key)
        // {
            
        // });
    }
    
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

core.prototype.appendUserInfoString = function(string ,req)
{
    return string + " userId = "+ req.session.userId + " : [" + req.session.userName + "]";
};

//モジュール化
module.exports = core;