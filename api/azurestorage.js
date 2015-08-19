var azureStorage = require('azure-storage');
var blobService = azureStorage.createBlobService();
var async = require('async');


//======================================================
// azure storage sdk を利用してstorage操作を行う
//======================================================

function createContainerIfNotExists(containerName)
{
    blobService.createContainerIfNotExists(containerName, {publicAccessLevel : 'blob'}, function(error, result, response)
    {
        if(!error)
        {
        // if result = true, container was created.
        // if result = false, container already existed.
        }
    });    
}

exports.createContainer = function(containerName, callback)
{
    console.log("execute createContainerIfNotExists ");
    blobService.createContainerIfNotExists(containerName, {publicAccessLevel : 'blob'}, function(error, result, response)
    {
        callback(error, result, response);
    });    
};

/**
 * azure blob storageへアップロードを行う。
 * 
 * @param {object} uploadInfo パラメータ
 *                      containerName
 *                      uploadName
 *                      data
 */
exports.uploadStorage = function(uploadInfo, mainCallback)
{
    async.waterfall(
    [
        function(callback)
        {
            blobService.createBlockBlobFromLocalFile(uploadInfo.containerName, uploadInfo.data, uploadInfo.uploadName, function(error, result, response)
            {
                if(!error)
                {
                    callback(null);
                }
                else
                {
                    console.log("createBlockBlobFromLocalFile error");
                    callback(error);
                }
            });
        },
    ], function(err)
    {
        if (err)
        {
            console.log(err);
        }
        mainCallback(err);
    });
};
