var async = require('async');
var DocumentDBClient = require('documentdb').DocumentClient;
var query = require('../collection/query');

var docDbClient = new DocumentDBClient('https://ixcpm.documents.azure.com:443/', {
    masterKey: 'BAVJ6Lb3xefcLJVh7iShAAngAHrYC08mtTj2ieVIVXuoBkftXwxKSCJaOcNrvctBwhi6oFoG6GlDVrDiDyXOzg=='
});
var Query = new query(docDbClient, 'ixcpm', 'cpm');
Query.init();

exports.addItem = function(req, res)
{
    console.log('api query param');
    console.log(req.body);
    
    if (!req.session.isLogin) {
        
        res.status(511).send('Authentication Succsess');
    }

    Query.addItem(req.body.sql, function(err)
    {
        if (err) {
            
            res.status(511).send('access ng');
            
        } else {
            
            res.status(200).send('create query succsess');
        }
    });
};


