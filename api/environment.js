var Core = require('./core');

/** 
 * テーブル名
 * @property TABLE_NAME
 * @type {string}
 * @final
 */
var TABLE_NAME = 'M_ENVIRONMENT';
/** 
 * 主キー名 
 * @property PK_NAME
 * @type {string}
 * @final
 */
var PK_NAME = 'environment_id';
/** 
 * SEQ名
 * @property SEQ_NAME
 * @type {string}
 * @final
 */
var SEQ_NAME = 'seq_environment';

/** 
 * 環境情報のAPIのクラス
 * 
 * @namespace api
 * @class Environment
 * @constructor
 * @extends api.core
 */
var Environment = function Environment()
{
    Core.call(this, TABLE_NAME, PK_NAME, SEQ_NAME);
};

//coreModelを継承する
var util = require('util');
util.inherits(Environment, Core);

var model = new Environment();

/**
 * 環境情報を取得する
 * 
 * @method get
 * @param {Function} callback コールバック
 * @example 
 * emv.get(function(err, data)<br>
 * { <br>
 *     //err is array<br>
 *     if (null === err )<br>
 *     {<br> 
 *         //error時の処理<br>
 *     }<br>
 *     //data[0]で取得データにアクセスできる<br>
 * });<br>
 */
exports.get = function(callback)
{
    model.getAll(function(err, data)
    {
        callback(err, data);
    });
};

