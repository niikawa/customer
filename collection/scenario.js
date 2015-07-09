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
    init: function (callback) {
        var self = this;

        docdbUtils.getOrCreateDatabase(self.client, self.databaseId, function (err, db) {
            if (err) {
                callback(err);

            } else {
                self.database = db;
                docdbUtils.getOrCreateCollection(self.client, self.database._self, self.collectionId, function (err, coll) {
                    if (err) {
                        callback(err);

                    } else {
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

    addItem: function (item, callback) {
        var self = this;
        
        var data = item;

        self.client.createDocument(self.collection._self, data, function (err, doc) {
            if (err) {
                callback(err);

            } else {
                callback(null, doc);
            }
        });
    },

    updateItem: function (data, callback)
    {
        var self = this;

        self.getItem(data.id, function (err, doc) {
            if (err) {
                callback(err);

            } else {
                
                doc.action_name = data.actionName;
                doc.conditionList = data.conditionList;

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
    removeItem: function(itemId, callback) {
        
        var self = this;

        self.getItem(itemId, function (err, doc) {
            if (err) {
                callback(err);

            } else {
                
                if (doc )

                self.client.deleteDocument(doc._self, doc, function (err, result) {
                    if (err) {
                        callback(err);

                    } else {
                        callback(null, result);
                    }
                });
            }
        });
    }
};