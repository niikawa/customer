var Core = require('./core');
var Message = require('../config/message.json');
var logger = require("../helper/logger");

/** 
 * クエリー機能APIのクラス
 * 
 * @namespace api
 * @class Table
 * @constructor
 * @extends api.core
 */
var Table = function Table()
{
    Core.call(this, '', '', '');
};

var util = require('util');
util.inherits(Table, Core);

/**
 * 参照可能なテーブル情報とカラム情報を取得する
 * 
 * @method getTablesList
 * @param {Function} callback コールバック
 * @return
 * 
 */
Table.prototype.getTablesList = function(callback)
{
    //表示対象のテーブル一覧を取得するSQL
    var tableSql = "SELECT t.name table_name, cast(ep.value as nvarchar) comment " +
                    "FROM sys.tables t , sys.extended_properties ep " +
                    "WHERE t.name like 'R_%' AND t.object_id = ep.major_id AND ep.minor_id = 0";
                    
    var tableInfo = {};
    var request = model.getRequest();
    model.execute(tableSql, request, function(err, tableList)
    {
        if (null !== err)
        {
            callback(err);
            return;
        }
        
        //表示対象のテーブルが持つカラム一覧を取得するSQL
        var columnSql = "SELECT t.name table_name ,c.name column_name ,sc.data_type ,sc.character_maximum_length max_lengt ,cast(ep.value as nvarchar) comment " +
                        "FROM sys.tables t, sys.columns c, sys.extended_properties ep, INFORMATION_SCHEMA.COLUMNS sc " +
                        "WHERE t.name = @tableName AND t.object_id = c.object_id AND c.object_id = ep.major_id AND c.column_id = ep.minor_id AND t.name = sc.table_name AND sc.COLUMN_NAME = c.name";
        
        model.async.forEach(tableList, function(table, next)
        {
            var request = model.getRequest();
            request.input("tableName", model.db.NVarChar, table.table_name);
            //テーブル名と説明に分割する
            var description = String(table.comment).split(",");

            if (void 0 === description[2] || 'true' == description[2])
            {
                tableInfo[table.table_name] = 
                {
                    physicalname: table.table_name,
                    logicalname: description[0], 
                    description: description[1],
                    column: {}
                };
            }
            //カラムを取得する
            model.execute(columnSql, request, function(err, columnList)
            {
                if (null !== err.length)
                {
                    next(err);
                }
                else
                {
                    var num = columnList.length;
                    var colArray = [];
                    for (var index = 0; index < num; index++)
                    {
                        var target = columnList[index];
                        //カラム名と説明に分割する
                        var colInfo = String(target.comment).split(",");
                        if (void 0 === colInfo[2] || 'true' == colInfo[2])
                        {
                            var colObject = 
                            {
                                physicalname: target.column_name,
                                logicalname: colInfo[0],
                                description: colInfo[1],
                                type: target.data_type,
                                length: target.max_lengt,
                            };
                            colArray.push(colObject);
                        }
                    }
                    tableInfo[table.table_name].column = colArray;
                    next();
                }
            });
        },
        function (err) 
        {
            callback(err, tableInfo);
        });
    });
};

var model = new Table();

/**
 * 参照可能なテーブル情報とカラム情報を取得する
 * 
 * @method getTables
 * @param {object} req リクエストオブジェクト
 * @param {object} res レスポンスオブジェクト
 * @return 
 * <li>{Objject} tables : 利用可能テーブル情報 {{#crossLink "Table:getTablesList"}}{{/crossLink}}</li>
 */
exports.getTables = function(req, res)
{
    model.getTablesList(function(err, data)
    {
        if (null !== err)
        {
            logger.error(Message.COMMON.E_102.replace("$1", "[table.getTables]"), req, err);
            res.status(511).send(Message.QUERY.E_003);
            return;
        }
        res.json({table: data});
    });
};
/**
 * 参照可能なテーブル情報とカラム情報を取得する
 * 
 * @method getTables
 * @param {Function} callback コールバック
 * @return 
 * <li>{Objject} tables : 利用可能テーブル情報 {{#crossLink "Table:getTablesList"}}{{/crossLink}}</li>
 */
exports.getTablesListForWeb = function(callback)
{
    model.getTablesList(callback);
};