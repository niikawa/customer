module.exports = function()
{
    if ('develop' === process.env.ENVIRONMENT)
    {
        return {
          user: 'vxc-databese-master',
          password: 'VirtUaleX001',
          server: 'oufq8kwys5.database.windows.net',
          database: 'CustomerReport',
          stream: true, 
          options: { encrypt: true },
          pool:
          {
                max: 10,
                min: 1,
                idleTimeoutMillis: 50000
            }  
        };
    }
    if ('stage' === process.env.ENVIRONMENT)
    {
        return {
          user: 'vxc-databese-master',
          password: 'VirtUaleX001',
          server: 'a9kl4a5stz.database.windows.net',
          database: 'NewRiverTest',
          stream: true, 
          options: { encrypt: true },
          pool:
          {
                max: 10,
                min: 1,
                idleTimeoutMillis: 50000
            }  
        };
    }
    else if ('production' === process.env.ENVIRONMENT)
    {
        return {
          user: 'vxc-databese-master',
          password: 'VirtUaleX001',
          server: 'oufq8kwys5.database.windows.net',
          database: 'CustomerReport',
          stream: true, 
          options: { encrypt: true },
          pool:
          {
                max: 20,
                min: 1,
                idleTimeoutMillis: 50000
            }  
        };
    }
    else if ('aws' === process.env.ENVIRONMENTenv)
    {
        return {
                user: 'databese_master',
                password: 'VirtUaleX001',
                server: 'customerreport.c6ykdlikt0mb.ap-northeast-1.rds.amazonaws.com',
                databese: 'customerreport',
                stream: true,
                options: {encrypt: false }
            };
    }
    else
    {
        //デフォルト
        return {
          user: 'vxc-databese-master',
          password: 'VirtUaleX001',
          server: 'oufq8kwys5.database.windows.net',
          database: 'CustomerReport',
          stream: true, 
          options: { encrypt: true },
          pool:
          {
                max: 10,
                min: 1,
                idleTimeoutMillis: 50000
            }  
        };
    }
};
