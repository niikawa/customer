var values = {};
var colTypes = {};
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
        var work = [];
        Object.keys(tableList).forEach(function(key)
        {
            work.push(key);
        });
        
        return "SELECT * FROM " + work.join(',') + ' WHERE ' + this.conditions;
    },
    getCountSql: function(tableList)
    {
        var work = [];
        Object.keys(tableList).forEach(function(key)
        {
            work.push(key);
        });
        return "SELECT count(1) AS count FROM " + work.join(',') + ' WHERE ' + this.conditions;
    },
    getValueList: function()
    {
        return this.valueList;
    },
    getColTypeList: function()
    {
        return this.colTypeList;
    }
};

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
    
    if ('IN' !== symbol &&  'NOT IN' !== symbol)
    {
        var bindValueList = item.condition.value1.split(/\r\n|\r|\n/);
        var bindValueNum = bindValueList.length;
        for (var index = 0; index < bindValueNum; index++)
        {
            var inputName = name + index;
            request.input(inputName, type, bindValueList[index]);
        }
    }
    else
    {
        request.input(name, type, item.condition.value1);
        values[name] = item.condition.value1;
    }
    colTypes[name] = item.column.type;
    if (isMultiple)
    {
        request.input(name2, type, item.condition.value2);
        values[name2] = item.condition.value2;
    }

    return part;
}

function createSegment(data, request)
{
    console.log('createSegment start');
    console.log(data);
    var docs = data.docs;
    var conditionMap = data.conditionMap;
    
    var num = docs.length;
    var last = num - 1;
    var sql = '';
    for (var index = 0; index < num; index++)
    {
        var doc = docs[index];
        sql += '('+ doc.sql + ')';
        if (last !== index) sql += conditionMap[docs[index].id];

        Object.keys(doc.columnTypeList).forEach(function(key)
        {
            var type = getColType(doc.columnTypeList[key]);
            request.input(key, type, doc.bindInfo[key]);
        });
    }
    return sql;
}
