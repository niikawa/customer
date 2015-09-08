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
    if (void 0 ===  rulesMap || void 0 === parameters)
    {
        //
        return true;
    }
    
    var paramNum = Object.keys(parameters);
    if (0 === paramNum)
    {
        return false;
    }
    
    Object.keys(parameters).forEach(function(prop)
    {
        var re = rulesMap[prop](parameters[prop]);
        
    });
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
 * 数値チェック
 * 
 * @method isRequire
 * @param {mixed} val 値
 * @return {bool} 
 */
Validator.prototype.isNumber = function(val)
{
    return isFinite(val);
};