var values = {};
var colTypes = {};
function CreateSQL(list, request)
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
    this.consitions = createData(list, this.request);
    this.valueList = values;
    this.colTypeList = colTypes;
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
        return this.consitions;
    },
    getSql: function(tableList)
    {
        var work = [];
        Object.keys(tableList).forEach(function(key)
        {
            work.push(key);
        });
        
        return "SELECT * FROM " + work.join(',') + ' WHERE ' + this.consitions;
    },
    getCountSql: function(tableList)
    {
        var work = [];
        Object.keys(tableList).forEach(function(key)
        {
            work.push(key);
        });
        
        return "SELECT count(1) AS count FROM " + work.join(',') + ' WHERE ' + this.consitions;
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

function createData(list, request)
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
            part = ' (@' + bindName + ')';
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
    request.input(name, type, item.condition.value1);
    values[name] = item.condition.value1;
    colTypes[name] = item.column.type;
    if (isMultiple)
    {
        request.input(name2, type, item.condition.value2);
        values[name2] = item.condition.value2;
    }

    return part;
}

