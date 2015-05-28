var async = require('async');
var request = require('request');
var azure = require('../config/azure.json');

//======================================================
// azure ml webサービスを呼び出す
//
//======================================================

function getOptions(type, param)
{
    return {
        uri: azure.type[0].uri,
        form: JSON.stringify(param),
        headers: {
          'content-type': 'application/json',
          'Authorization': 'bearer ' + azure.type[0].key
        },
        azure: true,
    };
}

/**
 * 顧客の情報を取得する
 * 
 * @param {Object} req 画面からのリクエスト
 * @param {Object} res 画面へのレスポンス
 */
exports.recommenderItem = function(req, res)
{
    
    
    var param = {};
    var options = getOptions('recomender', param);
    // var key = 'TwKosJWQXnOc4KZak2WKPnE0lyCjqQfmrVLgFTW20gH2UCmB9a0j66eSNU7GWH+8x4xVBEVhQi+gpJQr+AgENw==';
    // var options = {
    //   uri: 'https://ussouthcentral.services.azureml.net/workspaces/bb07a48a7dce4617b33d3a20dd4e2604/services/82d002728e7842f5828b114a21511835/execute?api-version=2.0&details=true',
    //   form: JSON.stringify(param),
    //   headers: {
    //       'content-type': 'application/json',   
    //       'Authorization': 'bearer ' + key
    //   },
    //   azure: true,
    // };
    
    request.post(options, function(error, response, body)
    {
      if (!error && response.statusCode == 200)
      {
          
          
      }
      else
      {
        console.log('error: '+ response.statusCode);
      }
    });
};
