var momoent = require('moment');
var conf = require('../config/logger.json');
var azureStorage = require('azure-storage');
var TableUtilities = azureStorage.TableUtilities;
var eg = TableUtilities.entityGenerator;

var tableName = 'query';
var tableService = azureStorage.createTableService();

exports.write = function(req)
{
    var request = "";
    if (req.hasOwnProperty("body"))
    {
        request = req.body;
    }
    else if (req.hasOwnProperty("params"))
    {
        request = req.params;
    }
    
    var entity = 
    {
        PartitionKey: eg.String(request.queryName),
        RowKey: eg.String(momoent().format("YYYYMMDDhhmmss")+req.session.userId),
        where: eg.String(request.query),
        bindInfo: eg.String(JSON.stringify(request.bindInfo)),
        uiInfo: eg.String("")
    };

    tableService.createTableIfNotExists(tableName, function(error, result, response)
    {
        if(!error)
        {
            tableService.insertEntity(tableName, entity, function (error)
            {
                if (error)
                {
                    console.log(error);
                }
            });
        }
    });
}
