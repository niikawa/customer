var Core = require('./core');

/** テーブル名 */
var tableName = 'T_DEMAND_BUG';
var pk = 'id';

var bug = function bug()
{
    Core.call(this, tableName, pk);
};

//coreModelを継承する
var util = require('util');
util.inherits(bug, Core);

var model = new bug();

exports.getByConditon = function(req, res)
{
    var request = model.getRequest();
    
    var col = "T1.id, FORMAT(T1.create_by, 'yyyy-MM-dd hh:mm:ss') as create_by, T1.status, T1.type, T1.category, T1.title, T1.contents";
    col += " T2.name, T2.role_id";
    var tableName = "T_DEMAND_BUG T1 INNER JOIN M_USER T2 ON T1.create_by = T2.user_id";
    var where = '';
    if (req.body.hasOwnProperty('status')) 
    {
        where += "status = @status AND";
        request.input('status', model.db.Int, req.body.status);
    }
    
    if (req.body.hasOwnProperty('type')) 
    {
        where += "type = @type AND";
        request.input('type', model.db.Int, req.body.type);
    }

    where = " delete_flag = 0";

    var order = "id DESC";
    var qObj = model.getQueryObject(col, tableName, where, '', order);

    model.select(qObj, request, function(err, data)
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

exports.save = function(req, res)
{
    
}