var Core = require('./core');

/** テーブル名 */
var tableName = 'M_DEMAND_BUG';
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
    
    var col = "id, create_by, status, type, category, title, contents";
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

    where = " T1.delete_flag = 0";

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