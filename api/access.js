var Core = require('./core');

/** テーブル名 */
var tableName = 'M_LOG';
var pk = 'log_id';

var log = function log()
{
    Core.call(this, tableName, pk);
};

//coreModelを継承する
var util = require('util');
util.inherits(log, Core);

var model = new log();

exports.getAll = function(req, res)
{
    var col = "T1.log_id, T1.user_id, T1.detail, T2.name";
    var table = "T_LOG T1 INNER JOIN M_USER T2 ON T1.user_id = T2.user_id";
    var where = "T1.delete_flag = 0 AND T2.delete_flag = 0";
    var order = "T1.log_id DESC";
    var qObj = model.getQueryObject(col, table, where, '', order);
    
    model.select(qObj, qObj.request, function(err, data)
    {
        if (err.length > 0)
        {
            console.log('get execute plan scenario faild');
            console.log(err);
            res.status(510).send('scenario crate faild');
        }
        res.json({data: data});
    });
};