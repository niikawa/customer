exports.getTables = function(req, res)
{
    var table = require('../config/table.json');
    return {data: table};
};
