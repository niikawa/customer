var crypto = require('crypto');
var async = require('async');
var Core = require('./core');
var moment = require("moment");
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
        
        res.status(511).send('Authentication Failed');
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
        if (err.length > 0 || 0 === data.length )
        {
            res.status(510).send('メールアドレスまたはパスワードに誤りがあります');
        }
        else
        {
            console.log('login');
            console.log(data);
            var userId = data[0].user_id;
            var sql = "INSERT INTO T_LOG (delete_flag, create_by, create_date, update_by, update_date, user_id, show_flag, control_type, detail)";
            sql += " VALUES (@delete_flag, @create_by, @create_date, @update_by, @update_date, @user_id, @show_flag, @control_type, @detail)";
            var request = model.getRequest();
            request.input('delete_flag', model.db.SmallInt, 0);
            request.input('create_by', model.db.Int, userId);
            request.input('create_date', model.db.NVarChar, moment().format('YYYY/MM/DD hh:mm:ss'));
            request.input('update_by', model.db.Int, userId);
            request.input('update_date', model.db.NVarChar, moment().format('YYYY/MM/DD hh:mm:ss'));
            request.input('user_id', model.db.Int, userId);
            request.input('control_type', model.db.Int, 1);
            request.input('detail', model.db.NVarChar, 'ログインしました');
            model.execute(sql, request, function(err, ret)
            {
                console.log(ret);
                console.log(err);
            });
            req.session.isLogin = true;
            req.session.user_id = userId;
            res.json({data: data});
        }
    });
};
