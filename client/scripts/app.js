'use strict';

/**
 * @ngdoc overview
 * @name workspaceApp
 * @description
 * # workspaceApp
 *
 * Main module of the application.
 */
angular
  .module('myApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.bootstrap',
    'coreCtrl',
    'loginCtrl',
    'mainCtrl',
  ])
  .config(function ($routeProvider) {
    
    var autoCheck = function($http, $q, $window, $cookies, Shared) {
        
        var deferred = $q.defer();
        
        $http.post('api/isLogin', {remembertkn: $cookies.remembertkn}
        
        ).success(function(data) {
          
            Shared.set('id', data.id);
            deferred.resolve(true);

        }).error(function(data) {
            
            $window.location.href = "https://"+location.host+"/#/login";
        });

        return deferred.promise;
    };
    
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        reloadOnSearch: false, //ページ内リンクを可能にする
//        resolve: {isLogin: autoCheck}
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl',
      })
      .otherwise({
        redirectTo: '/'
      });
  });
