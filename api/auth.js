var crypto = require('crypto');
var Core = require('./core');

/** 
 * テーブル名
 * @property TABLE_NAME
 * @type {string}
 * @final
 */
var TABLE_NAME = 'M_USER';
/** 
 * 主キー名 
 * @property PK_NAME
 * @type {string}
 * @final
 */
var PK_NAME = 'user_id';
/** 
 * 機能番号
 * @property FUNCTION_NAME
 * @type {Number}
 * @final
 */
var FUNCTION_NUMBER = 2;

/** 
 * 認証機能APIのクラス
 * 
 * @namespace api
 * @class Auth
 * @constructor
 * @extends api.core
 */
var Auth = function Auth()
{
    Core.call(this, TABLE_NAME, PK_NAME);
};

//coreModelを継承する
var util = require('util');
util.inherits(Auth, Core);

var model = new Auth();

/**
 * ログイン状態かを判定する
 * 
 * @method isLogin
 * @param {Object} req 画面からのリクエスト
 * @param {Object} res 画面へのレスポンス
 * @return {json | status code 511}
 * ログイン状態の場合、以下のプロパティを持つオブジェクトをJsonで返却する
 * <ul>
 * <li>user_id: ユーザーID</li>
 * <li>name: ユーザー名</li>
 * <li>role_id: ロールID</li>
 * </ul>
 */
exports.isLogin = function(req, res)
{
    if (req.session.isLogin)
    {
        var data = {
            user_id: req.session.userId,
            name: req.session.userName, 
            role_id: req.session.roleId,
        };
        res.json({data: data});
    }
    else
    {
        res.status(511).send('not login');
    }
};

/**
 * リクエストを受け取り、ログインを行う.
 * 
 * @method login
 * @param {Object} req 画面からのリクエスト
 *  @param {object} req.body POSTされたパラメータを格納したオブジェクト
 *   @param {Number} req.body.mailAddress メールアドレス
 *   @param {Number} req.body.password パスワード
 * @param {Object} res 画面へのレスポンス
 * @return {json | status code 511}
 * ログイン状態の場合、以下のプロパティを持つオブジェクトをJsonで返却する
 * <ul>
 * <li>user_id: ユーザーID</li>
 * <li>name: ユーザー名</li>
 * <li>role_id: ロールID</li>
 * </ul>
 */
exports.login = function(req, res)
{
    var table = 'M_USER T1 ';
    var col = ' T1.user_id, T1.name, T1.role_id';
    var where = ' T1.delete_flag = 0 AND mailaddress =@mailaddress AND password =@password';
    var qObj = model.getQueryObject(col, table, where, '', '');
    
    qObj.request.input('mailaddress', model.db.VarChar, req.body.mailAddress);
    qObj.request.input('password', model.db.NVarChar, crypto.createHash('md5').update(req.body.password).digest("hex"));

    model.select(qObj, qObj.request,  function(err, data)
    {
        if (err.length > 0 || 0 === data.length )
        {
            console.log(err);
            res.status(510).send('メールアドレスまたはパスワードに誤りがあります');
        }
        else
        {
            var userId = data[0].user_id;
            model.insertLog(userId, 1);
            req.session.isLogin = true;
            req.session.userId = userId;
            req.session.userName = data[0].name;
            req.session.roleId = data[0].role_id;
            res.json({data: data});
        }
    });
};

/**
 * セッションを破棄してログアウト状態を作り出す
 * 
 * @method login
 * @param {Object} req 画面からのリクエスト
 * @param {Object} res 画面へのレスポンス
 */
exports.logout = function(req, res)
{
    model.insertLog(req.session.userId, FUNCTION_NUMBER);
    delete req.session.isLogin;
    delete req.session.userId;
    delete req.session.userName;
    res.status(200).send('ログアウトしました');
};