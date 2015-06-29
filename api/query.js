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
    var firstLength = list.length;
    var firstLooplast = firstLength -1;
    
    for (var i = 0; i < firstLength; i++)
    {
        var items = list[i];
        var secondLength = items.length;
        var secondLoopLast = secondLength -1;
        if (items.length > 1) where += '(';
        
        for (var j = 0; j < secondLength; j++)
        {
            where += items[j].table.physicalname + '.' + items[j].column.physicalname + ' ' + items[j].selectedCondition.symbol + ' ';
            switch (items[j].selectedCondition.symbol)
            {
                case 'IN':
                case 'NOT IN':
                    where += ' (' + items[j].condition.value1 + ')';
                    break;
                case 'BETWEEN':
                    where += items[j].condition.value1 + ' AND ' + items[j].condition.value2;
                    break;
                case 'LIKE':
                    if (9 == items[j].condition.value)
                    {
                        where += items[j].condition.value1 + '%';
                    }
                    else if (10 == items[j].condition.value)
                    {
                        where += '%'+ items[j].condition.value1;
                    }
                    else
                    {
                        where += '%'+ items[j].condition.value1 + '%';
                    }
                    break;
                default:
                    where += '@'+items[j].column.physicalname;
                    var type = getColType(items[j].column.type);
                    request.input(items[j].column.physicalname, type, items[j].condition.value1);
            }
            if (items.length > 1 && secondLoopLast === j ) where += ')';
            
            if (i !== firstLooplast || j !== secondLoopLast) where += ' ' + items[j].condition.where + ' ';
            
        }
    }
    return {where: where, request: request};
}

exports.exeucte = function(req, res)
{
    console.log('exeucte query');
    
    var request = model.getRequest();
    var data = req.body.data;
    console.log(data);

    var tableList = Object.keys(data.tables);
    console.log(tableList);
    var exexuteData = createSQL(data, request);
    
    var sql = "SELECT * FROM " + tableList.join(',') + exexuteData.where;
    model.execute(sql, exexuteData.request, function(err, date)
    {
        if (err.length > 0)
        {
            console.log(err);
            res.status(510).send('object not found');
        }
        res.status(200).send('insert ok');
    });
};
