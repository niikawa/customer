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

exports.getDayAll = function(req, res)
{
    var col = "T1.log_id, FORMAT(T1.create_date, 'yyyy-MM-dd hh:mm:ss') as date, T1.user_id, T1.detail, T2.name";
    var table = "T_LOG T1 INNER JOIN M_USER T2 ON T1.user_id = T2.user_id";
    var where = "T1.create_date BETWEEN @start AND @end AND T1.delete_flag = 0 AND T2.delete_flag = 0";
    var order = "T1.log_id DESC";
    var qObj = model.getQueryObject(col, table, where, '', order);
    var start = req.body.day + '00:00:00';
    var end = req.body.day + '23:59:59';
    qObj.request.input('start', model.db.NVarChar, start);
    qObj.request.input('end', model.db.NVarChar, end);
    
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

exports.getDayAllByUserId = function(req, res)
{
    var col = "T1.log_id, FORMAT(T1.create_date, 'yyyy-MM-dd hh:mm:ss') as date, T1.user_id, T1.detail, T2.name";
    var table = "T_LOG T1 INNER JOIN M_USER T2 ON T1.user_id = T2.user_id";
    var where = "T1.create_date BETWEEN @start AND @end AND T1.user_id = @userId AND T1.delete_flag = 0 AND T2.delete_flag = 0";
    var order = "T1.log_id DESC";
    var qObj = model.getQueryObject(col, table, where, '', order);
    var start = req.body.day + '00:00:00';
    var end = req.body.day + '23:59:59';
    qObj.request.input('start', model.db.NVarChar, start);
    qObj.request.input('end', model.db.NVarChar, end);
    qObj.request.input('userId', model.db.Int, req.body.id);
    
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