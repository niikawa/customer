var momoent = require('moment');
var conf = require('../config/logger.json');
var azureStorage = require('azure-storage');
var TableUtilities = azureStorage.TableUtilities;
var eg = TableUtilities.entityGenerator;

var tableName = 'applog';
var tableService = azureStorage.createTableService();


exports.debug = function(message, req)
{
    if (2 > conf.LEVEL)
    {
        write("DEBUG", message, req);
    }
};

exports.warn = function(message, req)
{
    if (3 > conf.LEVEL)
    {
        write("WARN", message, req);
    }
};

exports.info = function(message, req)
{
    if (4 > conf.LEVEL)
    {
        write("INFO", message, req);
    }
};

exports.error = function(message, req, err)
{
    write("ERROR", message, req, err);
};

function write(level, message, req, err)
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
    else
    {
        request = req;
    }
    
    var errInfo = void 0 === err ? "" : err;
    var entity = 
    {
        PartitionKey: eg.String(momoent().format("YYYYMMDD")),
        RowKey: eg.String(momoent().format("YYYYMMDDhhmmss")+req.session.userId),
        level: eg.String(level),
        userId: eg.String(req.session.userId),
        userName: eg.String(req.session.userName),
        message: eg.String(message),
        params: eg.String(JSON.stringify(request)),
        error: eg.String(errInfo),
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
