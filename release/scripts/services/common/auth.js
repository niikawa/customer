var authServices = angular.module("AuthServices", ["ngResource", "ngCookies"]);
authServices.factory("Auth", ['$resource', '$http', '$location', '$cookies','Utility', 'Shared',
    function($resource, $http, $location, $cookies, Utility, Shared)
    {
        var authServices = {};
        
        authServices.login = function(data)
        {
            var promise = $http.post('/auth/login', {mailAddress: data.mailAddress, password: data.password
            }).success(function(response, status, headers, config)
            {
                if (data.remember) {
                    //クッキーに入れる
                    $cookies.remembertkn = data.remembertkn;
                }
                Shared.set('id', response.data[0].user_id);
                Shared.set('userName', response.data[0].name);
                Shared.set('role', response.data[0].role_id);
            });
            return promise;
        };
        
        authServices.setLoginStatus = function(id)
        {
            var promise = $http.post('api/setStatus', {'id': id
            }).success(function(data, status, headers, config)
            {
                $location.path('/');
            }
            ).error(function(data)
            {
                Utility.errorSticky(data);
            });
            return promise;
        };
        
        authServices.isLogin = function()
        {
            var promise = $http.post('api/isLogin', {
            }).success(function(data, status, headers, config)
            {
                return true;
            }
            ).error(function(data)
            {
                Utility.errorSticky(data);
            });
            return promise;
        };
        
        authServices.logout = function()
        {
            var promise = $http.post('auth/logout', {
            }).success(function(data, status, headers, config)
            {
                $location.path('/login');
            }
            ).error(function(data)
            {
                Utility.errorSticky(data);
            });
            return promise;
        };
        
        return authServices;
    }
]);

//自動ログイン機能を追加時に正式に実装する
authServices.factory("AutoAuth", ['$window', '$http', '$q',
    function($window, $http, $q) {
        var deferred = $q.defer();
        //クッキーからトークンを取得
        $http.post('api/auth', {}
        ).success(function(data){
            
            return deferred.promise;
            
        }).error(function(data) {
            $window.location.href = "https://"+location.host;
        });
    }
]);