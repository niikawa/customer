module.exports = function getConfig(env)
{
    if ('dev' === env)
    {
        
    }
    else if ('production' === env)
    {
        return {
                user: 'vxc-databese-master',
                password: 'VirtUaleX001',
                server: 'oufq8kwys5.database.windows.net',
                database: 'CustomerReport',
                stream: true,
                options: {encrypt: true}
            };
    } 
    else if ('aws' === env)
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
};
