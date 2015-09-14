var moment = require('moment');

var isRequireProcess = function(val)
{
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
            var functionInfo = rulesMap[prop];
            var executeNum = functionInfo.length;
            for (var exeIndex = 0; exeIndex < executeNum; exeIndex++)
            {
                var condition = null;
                if (functionInfo[exeIndex].hasOwnProperty("condition"))
                {
                    condition = functionInfo[exeIndex].condition;
                }
                console.log("validation executeas");
                console.log(functionInfo[exeIndex]);
                console.log(condition);
                var result = functionInfo[exeIndex].func(parameters[prop], condition);
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
 * @param {mixed} val 値
 * @return {bool} 
 */
Validator.prototype.isRequire = function(val)
{
    console.log("isRequire:" + val);
    return isRequireProcess(val);
};

/**
 * 指定の値が存在している場合は必須チェックをする
 * 
 * @method isRequire
 * @param {mixed} val 値
 * @return {bool} 
 */
Validator.prototype.isRequireIfExistsProp = function(val)
{
    console.log("isRequireIfExistsProp:" + val);
    if (void 0 === val)
    {
        return true;
    }
    return isRequireProcess(val);
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

/**
 * 最大値を超えていないかをチェックする
 * 
 * @method isNotMaxOrver
 * @param {mixed} val 値
 * @param {object} condition 条件を格納したオブジェクト
 *  @param {object} condition.max 最大値
 * @return {bool} 
 */
Validator.prototype.isNotMaxOrver = function(val, condition)
{
    console.log("isMaxOrver:" + val);
    var type = typeof(val);
    if ("string" === type)
    {
        return 0 < val.replace(/^[\s　]+|[\s　]+$/g, "").length;
    }
    else if ("number" === type)
    {
        return val < condition.max;
    }
    else
    {
        return false;
    }
};

/**
 * プロパティ数をチェックする
 * 
 * @method isMatchPropNum
 * @param {Object} val 値
 * @param {object} condition 条件を格納したオブジェクト
 *  @param {object} condition.num プロパティ数
 * @return {bool} 
 */
Validator.prototype.isMatchPropNum = function(val, condition)
{
    console.log("isMatchPropNum:" + val);
    if ("object" === typeof(val))
    {
        return Object.keys(val).length === condition.num;
    }
    else
    {
        return false;
    }
};

/**
 * プロパティ名をチェックする
 * TODO
 * @method isMatchPropList
 * @param {Array} propList 値
 * @param {object} condition 条件を格納したオブジェクト
 *  @param {object} condition.num プロパティ数
 * @return {bool} 
 */
Validator.prototype.isMatchPropList = function(val, condition)
{
    console.log("isMatchPropList:" + val);
    if ("object" === typeof(val))
    {
        Object.keys(condition).forEach(function(key)
        {
            if (!val.hasOwnProperty(key))
            {
                return false;
            }
            else
            {
                var paramNum = Object.keys(condition[key]).length;
                if (0 === paramNum)
                {
                    //チェックメソッドがなければtrue
                    return true;
                }
                
                for (var index = 0; index < paramNum; index++)
                {
                    var conditionParam = null;
                    if (condition[key][index].hasOwnProperty("condition"))
                    {
                        conditionParam = condition[key][index].condition;
                    }
                    console.log(key);
                    console.log(condition[key]);
                    var result = condition[key][index].func(val[key], conditionParam);
                    if (!result) return false;
                }
            }
        });
        return true;
    }
    else
    {
        return false;
    }
};

/**
 * 指定された値かチェックする
 * TODO
 * @method isMatchValueList
 * @param {String | Number} val 値
 * @param {Array} condition 条件を格納したオブジェクト
 *  @param {object} condition.num プロパティ数
 * @return {bool} 
 */
Validator.prototype.isMatchValueList = function(val, condition)
{
    console.log("isMatchValueList:" + val);
    if (void 0 === val || void 0 === condition)
    {
        return false;
    }
    
    var num = condition.length;
    for (var index = 0; index < num; index++)
    {
        if (condition[index] === val)
        {
            return true;
        }
    }
    return false;
};