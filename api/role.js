var Core = require('./core');
var Message = require('../config/message.json');
var Validator = require("../helper/validator");

/** 
 * テーブル名
 * @property TABLE_NAME
 * @type {string}
 * @final
 */
var TABLE_NAME = 'M_ROLE';
/** 
 * 主キー名 
 * @property PK_NAME
 * @type {string}
 * @final
 */
var PK_NAME = 'role_id';
/** 
 * SEQ名
 * @property SEQ_NAME
 * @type {string}
 * @final
 */
var SEQ_NAME = 'seq_role';

/** 
 * 役割機能APIのクラス
 * 
 * @namespace api
 * @class Role
 * @constructor
 */
var Role = function Role()
{
    Core.call(this, TABLE_NAME, PK_NAME, SEQ_NAME);
    this.validator = new Validator();
    this.parametersRulesMap = 
    {
        getById:
        {
            id:
            [
                {
                    func: this.validator.isRequire
                },
                {
                    func: this.validator.isNumber
                },
                {
                    func: this.validator.isNotMaxOrver,
                    condition: 9223372036854775807
                }
            ],
        }
    };
};

//coreModelを継承する
var util = require('util');
util.inherits(Role, Core);

/**
 * リクエストパラメータのチェックを行う
 * 
 * @method validation
 * @param {string} key 実行対象メソッド名
 * @param {Object} parameters チェック対象パラメータオブジェクト
 * @return {bool} 
 */
Role.prototype.validation = function(key ,parameters)
{
    var rules = this.parametersRulesMap[key];
    return this.validator.execute(rules, parameters);
};

var model = new Role();

/**
 * IDに合致した役割を取得する
 * 
 * @method getById
 * @param {Object} req 画面からのリクエスト
 * @param {Object} res 画面へのレスポンス
 */
exports.getById = function(req, res)
{
    if (!model.validation("getById", req.params))
    {
        console.log(model.appendUserInfoString(Message.COMMON.E_101, req).replace("$1", "[role.getById]"));
        res.status(511).send(Message.COMMON.E_101);
        return;
    }
    model.getById(req.params.id, function(err, data)
    {
        if (err)
        {
            console.log(err);
            //レスポンスコード確認
            res.json({data: data});
        }
        else
        {
            res.json({data: data});
        }
    });
};

/**
 * 役割の一覧を取得する
 * 
 * @param {Object} req 画面からのリクエスト
 * @param {Object} res 画面へのレスポンス
 */
exports.getAll = function(req, res)
{
    model.getAll(function(err, data)
    {
        if (err)
        {
            console.log(err);
            //レスポンスコード確認
            res.json({data: data});
        }
        else
        {
            res.json({data: data});
        }
    });
};
