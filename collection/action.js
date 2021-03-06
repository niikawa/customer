var DocumentDBClient = require('documentdb').DocumentClient;
var docdbUtils = require('./docdbUtils');

function Action(documentDBClient, databaseId, collectionId) {
  this.client = documentDBClient;
  this.databaseId = databaseId;
  this.collectionId = collectionId;

  this.database = null;
  this.collection = null;
}

module.exports = Action;

Action.prototype =
{
    init: function (callback)
    {
        var self = this;

        docdbUtils.getOrCreateDatabase(self.client, self.databaseId, function (err, db)
        {
            if (err)
            {
                callback(err);
            }
            else
            {
                self.database = db;
                docdbUtils.getOrCreateCollection(
                    self.client, self.database._self, self.collectionId, function (err, coll)
                {
                    if (err)
                    {
                        callback(err);
                    }
                    else
                    {
                        self.collection = coll;
                    }
                });
            }
        });
    },
    find: function (querySpec, callback)
    {
        var self = this;

        self.client.queryDocuments(
            self.collection._self, querySpec).toArray(function (err, results)
        {
            if (err)
            {
                callback(err);
            }
            else
            {
                callback(null, results);
            }
        });
    },
    addItem: function (item, callback)
    {
        var self = this;

        var data =
        {
            query_name: item.query_name,
            sql: item.sql,
            tables: item.tables,
            whereList: item.whereList,
            bindInfo: item.bindInfo,
            columnTypeList: item.columnTypeList
        };

        self.client.createDocument(self.collection._self, data, function (err, doc)
        {
            if (err)
            {
                callback(err);
            }
            else
            {
                callback(null, doc);
            }
        });
    },

    getItem: function (itemId, callback)
    {
        var self = this;

        var querySpec =
        {
            query: 'SELECT * FROM root r WHERE r.id=@id',
            parameters: [{
                name: '@id',
                value: itemId
            }]
        };

        self.client.queryDocuments(
            self.collection._self, querySpec).toArray(function (err, results)
        {
            if (err)
            {
                callback(err);
            }
            else
            {
                callback(null, results[0]);
            }
        });
    },
    getItemByIds: function (idList, columnList, callback)
    {
        var self = this;
        
        var column = columnList.join(',');
        var query = 'SELECT ' + column + ' FROM doc WHERE doc.id IN (';
        
        var num = idList.length;
        var last = num - 1;
        var parameters = [];
        
        for (var index = 0; index < num; index++)
        {
            var bindName = '@ids' + index;
            parameters.push({name: bindName, value: idList[index]});
            
            if (last === index) 
            {
                query += bindName + ')';
            }
            else
            {
                query += bindName + ', ';
            }
        }

        var querySpec = {
            query: query,
            parameters: parameters
        };
        
        self.client.queryDocuments(self.collection._self, querySpec).toArray(function (err, results)
        {
            if (err)
            {
                callback(err);
            }
            else
            {
                callback(null, results);
            }
        });
    },
    removeItem: function(itemId, callback)
    {
        
        var self = this;

        self.getItem(itemId, function (err, doc)
        {
            if (err)
            {
                callback(err);
            }
            else
            {
                self.client.deleteDocument(doc._self, doc, function (err, result)
                {
                    if (err)
                    {
                        callback(err);
                    }
                    else
                    {
                        callback(null, result);
                    }
                });
            }
        });
    }
};