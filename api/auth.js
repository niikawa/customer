var crypto = require('crypto');
var async = require('async');
var Core = require('./core');

/** テーブル名 */
var tableName = 'M_USER';
var pk = 'user_id';

var auth = function auth()
{
    Core.call(this, tableName, pk);
};

//coreModelを継承する
var util = require('util');
util.inherits(auth, Core);

var model = new auth();

/**
 * ログイン状態かを判定する
 * 
 * @author niikawa
 * @method isLogin
 * @param {Object} req 画面からのリクエスト
 * @param {Object} res 画面へのレスポンス
 */
exports.isLogin = function(req, res)
{
    if (req.session.isLogin) {
        
        res.status(200).send('Authentication Succsess');
        
    } else {
        
        if (req.body.autoId) {
            
            //自動ログイン
            
            //新しいトークンを生成
        }
        
        res.status(404).send('Authentication Failed');
    }
};

/**
 * リクエストを受け取り、ログインを行う.
 * 
 * @author niikawa
 * @method login
 * @param {Object} req 画面からのリクエスト
 * @param {Object} res 画面へのレスポンス
 */
exports.login = function(req, res)
{
    var table = 'M_USER T1 ';
    var col = ' T1.user_id ';
    var where = ' T1.delete_flag = 0 AND mailaddress = @mailaddress AND password = @password';
    var qObj = model.getQueryObject(col, table, where, '', '');
    
    qObj.request.input('mailaddress', model.db.VarChar, req.body.mailAddress);
//    qObj.request.input('password', model.db.NVarChar, crypto.createHash('md5').update(insertData.password).digest("hex"));
    qObj.request.input('password', model.db.NVarChar, req.body.password);

    model.select(qObj, qObj.request,  function(err, data)
    {
        if (err.length > 0 || data.length == 0)
        {
            res.status(509).send('メールアドレスまたはパスワードに誤りがあります');
        }
        res.json({data: data});
    });
};
