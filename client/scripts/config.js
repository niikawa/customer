/**
 * interceptors configration
 */
var myApp = angular.module('myApp');
myApp.config(
    function($httpProvider, $routeProvider) 
    {
        // $httpProvider.defaults.headers.post['Content-Type'] = 'application/json';
        // $httpProvider.defaults.useXDomain = true;
        // $httpProvider.defaults.withCredentials = true;
        // delete $httpProvider.defaults.headers.common['X-Requested-With'];
    
        $httpProvider.interceptors.push
        (
            function ($q, $rootScope, Utility)
            {
                return {
                    request: function(config)
                    {
                        $rootScope.$broadcast('requestStart');
                        config.requestTimestamp = new Date().getTime();
                        return config;
                    },
                    requestError: function()
                    {
                        $rootScope.$broadcast('requestEnd');
                    },
                    response: function(response)
                    {
                        $rootScope.$broadcast('requestEnd');
                        response.config.responseTimestamp = new Date().getTime();
                        return response;
                    },                    
                    responseError: function(rejection)
                    {
                        $rootScope.$broadcast('requestEnd');
                        if (400 <= rejection.status && 500 > rejection.status)
                        {
                            Utility.errorSticky('通信に失敗しました');
                        }
                        else if (500 <= rejection.status)
                        {
                            if (511 != rejection.status)
                            {
                                if (rejection.data)
                                {
                                    Utility.errorSticky(rejection.data);
                                }
                                else
                                {
                                    Utility.errorSticky('システムエラーが発生しました');
                                }
                            }
                        }
                        
                        return $q.reject(rejection);
                    }
                };
            }
        );
    
    }
);
