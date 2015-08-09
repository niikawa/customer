var Core = require('./core');
var Message = require('../config/message.json');

/** テーブル名 */
var tableName = 'T_TAG';
var pk = 'tag_id';
/** SEQ */
var seqName = 'seq_tag';

var tag = function tag()
{
    Core.call(this, tableName, pk, seqName);
};

//coreModelを継承する
var util = require('util');
util.inherits(tag, Core);

var model = new tag();

exports.getAll = function(callback)
{
    var request = model.getRequest();

    var col = "tag_id, tag_name";
    var where = "delete_flag = 0";
    var qObj = model.getQueryObject(col, tableName, where, '', '');
    model.select(qObj, request, function(err, data)
    {
        var errInfo = (0 < err.length) ? err: null;
        callback(errInfo, data);
    });
};

exports.save = function(transaction, userId, tagList, mainCallback)
{
    console.log("tag save start");
    console.log(tagList);
    var commonColumns = model.getInsCommonColumns(userId);

    model.async.forEach(tagList, function(item, callback)
    {
        console.log(item);

        if (!item.hasOwnProperty('tag_id'))
        {
            if (item.hasOwnProperty('tag_name'))
            {
                var tagName = item.tag_name.trim();
                model.async.waterfall(
                [
                    function(callback)
                    {
                        var request = model.getRequest(transaction);
                        request.input('tag_name', model.db.NVarChar, tagName);
                        
                        var col = "tag_id";
                        var where = "tag_name = @tag_name AND delete_flag = 0";
                        var qObj = model.getQueryObject(col, tableName, where, '', '');
                        model.select(qObj, request, function(err, data)
                        {
                            var errInfo = (0 < err.length) ? err: null;
                            callback(errInfo, data);
                        });
                    },
                    function(data, callback)
                    {
                        console.log(data);
                        
                        if (0 < data.length)
                        {
                            item.tag_id = data[0].tag_id;
                            callback(null);
                        }
                        else
                        {
                            var insertData = model.merge(commonColumns, {tag_name: tagName});
                            console.log("go insert tags");
                            console.log(insertData);
                            
                            var request = model.getRequest(transaction);
                            request.input('delete_flag', model.db.SmallInt, insertData.delete_flag);
                            request.input('create_by', model.db.Int, insertData.create_by);
                            request.input('create_date', model.db.NVarChar, insertData.create_date);
                            request.input('update_by', model.db.Int, insertData.update_by);
                            request.input('update_date', model.db.NVarChar, insertData.update_date);
                            request.input('tag_name', model.db.NVarChar, insertData.tag_name);
                            
                            model.insert(tableName, insertData, request, function(err, id)
                            {
                                item.tag_id = id;
                                var errInfo = (0 < err.length) ? err: null;
                                console.log("tag insert info");
                                console.log(id);
                                console.log(err);
                                callback(errInfo);
                            });
                        }
                    }
                ],
                function(err)
                {
                    callback(err);
                });
            }
            else
            {
              callback(null);
            }
        }
        else
        {
            callback(null);
        }
    },
    function(err)
    {
        console.log("last function for tags.js");
        console.log(err);
        mainCallback(err, tagList);
    });
};
