function CreateSQL(list, request)
{
    this.request = request;
    this.sql = createSQL(list, this.request);
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
        return this.sql;
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

function createSQL(list, request)
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
    if (isMultiple) request.input(name2, type, item.condition.value2);

    return part;
}

