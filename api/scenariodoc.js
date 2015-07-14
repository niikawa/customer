var async = require('async');
var DocumentDBClient = require('documentdb').DocumentClient;
var scenario = require('../collection/scenario');

var docDbClient = new DocumentDBClient('https://ixcpm.documents.azure.com:443/', {
    masterKey: 'BAVJ6Lb3xefcLJVh7iShAAngAHrYC08mtTj2ieVIVXuoBkftXwxKSCJaOcNrvctBwhi6oFoG6GlDVrDiDyXOzg=='
});
var Scenario = new scenario(docDbClient, 'ixcpm', 'scenario');
Scenario.init();

exports.getItem = function(req, res)
{
    var query = 'SELECT * FROM doc';
    
    Scenario.find(query, function(err, doc)
    {
        if (err) {
            
            res.status(511).send('access ng');
            
        } else {
            
            res.json({data: doc});
        }
    });
};

exports.saveItem = function(req, res)
{
    if (!req.session.isLogin) {
        
        res.status(511).send('authentication faild');
    }
    
    if (void 0 === req.body.data)
    {
        res.status(511).send('parameters not found');
    }
    
    var isCreate = 
    
        (void 0 === req.body.data.segment_document_id || '' === req.body.data.segment_document_id);
    
    if (isCreate)
    {
        Scenario.addItem(req.body.data, function(err, doc)
        {
            if (err)
            {
                console.log('document create faild');
                console.log(err);
                res.status(511).send('document create faild');
            }
            else
            {
                res.json({data: doc});
            }
        });
    }
    else
    {
        Scenario.updateItem(req.body.data, function(err, doc)
        {
            if (err)
            {
                console.log('document update faild');
                console.log(err);
            }
            else
            {
                res.json({data: doc});
            }
        });
    }
};

exports.getItemByIdForWeb = function(id, callback)
{
    if (null === id)
    {
        callback(null, null);
    }
    else
    {
        Scenario.getItem(id, function(err, doc)
        {
            callback(err, doc);
        });
    }
};

exports.saveItemForWeb = function(isCrate ,parameters, callback)
{
    if (void 0 === parameters)
    {
        callback(null, null);
    }
    else
    {
        if (isCrate)
        {
            Scenario.addItem(parameters, callback);
        }
        else
        {
            Scenario.updateItem(parameters, callback);
        }
    }
};

exports.removeItemForWeb = function(id, callback)
{
    Scenario.removeItem(id, function(err, doc)
    {
        callback(err, doc);
    });
};

