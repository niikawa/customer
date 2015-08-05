var Core = require('./core');

/** テーブル名 */
var tableName = 'M_ENVIRONMENT';
/** PK */
var pk = 'environment_id';
/** SEQ */
var seqName = 'seq_environment';

var environment = function environment()
{
    Core.call(this, tableName, pk, seqName);
};

//coreModelを継承する
var util = require('util');
util.inherits(environment, Core);

var model = new environment();

exports.get = function(callback)
{
    model.getAll(callback);
};

