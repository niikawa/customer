var DocumentDBClient = require('documentdb').DocumentClient;
var docdbUtils = require('./docdbUtils');

function Segment(documentDBClient, databaseId, collectionId) {
  this.client = documentDBClient;
  this.databaseId = databaseId;
  this.collectionId = collectionId;

  this.database = null;
  this.collection = null;
}

module.exports = Segment;

Segment.prototype = {
    init: function (callback)
    {
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

    find: function (querySpec, callback)
    {
        var self = this;

        self.client.queryDocuments(self.collection._self, querySpec).toArray(function (err, results) {
            if (err) {
                callback(err);

            } else {
                callback(null, results);
            }
        });
    },

    addItem: function (item, callback)
    {
        var self = this;
        
        var data = {
            segment_name: item.segment_name,
            condition: item.condition,
            whereList: item.whereList,
            qIds: item.qIds,
        };

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

        self.getItem(data.segment_document_id, function (err, doc) {
            if (err) {
                callback(err);

            } else {
                
                doc.segment_name = data.segment_name;
                doc.condition = data.condition;
                doc.whereList = data.whereList;
                doc.qIds = data.qIds;
                
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
    getItem: function (itemId, callback)
    {
        var self = this;

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
    countByQueryId: function (itemId, callback)
    {
        var self = this;

        var querySpec = {
//            query: 'SELECT c.id, c.segment_name FROM c WHERE c.qIds IN ([@id])',
            query: "SELECT c.id FROM c IN segment.qIds where c = @id",
            parameters: [{
                name: '@id',
                value: itemId
            }]
        };
        
        self.client.queryDocuments(self.collection._self, querySpec).toArray(function (err, results) {
            if (err) {
                callback(err);

            } else {
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
                // if (doc)
                if (void 0 === doc)
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
                    callback(err);
                }
            }
        });
    }
};