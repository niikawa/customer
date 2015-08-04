var values = {};
var colTypes = {};
var keyColumnName = 'customer_id';


/**
 * sql creater class
 * 
 * @author niikawa
 * @param {string} createType query or segment
 * @param {array} return query document data
 * @param {object} request object or undfined
 */
function CreateSQL(createType, list, request)
{
    this.values = {};
    if (void 0 === request)
    {
        var ms = require('mssql');
        this.request = new ms.Request();
    }
    else
    {
        this.request = request;
    }
    if ('query' === createType)
    {
        this.conditions = createQuery(list, this.request);
        this.valueList = values;
        this.colTypeList = colTypes;
    }
    else if ('segment' === createType)
    {
        this.conditions = createSegment(list, this.request);
    }
}

module.exports = CreateSQL;

CreateSQL.prototype = 
{
    getRequestObject: function()
    {
        return this.request;
    },
    getConstionString: function()
    {
        return this.conditions;
    },
    getSql: function(tableList)
    {
        var tables = this.getTableListByTableInfoObject(tableList);
        var tableJoin = getJoinTable(tables);
        
        return "SELECT distinct("+ tables[0] +"."+ keyColumnName +") FROM " + tableJoin + ' WHERE ' + this.conditions;
    },
    getCountSql: function(tableList)
    {
        var tables = this.getTableListByTableInfoObject(tableList);
        var tableJoin = getJoinTable(tables);
        
        return "SELECT count( distinct("+ tables[0] + '.' +keyColumnName + ") ) AS count FROM " + tableJoin + ' WHERE ' + this.conditions;
    },
    getValueList: function()
    {
        return this.valueList;
    },
    getColTypeList: function()
    {
        return this.colTypeList;
    },
    getTableListByTableInfoObject: function(tables)
    {
        var workObj = {};
        var tableList = [];
        Object.keys(tables).forEach(function(tableName)
        {
            if (!workObj.hasOwnProperty(tableName))
            {
                tableList.push(tableName);
                workObj[tableName] = workObj;
            }
        });
        return tableList;
    },
    mergeTablesToQueryDocInfo: function(queryDocs)
    {
        
        var num = queryDocs.length;
        var tableListObject = [];
        for (var index = 0; index < num; index++)
        {
            var target = queryDocs[index];
            Object.keys(target.tables).forEach(function(tableName)
            {
                if (!tableListObject.hasOwnProperty(tableName))
                {
                    tableListObject[tableName] = tableName;
                }
            });
        }
        return tableListObject;
    }
};

function getJoinTable(tables)
{
    var tableJoin = '';
    var tableNum = tables.length;
    var last = tableNum - 1;
    if (tableNum > 1)
    {
        for (var index = 0; index < tableNum; index++)
        {
            var defore = tables[index];
            var next = index + 1;
            if (0 === index || next < last)
            {
                tableJoin = defore + ' INNER JOIN ' ;
                tableJoin += tables[next] + ' ON ' + defore + '.' + keyColumnName + ' = ' + tables[next] + '.' + keyColumnName;
            }
        }
    }
    else
    {
        tableJoin = tables.join(',');
    }
    return tableJoin;
}

function getColType(type)
{
    var db = require('mssql');
    switch(type)
    {
        case 'INT':
            return db.Int;
        case 'VARCHAR':
            return db.VarChar;
        case 'NVarChar':
        case 'DATETIME':
        default:
            return db.NVarChar;
    }
}

function createQuery(list, request)
{
    var where = ' ';
    var num = list.length;
    var last = num -1;
    
    for (var index = 0; index < num; index++)
    {
        var items = list[index];
        if (items.length > 1) where += '(';
        var isLast = (index === last);
        where += getRow(items, isLast, request);
    }
    return where;
}

function getRow(items, isLast, request)
{
    var num = items.length;
    var last = num -1;
    var row = '';
    
    for (var index = 0; index < num; index++)
    {
        var item = items[index];
        row += item.table.physicalname + '.' + item.column.physicalname + ' ' + item.selectedCondition.symbol + ' ';
        var baindName = item.table.physicalname + '' + item.column.physicalname;
        row += createValuePartBySymbol(item, baindName, request);

        if (num > 1 && last === index) row += ')';
        
        if (!isLast || last !== index) row += ' ' + item.condition.where + ' ';
    }
    return row;
}

function createValuePartBySymbol(item, name, request)
{
    var part = '';
    var isMultiple = false;
    var symbol = item.selectedCondition.symbol;
    var bindName = '@' + name;
    var name2 = name + '2';
    var bindName2 = '@' + name2;
    
    switch (symbol)
    {
        case 'IN':
        case 'NOT IN':
            
            var valueList = item.condition.value1.split(/\r\n|\r|\n/);
            var valueNum = valueList.length;
            var last = valueNum -1;
            part += ' (';
            for (var index = 0; index < valueNum; index++)
            {
                part += bindName + index;
                if (index !== last) part += ', ';
            }
            part += ' )';
            
            break;
        case 'BETWEEN':
            part = '' + bindName + ' AND ' + bindName2;
            isMultiple = true;
            break;
        case 'LIKE':
            if (9 == item.condition.value)
            {
                part = bindName + '%';
            }
            else if (10 == item.condition.value)
            {
                part = '%'+ bindName;
            }
            else
            {
                part = '%'+ bindName + '%';
            }
            break;
        default:
            part = bindName;
    }
    
    var type = getColType(item.column.type);
    
    if ('IN' === symbol || 'NOT IN' === symbol)
    {
        var bindValueList = item.condition.value1.split(/\r\n|\r|\n/);
        var bindValueNum = bindValueList.length;
        for (var index = 0; index < bindValueNum; index++)
        {
            var inputName = name + index;
            request.input(inputName, type, bindValueList[index]);
            values[inputName] = bindValueList[index];
            colTypes[inputName] = item.column.type;
        }
    }
    else
    {
        request.input(name, type, item.condition.value1);
        values[name] = item.condition.value1;
        colTypes[name] = item.column.type;
    }
    if (isMultiple)
    {
        request.input(name2, type, item.condition.value2);
        values[name2] = item.condition.value2;
        colTypes[name2] = item.column.type;
    }

    return part;
}

function createSegment(data, request)
{
    console.log('createSegment start');

    var conditionMap = data.conditionMap;
    console.log(conditionMap);
    var num = data.docs.length;
    //document DB から取得した結果は、順序が保障されていない
    //おそらくデフォルトでは_tsの照準っぽい
    var docs = {};
    for (var index = 0; index < num; index++)
    {
        docs[data.docs[index].id] = data.docs[index];
    }
    var sql = '';
    var last = num - 1;
    var count = 0;
    Object.keys(conditionMap).forEach(function(qId)
    {
        var doc = docs[qId];
        sql += '('+ doc.sql + ')';
        if (last !== count) sql += conditionMap[qId];
        count++;
        Object.keys(doc.columnTypeList).forEach(function(key)
        {
            var type = getColType(doc.columnTypeList[key]);
            request.input(key, type, doc.bindInfo[key]);
        });
    });
    console.log(sql);
    return sql;
}
