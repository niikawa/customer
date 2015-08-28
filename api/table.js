var Core = require('./core');

var table = function table()
{
    Core.call(this, '', '', '');
};

var util = require('util');
util.inherits(table, Core);

var model = new table();

exports.getTables = function(req, res)
{
    //表示対象のテーブル一覧を取得する
    var tableSql = "SELECT t.name AS table_name, ep.value AS comment " +
                    "FROM sys.tables AS t ,sys.extended_properties AS ep " +
                    "WHERE t.name like 'R_%', AND t.object_id = ep.major_id, AND ep.minor_id = 0 ";
    var tableInfo = {};
    var request = req.getRequest();
    model.execute(tableSql, request, function(err, tableList)
    {
        if (0 < err.length)
        {
            res.status(510).send("テーブルデータの取得に失敗しました。");
            return;
        }
        
        //表示対象のテーブルが持つカラム一覧を取得する
        var columnSql = "SELECT t.name table_name ,c.name column_name ,sc.data_type ,sc.character_maximum_length max_lengt ,ep.value commnet" +
                        "FROM  sys.tables AS t, ,sys.columns AS c, sys.extended_properties AS ep, INFORMATION_SCHEMA.COLUMNS sc" +
                        "WHERE  t.name = @tableName AND t.object_id = c.object_id AND c.object_id = ep.major_id AND c.column_id = ep.minor_id AND t.name = sc.table_name AND sc.COLUMN_NAME = c.name";
                        
        model.async.foreach(tableList, function(table, callback)
        {
            request.input("tableName", model.db.NVarChar, table.table_name);
            var tableInfo = table.comment.split(",");
            tableInfo[table.table_name] = 
            {
                physicalname: table.table_name,
                logicalname: tableInfo[0], 
                description: tableInfo[1],
                column: {}
            };
            
            model.execute(columnSql, request, function(err, columnList)
            {
                if (0 < err.length)
                {
                    callback(err);
                }
                else
                {
                    var num = columnList.length;
                    var colArray = [];
                    for (var index = 0; index < num; index++)
                    {
                        var target = columnList[index];
                        var colInfo = target.comment.split(",");
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
                    tableInfo[table.table_name].column = colArray;
                    callback(null);
                }
            });
        });
    });
    
//    var table = require('../config/table.json');
    res.json({table: tableInfo});
};
