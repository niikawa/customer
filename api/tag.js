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

exports.save = function(transaction, tagList, userId, callback)
{
    console.log("tag save start");
    console.log(tagList);
    var request = model.getRequest(transaction);
    var commonColumns = model.getInsCommonColumns(userId);

    console.log("foreach");
    
    model.async.forEach(tagList, function(item, callback)
    {
        console.log(item);
        if (!item.hasOwnProperty('tag_id'))
        {
            console.log("this item is no props");
            if (item.hasOwnProperty('tag_name'))
            {
                console.log(item.tag_name);
                var tagName = item.tag_name.trim();
                request.input('tag_name', model.db.NVarChar, tagName);
                
                var col = "tag_id";
                var where = "tag_name = @tag_name AND delete_flag = 0";
                var qObj = model.getQueryObject(col, tableName, where, '', '');
                model.select(qObj, request, function(err, data)
                {
                    console.log("select result");
                    console.log(err);
                    console.log(data);
                    
                    if (0 < data.length)
                    {
                        item.tag_id = data[0].tag_id;
                        callback(err);
                        return;
                    }
                    else
                    {
                        var insertData = model.merge(commonColumns, {tag_name: tagName});
                        console.log("go insert");
                        console.log(insertData);
                        model.insert(tableName, insertData, request, function(err, id)
                        {
                            item.tag_id = id;
                            callback(err);
                        });
                    }
                });
           }
           callback(null);
       }
    },
    function(err)
    {
        console.log("last function for tags.js");
        console.log(err);
        callback(err, tagList);
    });
};
