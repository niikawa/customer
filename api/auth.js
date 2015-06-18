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
    
};
