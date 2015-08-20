var azureStorage = require('azure-storage');
var blobService = azureStorage.createBlobService();
var async = require('async');
var fs = require('fs');

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
 *                      localFileName
 */
exports.uploadStorage = function(uploadInfo, mainCallback)
{
    async.waterfall(
    [
        function(callback)
        {
            blobService.createContainerIfNotExists(uploadInfo.containerName, {publicAccessLevel : 'blob'}, function(error, result, response)
            {
                console.log("createContainerIfNotExists result");
                console.log(error);
                console.log(result);
                console.log(response);
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
        
        function(callback)
        {
            blobService.createBlockBlobFromLocalFile(uploadInfo.containerName, uploadInfo.localFileName, uploadInfo.uploadName, function(error, result, response)
            {
                if(!error)
                {
                    callback(null);
                }
                else
                {
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

/**
 * azure blob storageからダウンロードを行う
 * 
 * @param {object} uploadInfo パラメータ
 *                      containerName
 *                      blobName
 *                      dowloadName
 */
exports.downLoadStorage = function(downLoadInfo, mainCallback)
{
    async.waterfall(
    [
        function(callback)
        {
            blobService.createContainerIfNotExists(downLoadInfo.containerName, {publicAccessLevel : 'blob'}, function(error, result, response)
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
        
        function(callback)
        {
            console.log("getBlobToStream execute");
            blobService.getBlobToStream(downLoadInfo.containerName, downLoadInfo.blobName, fs.createWriteStream(downLoadInfo.dowloadName), function(error, result, response)
            {
                console.log("getBlobToStream result");
                console.log(result);
                console.log(response);
                if(!error)
                {
                    callback(null);
                }
                else
                {
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
