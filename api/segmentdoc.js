var async = require('async');
var DocumentDBClient = require('documentdb').DocumentClient;
var query = require('../collection/segment');

var docDbClient = new DocumentDBClient('https://ixcpm.documents.azure.com:443/', {
    masterKey: 'BAVJ6Lb3xefcLJVh7iShAAngAHrYC08mtTj2ieVIVXuoBkftXwxKSCJaOcNrvctBwhi6oFoG6GlDVrDiDyXOzg=='
});
var Segment = new query(docDbClient, 'ixcpm', 'segment');
Segment.init();

exports.getItem = function(req, res)
{
    var query = 'SELECT * FROM doc';
    
    Segment.find(query, function(err, doc)
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
        Segment.addItem(req.body.data, function(err, doc)
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
        Segment.updateItem(req.body.data, function(err, doc)
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
    Segment.getItem(id, function(err, doc)
    {
        callback(err, doc);
    });
};

exports.removeItemForWeb = function(id, callback)
{
    Segment.getItem(id, function(err, doc)
    {
        callback(err, doc);
    });
};

