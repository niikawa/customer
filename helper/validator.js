var moment = require('moment');

/** 
 * バリデーションのヘルパークラス
 * 
 * @namespace helper
 * @class Validator
 * @constructor
 */
var Validator = function Validator()
{
};
module.exports = Validator;

/**
 * バリデーションを実行する
 * 
 * @method isRequire
 * @param {Object} rulesMap チェック内容を格納したオブジェクト
 * @param {Object} parameters チェック対象パラメータ
 * @return {bool} 
 */
Validator.prototype.execute = function(rulesMap, parameters)
{
    //パラメータが存在しなかったらスルーする
    if (void 0 === rulesMap || void 0 === parameters)
    {
        return true;
    }
    
    var paramKeys = Object.keys(parameters);
    var paramNum = paramKeys.length;
    if (0 === paramNum)
    {
        return false;
    }
    
    for (var index = 0; index < paramNum; index++)
    {
        var prop = paramKeys[index];
        if ( rulesMap.hasOwnProperty(prop) )
        {
            var executeFunction = rulesMap[prop];
            var executeNum = executeFunction.length;
            for (var exeIndex = 0; exeIndex < executeNum; exeIndex++)
            {
                var result = rulesMap[prop][exeIndex].func(parameters[prop]);
                if (!result) return false;
            }
        }
    }
    return true;
};

/**
 * 必須チェック
 * 
 * @method isRequire
 * @param {string | Number | bool} val 値
 * @return {bool} 
 */
Validator.prototype.isRequire = function(val)
{
    console.log("isRequire:" + val);
    var type = typeof(val);
    if ("string" === type)
    {
        return void 0 !== val && 0 < val.replace(/^[\s　]+|[\s　]+$/g, "").length;
    }
    else if ("number" === type)
    {
        return isFinite(val);
    }
    else
    {
        return void 0 !== val;
    }
};

/**
 * 数値かチェック
 * 
 * @method isRequire
 * @param {mixed} val 値
 * @return {bool} 
 */
Validator.prototype.isNumber = function(val)
{
    console.log("isNumber:" + val);
    return isFinite(val);
};

/**
 * 有効な日付かチェック
 * 
 * @method isValidDate
 * @param {mixed} val 値
 * @return {bool} 
 */
Validator.prototype.isValidDate = function(val)
{
    console.log("isValidDate:" + val);
    var m = moment(val);
    return m.isValid();
};