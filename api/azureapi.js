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
        uri: azure[type].url,
        form: JSON.stringify(param),
        headers: {
          'content-type': 'application/json',
          'Authorization': 'bearer ' + azure[type].key
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
    var param = {
          "Inputs": {
            "input1": {
              "ColumnNames": [
                "user_id"
              ],
              "Values": [
                [
                  req.params.id
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
          console.log('body data: ');
          var data = JSON.parse(body);
          console.log(body.Results);
          res.json({data: data.Results.output1.value.Values});
      }
      else
      {
        console.log('error: '+ error);
        res.json({data: ''});
      }
    });
};
