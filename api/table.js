exports.getTables = function(req, res)
{
    var table = require('../config/table.json');
    res.json({data: table});
};
