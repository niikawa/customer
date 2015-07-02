var async = require('async');
var Core = require('./core');
var Creator = require("./common/createSql");

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

exports.execute = function(req, res)
{
    var request = model.getRequest();
    var creator = new Creator('query', req.body.conditionList, request);
    var sql = creator.getCountSql(req.body.tables);
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