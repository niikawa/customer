var async = require('async');
var Core = require('./core');

/** テーブル名 */
var tableName = 'M_SEGMENT';
var pk = 'segment_id';

var segment = function segment()
{
    Core.call(this, tableName, pk);
};

//coreModelを継承する
var util = require('util');
util.inherits(segment, Core);

var model = new segment();

exports.create = function(req, res)
{
    var commonColumns = model.getInsCommonColumns();
    var insertData = model.merge(req.body.data, commonColumns);
    insertData.status = 1;
    var request = model.getRequest();
    request.input('delete_flag', model.db.SmallInt, insertData.delete_flag);
    request.input('create_by', model.db.Int, req.session.userId);
    request.input('create_date', model.db.NVarChar, insertData.create_date);
    request.input('update_by', model.db.Int, req.session.userId);
    request.input('update_date', model.db.NVarChar, insertData.update_date);
    request.input('segment_name', model.db.NVarChar, insertData.segment_name);
    request.input('status', model.db.SmallInt, insertData.status);
    request.input('segment_document_id', model.db.NVarChar, insertData.segment_document_id);

    model.insert(tableName, insertData, request, function(err, date)
    {
        if (err.length > 0)
        {
            console.log(err);
            res.status(510).send('object not found');
        }
        res.status(200).send('insert ok');
    });
};
