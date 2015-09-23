var DocumentDBClient = require('documentdb').DocumentClient;
var docdbUtils = require('./docdbUtils');

function Scenario(documentDBClient, databaseId, collectionId)
{
  this.client = documentDBClient;
  this.databaseId = databaseId;
  this.collectionId = collectionId;

  this.database = null;
  this.collection = null;
}

module.exports = Scenario;

Scenario.prototype = {
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
                docdbUtils.getOrCreateCollection(self.client, self.database._self, self.collectionId, function (err, coll) {
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

    find: function (querySpec, callback) {
        var self = this;

        self.client.queryDocuments(self.collection._self, querySpec).toArray(function (err, results) {
            if (err) {
                callback(err);

            } else {
                callback(null, results);
            }
        });
    },

    addItem: function (data, callback) {
        var self = this;
        
        var doc = {};
        if (data.hasOwnProperty('actionId'))
        {
            doc.actionId = data.actionId;
            doc.conditionList = data.conditionList;
        }
        else if (data.hasOwnProperty('interval'))
        {
            doc.interval = data.interval;
            if (1 != data.interval)
            {
                if (data.hasOwnProperty('daysCondition'))
                {
                    doc.daysCondition = data.daysCondition;
                }
                else if (data.hasOwnProperty('weekCondition'))
                {
                    doc.weekCondition = data.weekCondition;
                }
                else
                {
                    callback('コレクションを作るためのデータが足りません', null);
                }
            }
        }

        self.client.createDocument(self.collection._self, doc, function (err, doc) 
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

    updateItem: function (data, callback)
    {
        var self = this;

        self.getItem(data.id, function (err, doc)
        {
            console.log(doc);
            if (err)
            {
                callback(err);
            }
            else
            {
                if (data.hasOwnProperty('actionId'))
                {
                    doc.actionId = data.actionId;
                    console.log("update document");
                    console.log(data.conditionList);
                    console.log(doc.conditionList);
                    doc.conditionList = data.conditionList;
                }
                else if (data.hasOwnProperty('interval'))
                {
                    doc.interval = data.interval;
                    
                    if (data.hasOwnProperty('daysCondition'))
                    {
                        doc.daysCondition = data.daysCondition;
                        delete doc.weekCondition;
                    }
                    else if (data.hasOwnProperty('weekCondition'))
                    {
                        doc.weekCondition = data.weekCondition;
                        delete doc.daysCondition;
                    }
                    else
                    {
                        callback('コレクションを作るためのデータが足りません', null);
                        return;
                    }
                }

                self.client.replaceDocument(doc._self, doc, function (err, replaced) {
                    if (err) {
                        callback(err);

                    } else {
                        callback(null, replaced);
                    }
                });
            }
        });
    },

    getItem: function (itemId, callback) {
        var self = this;
        
        console.log(self.collection);

        var querySpec = {
            query: 'SELECT * FROM root r WHERE r.id=@id',
            parameters: [{
                name: '@id',
                value: itemId
            }]
        };

        self.client.queryDocuments(self.collection._self, querySpec).toArray(function (err, results) {
            if (err) {
                callback(err);

            } else {
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
    removeItem: function(itemId, callback) {
        
        var self = this;

        self.getItem(itemId, function (err, doc)
        {
            console.log(err);
            console.log(doc);
            if (err)
            {
                callback(err);
            }
            else
            {
                if (doc)
                {
                    self.client.deleteDocument(doc._self, doc, function (err, result) {
                        if (err) {
                            callback(err);
    
                        } else {
                            callback(null, result);
                        }
                    });
                }
                else
                {
                    callback(null);
                }

            }
        });
    }
};