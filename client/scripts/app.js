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
    'ngMessages',
    'ngFileUpload',
    'ui.bootstrap',
    'coreCtrl',
    'loginCtrl',
    'mainCtrl',
    'dashbordCtrl',
    'segmentCtrl',
    'segmentControlCtrl',
    'queryCtrl',
    'queryListCtrl',
    'scenarioCtrl',
    'scenarioControlCtrl',
    'approachCtrl',
    'userCtrl',
    'userControlCtrl',
    'accessCtrl',
    'bugCtrl',
    'mapCtrl',
  ])
  .config(['$routeProvider', function ($routeProvider)
  {
    var autoCheck = function($http, $q, $window, $cookies, Shared)
    {
        var deferred = $q.defer();
        
        $http.post('/auth/isLogin', {remembertkn: $cookies.remembertkn}
        ).success(function(response) {
          
            Shared.set('id', response.data.user_id);
            Shared.set('userName', response.data.name);
            Shared.set('role', response.data.role_id);
            deferred.resolve(true);

        }).error(function(data) {
            
            $window.location.href = "https://"+location.host+"/#/login";
        });

        return deferred.promise;
    };

    var isPageAuth = function($http, $q, $window, Shared)
    {
        var deferred = $q.defer();
        if (1 == Shared.get("role"))
        {
            deferred.resolve(true);
        }
        else
        {
            $window.location.href = "https://"+location.host+"/#/";
        }
            
        return deferred.promise;
        
    };
    $routeProvider
      .when('/', {
        templateUrl: 'views/dashbord.html',
        controller: 'DashbordCtrl',
        reloadOnSearch: false, //ページ内リンクを可能にする
        resolve: {isLogin: autoCheck}
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl',
      })
      .when('/customer', {
        templateUrl: 'views/customer/customer.html',
        controller: 'MainCtrl',
        reloadOnSearch: false, //ページ内リンクを可能にする
        resolve: {isLogin: autoCheck}
      })
      .when('/segment', {
        templateUrl: 'views/segment/segment.html',
        controller: 'SegmentCtrl',
        reloadOnSearch: false, //ページ内リンクを可能にする
        resolve: {isLogin: autoCheck}
      })
      .when('/segment/control', {
        templateUrl: 'views/segment/segmentControl.html',
        controller: 'SegmentControlCtrl',
        reloadOnSearch: false, //ページ内リンクを可能にする
        resolve: {isLogin: autoCheck}
      })
      .when('/segment/control/:id', {
        templateUrl: 'views/segment/segmentControl.html',
        controller: 'SegmentControlCtrl',
        reloadOnSearch: false, //ページ内リンクを可能にする
        resolve: {isLogin: autoCheck}
      })
      .when('/query/list', {
        templateUrl: 'views/query/queryList.html',
        controller: 'QueryListCtrl',
        reloadOnSearch: false, //ページ内リンクを可能にする
        resolve: {isLogin: autoCheck}
      })
      .when('/query', {
        templateUrl: 'views/query/query.html',
        controller: 'QueryCtrl',
        reloadOnSearch: false, //ページ内リンクを可能にする
        resolve: {isLogin: autoCheck}
      })
      .when('/query/control/:id', {
        templateUrl: 'views/query/query.html',
        controller: 'QueryCtrl',
        reloadOnSearch: false, //ページ内リンクを可能にする
        resolve: {isLogin: autoCheck}
      })
      .when('/query/set', {
        templateUrl: 'views/query/querySetting.html',
        controller: 'QueryCtrl',
        reloadOnSearch: false, //ページ内リンクを可能にする
        resolve: {isLogin: autoCheck}
      })
      .when('/query/save', {
        templateUrl: 'views/query/querySave.html',
        controller: 'QueryCtrl',
        reloadOnSearch: false, //ページ内リンクを可能にする
        resolve: {isLogin: autoCheck}
      })
      .when('/scenario/:scenario', {
        templateUrl: 'views/scenario/scenario.html',
        controller: 'ScenarioCtrl',
        reloadOnSearch: false, //ページ内リンクを可能にする
        resolve: {isLogin: autoCheck}
      })
      .when('/scenario/:scenario/control', {
        templateUrl: 'views/scenario/scenarioControl.html',
        controller: 'ScenarioControlCtrl',
        reloadOnSearch: false, //ページ内リンクを可能にする
        resolve: {isLogin: autoCheck}
      })
      .when('/scenario/:scenario/control/:id', {
        templateUrl: 'views/scenario/scenarioControl.html',
        controller: 'ScenarioControlCtrl',
        reloadOnSearch: false, //ページ内リンクを可能にする
        resolve: {isLogin: autoCheck}
      })
      .when('/approach', {
        templateUrl: 'views/approach/approach.html',
        controller: 'ApproachCtrl',
        reloadOnSearch: false, //ページ内リンクを可能にする
        resolve: {isLogin: autoCheck}
      })
      .when('/user', {
        templateUrl: 'views/user/user.html',
        controller: 'UserCtrl',
        reloadOnSearch: false, //ページ内リンクを可能にする
        resolve: {isLogin: autoCheck, isShow: isPageAuth}
      })
      .when('/user/control', {
        templateUrl: 'views/user/userControl.html',
        controller: 'UserControlCtrl',
        reloadOnSearch: false, //ページ内リンクを可能にする
        resolve: {isLogin: autoCheck, isShow: isPageAuth}
      })
      .when('/user/control/:id', {
        templateUrl: 'views/user/userControl.html',
        controller: 'UserControlCtrl',
        reloadOnSearch: false, //ページ内リンクを可能にする
        resolve: {isLogin: autoCheck, isShow: isPageAuth}
      })
      .when('/access', {
        templateUrl: 'views/access/history.html',
        controller: 'AccessCtrl',
        reloadOnSearch: false, //ページ内リンクを可能にする
        resolve: {isLogin: autoCheck}
      })
      .when('/access/:id', {
        templateUrl: 'views/access/timeLine.html',
        controller: 'AccessCtrl',
        reloadOnSearch: false, //ページ内リンクを可能にする
        resolve: {isLogin: autoCheck}
      })
      .when('/release', {
        templateUrl: 'views/note/releaseNotes.html',
        reloadOnSearch: false, //ページ内リンクを可能にする
        resolve: {isLogin: autoCheck}
      })
      .when('/release/bug', {
        templateUrl: 'views/note/bugNotes.html',
        controller: 'BugCtrl',
        reloadOnSearch: false, //ページ内リンクを可能にする
        resolve: {isLogin: autoCheck}
      })
      .otherwise({
        redirectTo: '/'
      });
  }]);
