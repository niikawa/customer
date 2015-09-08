var azureStorage = require('azure-storage');
var blobService = azureStorage.createBlobService();
var async = require('async');
var fs = require('fs');

/**
 * azure storage sdk を利用してstorage操作を行うAPI
 * 
 * @namespace api
 * @static
 */

/**
 * azure storage コンテナーを作成する
 * 
 * @method createContainer
 * @param {string} containerName 実行対象メソッド名
 * @param {Functon} callback コールバック 
 */
exports.createContainer = function(containerName, callback)
{
    blobService.createContainerIfNotExists(containerName, {publicAccessLevel : 'blob'}, function(error, result, response)
    {
        callback(error, result, response);
    });    
};

/**
 * azure blob storageへアップロードを行う。
 * 
 * @param {Object} uploadInfo アップロード情報
 *  @param {Functon} uploadInfo.containerName アップロード先コンテナ名
 *  @param {Functon} uploadInfo.uploadName コンテナへアップロードする際のファイル名
 *  @param {Functon} uploadInfo.localFileName アップロード対象のファイル名
 * @param {Functon} mainCallback コールバック 
 */
exports.uploadStorage = function(uploadInfo, mainCallback)
{
    async.waterfall(
    [
        function(callback)
        {
            blobService.createContainerIfNotExists(uploadInfo.containerName, 
                {publicAccessLevel : 'blob'}, function(error, result, response)
            {
                console.log("createContainerIfNotExists result");
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
        
        function(callback)
        {
            blobService.createBlockBlobFromLocalFile(uploadInfo.containerName, 
                uploadInfo.localFileName, uploadInfo.uploadName, function(error, result, response)
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
 * azure blob storageからダウンロードを行う。
 * 
 * @param {Object} downLoadInfo ダウンロード情報
 *  @param {Functon} uploadInfo.containerName アップロード先コンテナ名
 *  @param {Functon} uploadInfo.blobName コンテナに格納されているファイル名
 *  @param {Functon} uploadInfo.dowloadName ダウンロード時のファイル名
 * @param {Functon} mainCallback コールバック 
 */
exports.downLoadStorage = function(downLoadInfo, mainCallback)
{
    async.waterfall(
    [
        function(callback)
        {
            blobService.createContainerIfNotExists(downLoadInfo.containerName, 
                {publicAccessLevel : 'blob'}, function(error, result, response)
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
        
        function(callback)
        {
            blobService.getBlobToStream(downLoadInfo.containerName, 
                downLoadInfo.blobName, fs.createWriteStream(downLoadInfo.dowloadName), function(error, result, response)
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
