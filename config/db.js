module.exports = function()
{
    if ('demo' === process.env.ENVIRONMENT)
    {
        return {
            user: 'vxc-databese-master',
            password: 'VirtUaleX001',
            server: 'oufq8kwys5.database.windows.net',
            database: 'CustomerReport',
            stream: true, 
            options: { encrypt: true, connectTimeout: 30000, requestTimeout: 30000},
            pool:
            {
                max: 10,
                min: 1,
                idleTimeoutMillis: 50000
            },
            connectionTimeout: 30000,
            requestTimeout: 30000
        };
    }
    if ('develop' === process.env.ENVIRONMENT)
    {
        return {
            user: 'vxc-databese-master',
            password: 'VirtUaleX001',
            server: 'oufq8kwys5.database.windows.net',
            database: 'CustomerReport',
            stream: true, 
            options: { encrypt: true, connectTimeout: 30000, requestTimeout: 30000},
            pool:
            {
                max: 10,
                min: 1,
                idleTimeoutMillis: 50000
            },
            connectionTimeout: 30000,
            requestTimeout: 30000
        };
    }
    if ('stage' === process.env.ENVIRONMENT)
    {
        return {
            user: 'vxc-databese-master',
            password: 'VirtUaleX001',
            server: 'oufq8kwys5.database.windows.net',
            database: 'CustomerReport',
            stream: true, 
            options: { encrypt: true, connectTimeout: 30000, requestTimeout: 30000},
            pool:
            {
                max: 10,
                min: 1,
                idleTimeoutMillis: 50000
            },
            connectionTimeout: 30000,
            requestTimeout: 30000
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
            },
            connectionTimeout: 30000,
            requestTimeout: 30000
        };
    }
};
