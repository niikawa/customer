var Core = require('./core');
var Message = require('../config/message.json');
var logger = require("../helper/logger");

/** 
 * テーブル名
 * @property TABLE_NAME
 * @type {string}
 * @final
 */
var TABLE_NAME = 'T_TAG';
/** 
 * 主キー名 
 * @property PK_NAME
 * @type {string}
 * @final
 */
var PK_NAME = 'tag_id';
/** 
 * SEQ名
 * @property SEQ_NAME
 * @type {string}
 * @final
 */
var SEQ_NAME = 'seq_tag';

/** 
 * タグ機能APIのクラス
 * 
 * @namespace api
 * @class Tag
 * @constructor
 * @extends api.core
 */
var Tag = function Tag()
{
    Core.call(this, TABLE_NAME, PK_NAME, SEQ_NAME);
    
};

//coreModelを継承する
var util = require('util');
util.inherits(Tag, Core);

var model = new Tag();

/**
 * 全てのタグを取得する
 * 
 * @method getAll
 * @param {Function} callback リクエストオブジェクト
 * @return 
 */
exports.getAll = function(callback)
{
    var request = model.getRequest();

    var col = "tag_id, tag_name";
    var where = "delete_flag = 0";
    var qObj = model.getQueryObject(col, TABLE_NAME, where, '', '');
    model.select(qObj, request, function(err, data)
    {
        callback(err, data);
    });
};

/**
 * タグを保存する
 * 
 * @method save
 * @param {Objet} transaction トランザクション
 * @param {Number} userId ユーザーID
 * @param {Array} tagList タグリスト
 * @param {Function} mainCallback コールバック
 * @return 
 */
exports.save = function(transaction, userId, tagList, mainCallback)
{
    var commonColumns = model.getInsCommonColumns(userId);

    model.async.forEach(tagList, function(item, callback)
    {
        if (!item.hasOwnProperty('tag_id'))
        {
            if (item.hasOwnProperty('tag_name'))
            {
                var tagName = item.tag_name.trim();
                model.async.waterfall(
                [
                    function(callback)
                    {
                        var request = model.getRequest(transaction);
                        request.input('tag_name', model.db.NVarChar, tagName);
                        
                        var col = "tag_id";
                        var where = "tag_name = @tag_name AND delete_flag = 0";
                        var qObj = model.getQueryObject(col, TABLE_NAME, where, '', '');
                        model.select(qObj, request, function(err, data)
                        {
                            callback(err, data);
                        });
                    },
                    function(data, callback)
                    {
                        if (0 < data.length)
                        {
                            item.tag_id = data[0].tag_id;
                            callback(null);
                        }
                        else
                        {
                            var insertData = model.merge(commonColumns, {tag_name: tagName});

                            var request = model.getRequest(transaction);
                            request.input('delete_flag', model.db.SmallInt, insertData.delete_flag);
                            request.input('create_by', model.db.Int, insertData.create_by);
                            request.input('create_date', model.db.NVarChar, insertData.create_date);
                            request.input('update_by', model.db.Int, insertData.update_by);
                            request.input('update_date', model.db.NVarChar, insertData.update_date);
                            request.input('tag_name', model.db.NVarChar, insertData.tag_name);
                            
                            model.insert(TABLE_NAME, insertData, request, function(err, id)
                            {
                                item.tag_id = id;
                                callback(err);
                            });
                        }
                    }
                ],
                function(err)
                {
                    callback(err);
                });
            }
            else
            {
              callback(null);
            }
        }
        else
        {
            callback(null);
        }
    },
    function(err)
    {
        //タグが存在しない場合は、err情報を設定していないのでundefinedになるためnullに変換
        var errInfo = void 0 === err ? null : err;
        mainCallback(errInfo, tagList);
    });
};
