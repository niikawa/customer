var async = require('async');
var request = require('request');
var azure = require('../config/azure.json');
console.log(azure);


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
    console.log(req.body.id);
    var param = {
          "Inputs": {
            "input1": {
              "ColumnNames": [
                "user_id"
              ],
              "Values": [
                [
                  req.body.id
                ],
              ]
            }
          },
          "GlobalParameters": {}
        };
    var options = getOptions('recomender', param);
    request.post(options, function(error, response, body)
    {
      if (!error && response.statusCode == 200)
      {
        res.json({data: body.name});
      }
      else
      {
        console.log('error: '+ response.statusCode);
        res.json({data: ''});
      }
    });
};
