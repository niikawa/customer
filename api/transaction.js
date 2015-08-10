var mssql = require('mssql');
var config = {
  user: 'vxc-databese-master',
  password: 'VirtUaleX001',
  server: 'oufq8kwys5.database.windows.net',
  database: 'CustomerReport',
  stream: true, // You can enable streaming globally

  options: {
    encrypt: true // Use this if you're on Windows Azure
  }
};

var connection = function connection()
{
  var connection = new mssql.Connection(config);
  connection.connect(function(err)
  {
    if (err)
    {
      
    }
  });
  
};
