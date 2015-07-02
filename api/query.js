var async = require('async');
var Core = require('./core');

/** テーブル名 */
var tableName = '';
var pk = '';

var query = function query()
{
    Core.call(this, tableName, pk);
};

//coreModelを継承する
var util = require('util');
util.inherits(query, Core);

var model = new query();

function getColType(type)
{
    switch(type)
    {
        case 'INT':
            return model.db.Int;
        case 'VARCHAR':
            return model.db.VarChar;
        case 'NVarChar':
        case 'DATETIME':
        default:
            return model.db.NVarChar;
    }
}

function createSQL(list, request)
{
    var where = ' ';
    var num = list.length;
    var last = num -1;
    
    for (var index = 0; index < num; i++)
    {
        var items = list[i];
        if (items.length > 1) where += '(';
        var isLast = index === last;
        where += getRow(items, isLast, request);
    }
    return {where: where, request: request};
}

function getRow(items, isLast, request)
{
    var num = items.length;
    var last = num -1;
    var row = '';
    
    for (var index = 0; index < num; index++)
    {
        var item = items[index];
        var colName = item.table.physicalname + '.' + item.column.physicalname + ' ' + item.selectedCondition.symbol;
        row += colName + ' ';
        row += createValuePartBySymbol(item, colName, request);

        if (num > 1 && last === index) row += ')';
        
        if (!isLast || last === index) row += ' ' + item.condition.where + ' ';
    }
    return row;
}

function createValuePartBySymbol(item, name, request)
{
    var part = '';
    var isMultiple = false;
    var symbol = item.selectedCondition.symbol;
    var bindName = '@' + name;
    var bindName2 = bindName+'2';
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
    request.input(bindName, type, item.condition.value1);
    if (isMultiple) request.input(bindName2, type, item.condition.value2);

    return part;
}

exports.execute = function(req, res)
{
    var request = model.getRequest();
    var tableList = [];
    Object.keys(req.body.tables).forEach(function(key)
    {
        tableList.push(key);
    });
    
//    var sql = "SELECT count(1) AS count FROM " + tableList.join(',') + ' WHERE ' + req.body.condition;
    
    var append = createSQL(req.body.showConditions, request);
    var sql = "SELECT count(1) AS count FROM " + tableList.join(',') + ' WHERE ' + append;
    
    
    console.log('query exexute');
    console.log(sql);
    
    model.execute(sql, request, function(err, data)
    {
        if (err.length > 0)
        {
            console.log(err);
            res.status(510).send('data not found');
        }
        res.json({result: data[0].count});
    });
};
