/**
 * interceptors configration
 */
var myApp = angular.module('myApp');
myApp.config(
    function($httpProvider) 
    {
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;application/json;charset=utf-8';
        $httpProvider.defaults.useXDomain = true;
        $httpProvider.defaults.withCredentials = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    
        $httpProvider.interceptors.push
        (
            function ($q, Utility)
            {
                return {
                    request: function(config)
                    {
                        config.requestTimestamp = new Date().getTime();
                        return config;
                    },
                    response: function(response)
                    {
                        response.config.responseTimestamp = new Date().getTime();
                        return response;
                    },                    
                    responseError: function(rejection)
                    {
                        if (400 <= rejection.status && 500 > rejection.status)
                        {
                            Utility.errorSticky('通信に失敗しました');
                        }
                        else if (500 <= rejection.status)
                        {
                            Utility.errorSticky('システムエラーが発生しました');
                        }
                        
                        return $q.reject(rejection);
                    }
                };
            }
        );
    
    }
);
