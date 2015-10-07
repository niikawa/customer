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
  .config(function ($routeProvider) {
    
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

//       .when('/map', {
//         templateUrl: 'views/map.html',
//         controller: 'MapCtrl',
//         reloadOnSearch: false, //ページ内リンクを可能にする
// //        resolve: {isLogin: autoCheck}
//       })
      .otherwise({
        redirectTo: '/'
      });
  });

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
                            if (511 === rejection.status)
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

/**
 * core controller
 * 
 * すべての上位コントローラー
 * アプリケーションの全体変更に関する処理のみを記述し、下位コントローラーは継承されたscopeの直接変更するのではなく、
 * bordcastすることで変更通知を行うこと
 */
var coreCtrl = angular.module('coreCtrl',[]);
coreCtrl.controller('CoreCtrl', ['$scope', 'Shared', function($scope, Shared) 
{
    /** ヘッダー表示 */
    $scope.isHeader = (void 0 !== Shared.get('id'));
    Shared.set('isSpinner', false);

    $scope._construct = function()
    {
        $scope.isHeader = true;
    };
    
    $scope.$on('loginComplete', function(event)
    {
        $scope.isHeader = true;
        $scope.userName = Shared.get('userName');
    });

    $scope.$on('loginInit', function(event)
    {
        $scope.isHeader = false;
    });

    $scope.$on('loginFailed', function(event)
    {
        $scope.isHeader = false;
    });

    $scope.$on('logoutConplete', function(event)
    {
        $scope.isHeader = false;
    });
    
    $scope.$on('requestStart', function(event)
    {
        $scope.isSpinner = true;
    });

    $scope.$on('requestEnd', function(event)
    {
        $scope.isSpinner = false;
    });

}]);

/**
 * @ngdoc function
 * @name workspaceApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the workspaceApp
 */
var mainCtrl = angular.module('mainCtrl',['CustomerServices', 'AzureServices']);
mainCtrl.controller('MainCtrl',['$scope', 'Shared', 'Customer', 'Azure', 'Utility',
function ($scope, Shared, Customer, Azure, Utility)
{
    /**
     * scope初期化用
     */
    function setInitializeScope()
    {
        $scope.customerList = [];
        $scope.approch = [];
        $scope.customer = [];
        $scope.rank = '';
        //autocomplete用
        $scope.selectedCustomer = {};
        $scope.lineLabel = '';
        $scope.addStyle = "";
        $scope.legendLabel = [];
        $scope.isGetData = false;
    }
    
    /**
     * 初期処理
     * @author niikawa
     */
    $scope.initialize = function()
    {
        $scope._construct();
        setInitializeScope();

        Customer.resource.get().$promise.then(function(response)
        {
            $scope.customerList = response.data;
        });
    };
    
    $scope.custmoerChangeExecute = function()
    {
        $scope.$emit('requestStart');
        Customer.resource.detail({id: $scope.selectedCustomer.Id}).$promise.then(function(response)
        {
            $scope.customer = response.customer;
            $scope.approch = response.approch;
            $scope.rank = $scope.approch[0].name;
            $scope.addStyle = 'two-row';
            var coefficient = Utility.diffMonth(
                                response.customer.last_purchasing_date, response.customer.start_purchasing_date);
            
            $scope.customer.frequency_avg = 
                Math.round(response.customer.frequency * 10 / coefficient) / 10;
            $scope.customer.monetary_avg = 
                Math.round(response.customer.monetary / coefficient);
            
            $scope.customer.last_purchasing_date = 
                Utility.formatString($scope.customer.last_purchasing_date, 'YYYY年MM月DD日');
            
            
            //グラフ描画
            $scope.lineLabel = '直近1年の売上推移（月別サマリ）';
            $scope.legendLabel = [$scope.selectedCustomer.customer_id, 'ランク平均'];

            $scope.orders = [response.orders, response.orders_avg];
            $scope.$emit('requestEnd');
            $scope.isGetData = true;
        });
    };
    
    $scope.recomender = function()
    {
        $scope.$emit('requestStart');
        Azure.resource.recomender({id: $scope.selectedCustomer.Id}).$promise.then(function(response)
        {
            $scope.$emit('requestEnd');
            if ( '' === response.data)
            {
                Utility.successSticky('おすすめ商品はありません');
            }
            else
            {
                //0番目はユーザーIDのため削除
                var reco = response.data[0];
                delete reco[0];
                Utility.successSticky(reco.join());
            }
        });
    };
}]);

var loginCtrl = angular.module('loginCtrl',['AuthServices',]);
loginCtrl.controller('LoginCtrl', ['$scope', '$location', 'Auth', 'Location',
    function($scope, $location, Auth, Location) {
    
    $scope.initialize = function()
    {
        $scope.$emit('loginInit');
        $scope.data = {mailAddress:'', password:'', remember:false};
    };
    
    $scope.submit = function()
    {
        $scope.$emit('requestStart');
        Auth.login($scope.data).then(function(response)
        {
            $scope.$emit('requestEnd');
            $scope.$emit('loginComplete');
            Location.home();
            //Auth.setLoginStatus(response.data.user_id);
        }, function()
        {
            $scope.$emit('requestEnd');
        });
    };
}]);

var mainCtrl = angular.module('dashbordCtrl',['ScenarioServices']);
mainCtrl.controller('DashbordCtrl',['$scope', 'Shared', 'Scenario', 'Utility', 'Modal',
function ($scope, Shared, Scenario, Utility, Modal)
{
    function setInitializeScope()
    {
        $scope.scenario = [];
        $scope.executePlanScenario = [];
    }
    
    function getInitializeData()
    {
        Scenario.resource.typeCount().$promise.then(function(response)
        {
            $scope.scenarioList = response.data;
            
            Scenario.resource.executeplan().$promise.then(function(response)
            {
                $scope.isShowExecutePlanScenario = (response.data.length > 0);
                $scope.executePlanScenario = response.data;
            });
        });
    }
    
    $scope.initialize = function()
    {
        $scope.$emit('requestStart');
        
        $scope._construct();
        setInitializeScope();
        getInitializeData();
        Shared.setRoot('dashbord');
        
        $scope.$emit('requestEnd');
    };
    
    $scope.bulkInvalid = function()
    {
        $scope.modalParam = 
        {
            title: 'シナリオの一括無効について',
            message: '実行予定のシナリオをすべて無効にしますがよろしいですか？<br>再度有効にする場合はアプローチ管理画面から有効にできます。',
            isExecute: true,
            executeLabel: '一括で無効にする',
            execute: function()
            {
                Scenario.resource.bulkInvalid().$promise.then(function(response)
                {
                    $scope.modalInstance.close();
                    Utility.info('実行予定のシナリオを一括無効しました。');
                    $scope.initialize();
                });
            }
        };
        $scope.modalInstance = Modal.open($scope, "partials/modal/message.html");
    };
    
}]);

/**
 * @ngdoc function
 * @name workspaceApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the workspaceApp
 */
var segmentCtrl = angular.module('segmentCtrl',['SegmentServices']);
segmentCtrl.controller('SegmentCtrl',['$scope', 'Shared', 'Segment', 'Utility',
function ($scope, Shared, Segment, Utility)
{
    /**
     * scope初期化用
     */
    function setInitializeScope()
    {
        Shared.setRoot('segment');
        $scope.segmentList = [];
    }
    
    /**
     * 初期処理
     * @author niikawa
     */
    $scope.initialize = function()
    {
        $scope._construct();
        setInitializeScope();

        Segment.resource.get().$promise.then(function(response)
        {
            $scope.segmentList = response.data;
            $scope.showInfo = $scope.segmentList.length > 0 ? true : false; 
        });
    };
    
    $scope.download = function(id)
    {
        Segment.download(id);
    };

    $scope.remove = function(index)
    {
        var target = $scope.segmentList[index];
        console.log(target);
        Segment.resource.remove(
            {id: target.segment_id, segment_document_id: target.segment_document_id}).$promise.then(function(response)
        {
            Utility.info('削除しました');
            $scope.segmentList.splice(index, 1);
        });
    };
}]);

var segmentControlCtrl = angular.module('segmentControlCtrl',['SegmentServices', 'QueryServices']);
segmentControlCtrl.controller('SegmentControlCtrl',['$scope', '$routeParams', 'Modal','Shared', 'Segment', 'Query', 'Utility','Location',
function ($scope, $routeParams, Modal, Shared, Segment, Query, Utility, Location)
{
    function setInitializeScope()
    {
        $scope.pageTitle = Segment.pageProp($routeParams.id).pageTitle;
        $scope.viewMode = Segment.pageProp($routeParams.id).viewMode;

        $scope.segmenData = {};
        $scope.queryList = [];
        $scope.conditions = [];
        $scope.segmentSearch = '';
        $scope.segment = {};
        $scope.isExecte = false;
    }
    
    $scope.initialize = function()
    {
        $scope._construct();
        setInitializeScope();
        // setEvntListeners();
        Shared.setRoot('segment control');
        
        Query.resource.getQuery().$promise.then(function(doc)
        {
            if (2 === Segment.pageProp($routeParams.id).viewMode)
            {
                Segment.resource.get({id: $routeParams.id}).$promise.then(function(response)
                {
                    $scope.segment.segment_id = $routeParams.id;
                    $scope.segment.segment_name = response.segment_name;
                    $scope.segment.segment_document_id = response.segment_document_id;
                    Segment.setListData(doc.data, response.qIds, $scope.conditions);
                    $scope.queryList = doc.data;
                    Segment.setWhereProp($scope.queryList);
                    Segment.setWhereProp($scope.conditions, response.whereList);
                    $scope.isExecte = true;
                });
            }
            else
            {
                $scope.queryList = doc.data;
                Segment.setWhereProp($scope.queryList);
            }
        });
    };
    
    $scope.moveQuery = function(index)
    {
        $scope.conditions.push($scope.queryList[index]);
        $scope.queryList.splice(index,1);
        $scope.isExecte = true;
    };
    
    $scope.removeItem = function(index)
    {
        $scope.queryList.push($scope.conditions[index]);
        $scope.conditions.splice(index,1);
        if (0 === $scope.conditions.length) $scope.isExecte = false;
    };
    
    $scope.save = function()
    {
        var doc = Segment.createDocData($scope.conditions);
        var docdata = {
            segment_name: $scope.segment.segment_name, 
            segment_document_id: $scope.segment.segment_document_id,
            whereList: doc.whereList, 
            qIds: doc.qIds
        };
        
        Segment.resource.saveDoc({data: docdata}).$promise.then(function(response)
        {
            var data = {
                segment_id: $scope.segment.segment_id, 
                segment_name: response.data.segment_name, 
                segment_document_id:response.data.id
            };
            Segment.resource.save({data: data}).$promise.then(function(response)
            {
                Utility.info('セグメントを保存しました');
                Location.segment();
            });
        });
    };

    $scope.execute = function()
    {
        var data = Segment.createExecuteInfo($scope.conditions);
        Segment.resource.executeQuery(data).$promise.then(function(response, err)
        {
            Utility.info('該当データは' + response.result + '件あります');
        });
    };
}]);

/**
 * @ngdoc function
 * @name workspaceApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the workspaceApp
 */
var scenarioCtrl = angular.module('scenarioCtrl',['ScenarioServices']);
scenarioCtrl.controller('ScenarioCtrl',['$scope', '$routeParams','Shared', 'Utility', 'Scenario', 
function ($scope, $routeParams, Shared, Utility, Scenario)
{
    /**
     * scope初期化用
     */
    function setInitializeScope()
    {
        $scope.addPageTitle = Scenario.getPageProp($routeParams.scenario).title;
        $scope.type = $routeParams.scenario;
        
        $scope.scenarioList = [];
    }
    
    /**
     * 初期処理
     * @author niikawa
     */
    $scope.initialize = function()
    {
        Shared.setRoot('scenario');
        $scope._construct();
        setInitializeScope();

        Scenario.resource.get({type: $routeParams.scenario}).$promise.then(function(response)
        {
            $scope.isScenarioShow = response.data.length > 0 ? true: false;
            if ($scope.isScenarioShow)
            {
                $scope.scenarioList = response.data;
            }
        });
    };
    
    $scope.remove = function(index)
    {
        if (void 0 === index || isNaN(parseInt(index, 10))) return false;
        var id = $scope.scenarioList[index].scenario_id;
        var name = $scope.scenarioList[index].scenario_name;
        var params = 
        {
            type: $routeParams.scenario,
            id: id,
        };

        Scenario.resource.remove(params).$promise.then(function(response)
        {
            Utility.info(name+'<br>'+'を削除しました。');
            $scope.scenarioList.splice(index, 1);
            $scope.isScenarioShow = $scope.scenarioList.length > 0 ? true: false;
        });
    };
    
}]);

var scenarioControlCtrl = angular.module('scenarioControlCtrl',['ScenarioServices','SegmentServices']);
scenarioControlCtrl.controller('ScenarioControlCtrl',['$scope', '$routeParams', 'Modal','Shared', 'Utility', 'Location', 'Scenario',
function ($scope, $routeParams, Modal, Shared, Utility, Location, Scenario)
{
    var pageProp = Scenario.getPageProp($routeParams.scenario, $routeParams.id);
    var id = $routeParams.id;
    var actionId = 0;
    var selectConditionList = [];
    /**
     * scope初期化用
     */
    function setInitializeScope()
    {
        $scope.isBaseCollapse = false; //基本設定Collapse制御
        $scope.isOriginCollapse = false; //個別設定Collapse制御
        $scope.isShowExtraction = false; //抽出条件表示制御

        $scope.pageTitle = pageProp.title+pageProp.addTitle;
        
        $scope.scenario = {};
        $scope.scenario.approach;
        $scope.scenario.status;
        
        $scope.type = $routeParams.scenario;
        $scope.template = pageProp.template;
        
        $scope.inputTag = '';
        $scope.tagList = [];
        $scope.selectTagList = [];
        $scope.isTagCollapse = false;

        Shared.setRoot($scope.type +' scenario');
        if (1 === pageProp.type)
        {
            $scope.specificInfo = 
            {
                repeat_flag: null,
                expiration_start_date: Utility.today('YYYY-MM-DD'),
                expiration_end_date: '',
                interval: 0, 
                intervalCondition: '', 
                daysCondition: Scenario.daysCondition(),
                weekCondition: {mon: false, tue: false, wed: false, thu: false, fri: false, sat: false, sun: false}
            };
        }
        else if (2 === pageProp.type)
        {
            $scope.conditions = [];
            $scope.specificInfo = {};
            $scope.decisionList = [];
        }
    }
    
    function setValidation()
    {
        $scope.validators = 
        {
            segment:
            {
                isSelect: function (modelValue, viewValue)
                {
                    var segmentList = $scope.segmentList || {};
                    var isSelect = false;
                    angular.forEach(segmentList, function(item, key)
                    {
                        if (item.isPush) isSelect = true;
                    });
                    return isSelect;
                }
            },
            ifLayout:
            {
                isSelect: function (modelValue, viewValue)
                {
                    var ifList = $scope.ifList || {};
                    var isSelect = false;
                    angular.forEach(ifList, function(item, key)
                    {
                        if (item.isPush) isSelect = true;
                    });
                    return isSelect;
                }
            },
            expiration_start_date:
            {
                isDateValid: function(modelValue, viewValue)
                {
                    var val = modelValue || viewValue;
                    return Utility.isDateValid(val);
                }
            },
            expiration_end_date:
            {
                isDateValid: function(modelValue, viewValue)
                {
                    var val = modelValue || viewValue;
                    return Utility.isDateValid(val);
                },
                isAfter: function(modelValue, viewValue)
                {
                    var val = modelValue || viewValue;
                    return Utility.isAfter(val, $scope.specificInfo.expiration_start_date);
                }
            },
            interval:
            {
                isSelect: function (modelValue, viewValue)
                {
                    var val = modelValue || viewValue;
                    return 0 !== val;
                }
            },
            weekCondition:
            {
                isSelect: function (modelValue, viewValue)
                {
                    var weekCondition = $scope.specificInfo.weekCondition || {};
                    var isSelect = false;
                    angular.forEach(weekCondition, function(item, key)
                    {
                        if (item) isSelect = true;
                    });
                    return isSelect;
                }
            },
            daysCondition:
            {
                isSelect: function (modelValue, viewValue)
                {
                    var daysCondition = $scope.specificInfo.daysCondition || {};
                    var isSelect = false;
                    angular.forEach(daysCondition, function(item, key)
                    {
                        if (item.check) isSelect = true;
                    });
                    return isSelect;
                }
            },
        };
        $scope.asyncValidators = 
        {
            scenario_name:
            {
                same: function (modelValue, viewValue)
                {
                    var val = modelValue || viewValue;
                    if (void 0 === val || val.length === 0) return true;
                    
                    return Scenario.validators.isSameName({id: id, scenario_name: val});
                }
            },
            output_name:
            {
                same: function (modelValue, viewValue)
                {
                    var val = modelValue || viewValue;
                    if (void 0 === val || val.length === 0) return true;

                    return Scenario.validators.isSameName({id: id, output_name: val});
                }
            }
        };
    }
    
    function getInitializeData()
    {
        var params = {type: $routeParams.scenario};
        var isEdit = void 0 !== id;
        if (isEdit) params.id = id;

        Scenario.resource.initializeData(params).$promise.then(function(response)
        {
            $scope.segmentList = response.segment;
            $scope.ifList = response.ifLayout;
            $scope.scenario = response.target;
            $scope.tagList = response.tagList;
            $scope.selectTagList = response.settinTags;
            if (1 === pageProp.type)
            {
                if (isEdit) editScheduleInitialize(response);
            }
            else if (2 === pageProp.type)
            {
                $scope.actionList =  response.specific;
                if (isEdit)
                {
                    $scope.activeId = response.specificInfo.doc.actionId;
                    editTriggerInitialize(response);
                }
            }
        });
    }
    function editScheduleInitialize(initData)
    {
        $scope.specificInfo.repeat_flag = initData.specificInfo.specific.repeat_flag;
        $scope.specificInfo.expiration_start_date = Utility.formatString(initData.specificInfo.specific.expiration_start_date);
        if (null !== initData.specificInfo.specific.expiration_end_date)
        {
            $scope.specificInfo.expiration_end_date = Utility.formatString(initData.specificInfo.specific.expiration_end_date);
        }

        if (null !== initData.specificInfo.doc)
        {
            $scope.specificInfo.interval = initData.specificInfo.doc.interval;
        
            if (2 === $scope.specificInfo.interval)
            {
               $scope.specificInfo.weekCondition = initData.specificInfo.doc.weekCondition;
            }
            else if (3 === $scope.specificInfo.interval)
            {
               $scope.specificInfo.daysCondition = initData.specificInfo.doc.daysCondition;
            }
        }
    }
    
    function editTriggerInitialize(initData)
    {
        $scope.specificInfo = initData.specificInfo.specific;
        actionId = initData.specificInfo.doc.actionId;

        $scope.isShowExtraction = true;
        var actionLen = initData.specific.length;
        for (var index = 0; index < actionLen; index++)
        {
            if (actionId === initData.specific[index].id)
            {
                $scope.columnList = initData.specific[index].column;
                break;
            }
        }
        angular.forEach(initData.specificInfo.doc.conditionList, function(conditionItems)
        {
            var restoration = [];
            angular.forEach(conditionItems, function(items)
            {
                angular.forEach($scope.columnList, function(info)
                {
                    if (items.physicalname == info.physicalname)
                    {
                        info.condition = items.condition;
                        info.selectedCondition = items.selectedCondition;
                        restoration.push(info);
                        //return false;
                    }
                });
            });
            selectConditionList.push(restoration);
            var condtionString = Scenario.createCondtionString(restoration);
            $scope.decisionList.push(condtionString);
        });
    }
    function setWatchItems()
    {
        $scope.$watch('scenario.scenario_name', function()
        {
            $scope.scenarioForm.scenario_name.$validate();
        });

        $scope.$watch('scenario.output_name', function()
        {
            $scope.scenarioForm.output_name.$validate();
        });

        $scope.$watch('segmentList', function()
        {
            $scope.scenarioForm.segment.$validate();
        },true);
        
        $scope.$watch('ifList', function()
        {
            $scope.scenarioForm.ifLayout.$validate();
        },true);
        
        if (1 === pageProp.type)
        {
            if (null !== $scope.specificInfo.repeat_flag)
            {
                $scope.$watch('specificInfo.expiration_start_date', function()
                {
                    $scope.scenarioForm.expiration_start_date.$validate();
                });
            }
            if (1 === $scope.specificInfo.repeat_flag)
            {
                $scope.$watch('specificInfo.expiration_end_date', function()
                {
                    $scope.scenarioForm.expiration_end_date.$validate();
                });
                $scope.$watch('specificInfo.interval', function()
                {
                    $scope.scenarioForm.interval.$validate();
                });
            }
        }
        
    }
    function setEventListeners()
    {
    }
    
    /**
     * 初期処理
     * @author niikawa
     */
    $scope.initialize = function()
    {
        $scope._construct();
        setInitializeScope();
        getInitializeData();
        setValidation();
        setWatchItems();
        setEventListeners();
    };
    
    $scope.showAction = function(id, col)
    {
        $scope.conditions = [];
        $scope.decisionList = [];
        if (actionId == id)
        {
            $scope.isShowExtraction = !$scope.isShowExtraction;
        }
        else
        {
            $scope.isShowExtraction = true;
            $scope.columnList = col;
            actionId = id;
        }
    };
    
    $scope.addTag = function()
    {
        if (0 >= $scope.inputTag.length) return;
        
        var isAddTag = true;
        angular.forEach($scope.selectTagList, function(tag)
        {
            if ($scope.inputTag === tag.tag_name)
            {
                isAddTag = false;
                return false;
            }
        });
        if (isAddTag)
        {
            $scope.selectTagList.push({tag_name: $scope.inputTag});
            $scope.inputTag = '';
        }
    };
    
    $scope.removeTag = function(index)
    {
        $scope.selectTagList.splice(index, 1);
    };
    
    //---------------------------------
    //trigger
    //---------------------------------
    $scope.moveCondition = function(item)
    {
        var push = {};
        angular.copy(item, push);
        $scope.conditions.push(push);
    };

    $scope.removeItem = function(index)
    {
        $scope.conditions.splice(index, 1);
    };
    
    $scope.decision = function()
    {
        var isDecision = true;
        angular.forEach($scope.conditions, function(condition)
        {
            if (condition.error || '' === condition.condition.value1 || void 0 === condition.condition.value1)
            {
                isDecision = false;
                return false;
            }
        });
        
        if (isDecision)
        {
            selectConditionList.push($scope.conditions);
            var condtionString = Scenario.createCondtionString($scope.conditions);
            $scope.decisionList.push(condtionString);
            $scope.conditions = [];
        }
    };
    
    $scope.removeDecisionList = function(index)
    {
        selectConditionList.splice(index, 1);
        $scope.decisionList.splice(index, 1);
    };

    $scope.clear = function()
    {
        setInitializeScope();
        getInitializeData();
    };
    
    $scope.save = function()
    {
        var doc;
        var tags;
        var specificInfo;
        if (1 === pageProp.type)
        {
            specificInfo = 
            {
                repeat_flag: $scope.specificInfo.repeat_flag,
                expiration_start_date: $scope.specificInfo.expiration_start_date,
                expiration_end_date: $scope.specificInfo.expiration_end_date,
            };
            
            if (1 == $scope.specificInfo.repeat_flag)
            {
                doc = {interval: $scope.specificInfo.interval};
                if (2 === $scope.specificInfo.interval)
                {
                    doc.weekCondition = $scope.specificInfo.weekCondition;
                }
                else if (3 === $scope.specificInfo.interval)
                {
                    doc.daysCondition = $scope.specificInfo.daysCondition;
                }
            }
        }
        else if (2 === pageProp.type)
        {
            //ベータ版のための制御
            if (0 === selectConditionList.length) return false;
            doc = 
            {
                actionId: actionId,
                conditionList: Scenario.getConditionDoc(selectConditionList)
            };
            specificInfo = $scope.specificInfo;
        }
        else
        {
            return false;
        }

        $scope.scenario.scenario_type = pageProp.type;
        Scenario.setActivePushItem($scope.segmentList, 'segment_id', $scope.scenario, 'segment_id');
        Scenario.setActivePushItem($scope.ifList, 'id', $scope.scenario, 'if_layout_id');

        var params = {scenario: $scope.scenario, specificInfo: specificInfo, doc: doc, tags: $scope.selectTagList};

        Scenario.resource.save(params).$promise.then(function(response)
        {
            Utility.info('シナリオを保存しました。');
            if (1 === pageProp.type)
            {
                Location.schedule();
            }
            else if (2 === pageProp.type)
            {
                Location.trigger();
            }
        });
    };
    
    //---------------------------------
    //schedule
    //---------------------------------
    $scope.weekConditionValidation = function()
    {
        $scope.scenarioForm.weekCondition.$validate();
    };
    
    $scope.daysConditionValidation = function()
    {
        $scope.scenarioForm.daysCondition.$validate();
    };

}]);

var queryListCtrl = angular.module('queryListCtrl',['QueryServices']);
queryListCtrl.controller('QueryListCtrl',['$scope', 'Shared', 'Query', 'Segment','Modal','Location', 'Utility',
function ($scope, Shared, Query, Segment, Modal, Location, Utility)
{
    function setInitializeScope()
    {
        $scope.queryList = [];
        Shared.setRoot('query list');
    }
    
    $scope.initialize = function()
    {
        $scope._construct();
        setInitializeScope();

        Query.resource.getList().$promise.then(function(response)
        {
            $scope.queryList = response.data;
            $scope.isQueryShow = $scope.queryList.length > 0;
        });
    };
    
    $scope.showSegment = function(index)
    {
        if (void 0 === $scope.queryList[index].id) return;
        var target = $scope.queryList[index];
        var params = {qId: target.id, count: target.useNum};
        Segment.resource.useSegment(params).$promise.then(function(response)
        {
            $scope.modalParam = 
            {
                title: $scope.queryList[index].query_name+"を利用しているセグメント",
                list: response.data,
                hrefBase: '#/segment/control',
                dynamicParamKey: 'id',
                close: function(id)
                {
                    $scope.modalInstance.close();
                    Location.segmentControl(id);
                }
            };
            $scope.modalInstance = Modal.open($scope, "partials/modal/list.html");
            
        });
    };
    
    $scope.deleteItem = function(index)
    {
        if (void 0 === $scope.queryList[index]) return;
        var name = $scope.queryList[index].query_name;
        Query.resource.remove({id: $scope.queryList[index].id}).$promise.then(function(response)
        {
            Utility.info(name + '<br>を削除しました。');
            $scope.queryList.splice(index,1);
        });
    };
}]);

var queryCtrl = angular.module('queryCtrl',['QueryServices']);
queryCtrl.controller('QueryCtrl',['$scope', '$routeParams', 'Shared', 'Query', 'Location', 'Utility',
function ($scope, $routeParams, Shared, Query, Location, Utility)
{
    var selectTable = '';
    
    function setInitializeScope(isEdit)
    {
        Shared.destloyByName('queryName');
        Shared.destloyByName('updateQueryDocumentId');
        $scope.tableList = [];
        $scope.tableListRef = [];
        $scope.columnNum = 0;
        $scope.selectColumns = [];
        if (!isEdit)
        {
            $scope.selectColumns = Shared.get('queryColumns') || [];
        }
        $scope.showSelectedColumnsBox = $scope.selectColumns.length > 0;
        $scope.conditions = [];
        $scope.isShowEditMessage = false;
        $scope.returnUrl = Query.getReturnURL();
        Shared.setRoot('query');
    }
    
    function setEdtInitializeScope(data)
    {
        angular.forEach(data.tables, function(columnList, tableName)
        {
            angular.forEach(columnList, function(columnInfo)
            {
                angular.forEach($scope.tableList[tableName].column, function(columnData)
                {
                    if (columnInfo.column === columnData.physicalname)
                    {
                        $scope.selectColumns.push(
                        {
                            table: {logicalname: $scope.tableList[tableName].logicalname, physicalname:  $scope.tableList[tableName].physicalname}, 
                            column: columnData,
                            selectedCondition: {name: '', value: columnInfo.conditionType, symbol: ''},
                            condition: columnInfo.values
                        });
                        
                        return false;
                    }
                });
            });
        });
        $scope.showSelectedColumnsBox = $scope.selectColumns.length > 0;

        Shared.set('queryColumns', $scope.selectColumns);
    }
    
    $scope.initialize = function()
    {
        var isEdit = $routeParams.hasOwnProperty('id');
        $scope._construct();
        setInitializeScope(isEdit);
        
        if (isEdit)
        {
            Query.resource.getControlInit({id: $routeParams.id}).$promise.then(function(response)
            {
                $scope.queryName = response.data.query_name;
                $scope.tableList = response.table;
                $scope.tableListRef = Query.getRefTabels(response.table);
                if (0 === $scope.selectColumns.length)
                {
                    setEdtInitializeScope(response.data);
                }
                $scope.isShowEditMessage = true;
                Shared.set('updateQueryDocumentId', $routeParams.id);
                Shared.set('updateQueryName', response.data.query_name);
            });
        }
        else
        {
            Query.resource.get().$promise.then(function(response)
            {
                $scope.tableList = response.table;
                $scope.tableListRef = Query.getRefTabels(response.table);
            });
        }
    };
    
    $scope.showColumns = function(table)
    {
        selectTable = table;
        $scope.columnList = $scope.tableList[table].column;
        $scope.columnNum = $scope.columnList.length;
    };
    
    $scope.setColumn = function(index)
    {
        var target = $scope.tableList[selectTable];
        var isSame = false;
        angular.forEach($scope.selectColumns, function(v, k)
        {
            if (v.table.physicalname === selectTable && v.column.physicalname === target.column[index].physicalname)
            {
                isSame = true;
            }
        });
        if (!isSame)
        {
            $scope.selectColumns.push(
            {
                table: {logicalname: target.logicalname, physicalname:  target.physicalname}, 
                column: target.column[index]
            });
        }
        $scope.showSelectedColumnsBox = true;
        Shared.set('queryColumns', $scope.selectColumns);
    };
    
    $scope.removeColumn = function(index)
    {
        $scope.selectColumns.splice(index, 1);
        $scope.showSelectedColumnsBox = ($scope.selectColumns.length > 0);
        Shared.set('queryColumns', $scope.selectColumns);
    };
    
    /****************************************/
    /*                  set                 */
    /****************************************/
    function editSetInitializeScope()
    {
        $scope.docIdUrl = '';
        var docId = Shared.get('updateQueryDocumentId');
        if (void 0 !== docId)
        {
            $scope.docIdUrl = '/control/'+docId;
            $scope.isShowEditMessage = true;
            $scope.queryName = Shared.get('updateQueryName');
        }
    }
    
    $scope.nextValidation = function()
    {
        Shared.setRoot('query set');
        $scope.selectColumns = Shared.get('queryColumns');
        if (void 0 === $scope.selectColumns) Location.query();

        angular.forEach($scope.selectColumns, function(v, k)
        {
//            v.column.inputType = Query.getContentsByColumsType(v.column.type);
        });
        
        editSetInitializeScope();
    };
    
    $scope.removeItem = function(index)
    {
        $scope.selectColumns.splice(index, 1);
        if (0 === $scope.selectColumns.length) Location.query();
    };
    
    $scope.next = function()
    {
        var isNext = false;
        angular.forEach($scope.selectColumns, function(item)
        {
            if (item.error)
            {
                return false;
            }
            else
            {
                isNext = true;
            }
        });
        if (isNext) Location.querySave();
    };
    
    /*****************************************/
    /*                  save                 */
    /*****************************************/
    function setEventListeners()
    {
        $scope.$on('dropItemComplete', function(event, data)
        {
            event.stopPropagation();
            angular.forEach($scope.showConditions, function(v, k)
            {
                console.log(v.length);
                if (1 === v.length) v.isJoin = false;
            });
        });
    }

    $scope.saveInitialize = function()
    {
        Shared.setRoot('query save');
        setEventListeners();
        editSetInitializeScope();
        $scope.query = {query_name: Shared.get('updateQueryName')};
        $scope.conditions = [];
        var selectColumns = Shared.get('queryColumns');

        if (void 0 === selectColumns)
        {
            Location.query();
        }
        $scope.selectColumns = [];
        Query.createCondtionString(selectColumns);
        $scope.showConditions = [];
        angular.forEach(selectColumns, function(v, k)
        {
            var array = [];
            array.push(v);
            array.isJoin = false;
            $scope.showConditions.push(array);
        });
    };
    
    $scope.isJoin = function(items)
    {
        return items.isJoin;
    };

    $scope.release = function(pIndex, cIndex)
    {
        var target = [];
        target.push($scope.showConditions[pIndex][cIndex]);
        
        console.log('削除前：' + $scope.showConditions.length);
        
        $scope.showConditions[pIndex].splice(cIndex, 1);
        
        console.log('削除後：' +$scope.showConditions.length);
        console.log($scope.showConditions);

        if (1 === $scope.showConditions[pIndex].length) $scope.showConditions[pIndex].isJoin = false;
        $scope.showConditions.push(pIndex, 0, target);
        console.log('ぷっしゅ後：' +$scope.showConditions.length);

        console.log($scope.showConditions);
    };

    $scope.save = function()
    {
        var queryColumns = Shared.get('queryColumns');
        var tables = Query.getTables(queryColumns);

        var parameters = 
        {
            query_document_id: Shared.get('updateQueryDocumentId'),
            query_name: $scope.query.query_name, 
            conditionList: $scope.showConditions, 
            tables: tables
        };
        Query.resource.create(parameters).$promise.then(function(response, err)
        {
            Shared.destloyByName('queryColumns');
            Shared.destloyByName('updateQueryName');
            Shared.destloyByName('updateQueryDocumentId');
            Utility.info('クエリを保存しました');
            Location.query();
        });
    };
    
    $scope.execute = function()
    {
        var data = Shared.get('queryColumns');
        var tables = Query.getTables(data);
        var parameters = {tables: tables, conditionList: $scope.showConditions};
        Query.resource.executeQuery(parameters).$promise.then(function(response, err)
        {
            Utility.info('該当データは' + response.result + '件あります');
        });
    };
}]);
/**
 * @ngdoc function
 * @name workspaceApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the workspaceApp
 */
var approachCtrl = angular.module('approachCtrl',['ApproachServices','ScenarioServices']);
approachCtrl.controller('ApproachCtrl',['$scope', '$routeParams','Shared', 'Utility', 'Approach', 'Scenario', 'Modal',
function ($scope, $routeParams, Shared, Utility, Approach, Scenario, Modal)
{
    function setInitializeScope()
    {
        $scope.approach = [];
        $scope.scenarioList = [];
        $scope.showScenarioList = false;
    }
    
    function getInitializeData()
    {
        Approach.resource.get().$promise.then(function(approachResponse)
        {
            $scope.approach = approachResponse.data;
            
            Scenario.resource.valid().$promise.then(function(scenarioResponse)
            {
                $scope.scenarioList = scenarioResponse.data;
                $scope.showScenarioList = (0 < $scope.scenarioList.length);
            });
        });
    }
    
    function setEventListeners()
    {
        $scope.$on('dropItemComplete', function(event, data)
        {
            $scope.scenarioList = data.to;
            $scope.$apply();
        });
    }
    
    $scope.initialize = function()
    {
        $scope._construct();
        setInitializeScope();
        getInitializeData();
        setEventListeners();
        Shared.setRoot('approach');
    };
    
    $scope.save = function()
    {
        console.log($scope.approach);
        Approach.resource.save($scope.approach).$promise.then(function(response)
        {
            Utility.info('設定を更新しました');
        });
    };
    
    $scope.savePriority = function()
    {
        console.log($scope.scenarioList);
        Scenario.resource.priority({data: $scope.scenarioList}).$promise.then(function(response)
        {
            Utility.info('優先順位を更新しました');
        });
    };
    
    $scope.showDiscription = function(id)
    {
        var info = Approach.getInfomation(id);
        
        $scope.modalParam = 
        {
            title: info.title,
            message: info.message,
            isExecute: false,
        };
        $scope.modalInstance = Modal.open($scope, "partials/modal/message.html");
    };

    $scope.bulkInvalid = function()
    {
        var params = 
        {
            title: 'シナリオの一括無効について',
            text: '有効なシナリオをすべて無効にしますがよろしいですか？<br>実行した場合、実行予定シナリオはなくなります。',
            confirmButtonText: '一括で無効にする',
            execute: function()
            {
                Scenario.resource.bulkInvalid().$promise.then(function(response)
                {
                    Utility.info('アプローチ対象シナリオをすべて無効しました。');
                    $scope.initialize();
                });
            }
        };
        Utility.infoAlert(params);
    };
    
    $scope.bulkEnable = function()
    {
        var params = 
        {
            title: 'シナリオの一括有効について',
            text: '無効なシナリオをすべて有効にしますがよろしいですか？<br>実行した場合、実行予定シナリオとしてダッシュボード画面に表示されます。',
            isExecute: true,
            confirmButtonText: '一括で有効にする',
            execute: function()
            {
                Scenario.resource.bulkEnable().$promise.then(function(response)
                {
                    Utility.info('アプローチ対象シナリオをすべて有効しました。');
                    $scope.initialize();
                });
            }
        };
        Utility.infoAlert(params);
    };
    
}]);

/**
 * @ngdoc function
 * @name workspaceApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the workspaceApp
 */
var userCtrl = angular.module('userCtrl',['UesrServices']);
userCtrl.controller('UserCtrl',['$scope', '$routeParams','Shared', 'User', 'Utility',
function ($scope, $routeParams, Shared, User, Utility)
{
    function setInitializeScope()
    {
        $scope.userList = [];
    }
    
    $scope.initialize = function()
    {
        Shared.setRoot('user');
        $scope._construct();
        setInitializeScope();

        User.resource.get().$promise.then(function(response)
        {
            $scope.userList = response.data;
        });
    };
    
    $scope.remove = function(id)
    {
        User.resource.delete({id: id}).$promise.then(function(response)
        {
            angular.forEach($scope.userList, function(v, k)
            {
                if (v.user_id === id)
                {
                    $scope.userList.splice(k,1);
                }
            });
            Utility.successSticky('ユーザーを削除しました');
        });
        
    };
    
}]);

/**
 * @ngdoc function
 * @name workspaceApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the workspaceApp
 */
var userControlCtrl = angular.module('userControlCtrl',['UesrServices','RoleServices']);
userControlCtrl.controller('UserControlCtrl',['$scope', '$routeParams', 'User', 'Role', 'Utility', 'Shared','Location',
function ($scope, $routeParams, User, Role, Utility, Shared, Location)
{
    var pageProp = User.getPageProp($routeParams.id);
    
    function setInitializeScope()
    {
        $scope.user = {};
        $scope.pageTitle = pageProp.title;
        $scope.showPassword = true;
        $scope.passwordEdit = {show: '1'};
        $scope.pageType = pageProp.type;

        if (2 === pageProp.type)
        {
            $scope.passwordEdit.show = '0';
            $scope.showPassword = false;
            var id = parseInt($routeParams.id, 10);
            User.resource.get({id: id}).$promise.then(function(response)
            {
                $scope.user = response.data[0];
                $scope.user.password_confirm = $scope.user.password;
            });
        }
    }
    
    // TODO コントローラーに記載すべきなのか。。。。。
    function setValidation()
    {
        $scope.validators = 
        {
            password:
            {
                // ユーザー名とパスワードは一緒はダメ
                same: function (modelValue, viewValue)
                {
                    var val = modelValue || viewValue;
                    var user = $scope.user || {};
    
                    return val != user.name;
                }
            },
            password_confirm:
            {
                // パスワード確認
                confirm: function (modelValue, viewValue)
                {
                    var user = $scope.user || {};
                    var val = modelValue || viewValue;
    
                    return val == user.password;
                }
            },
            selected_role:
            {
                // ロール選択
                role: function (modelValue, viewValue)
                {
                    var roleList = $scope.roleList || {};
                    var isSelect = false;
                    angular.forEach(roleList, function(item, key)
                    {
                        if (item.isPush) isSelect = true;
                    });
                    return isSelect;
                }
            },
        };
        $scope.asyncValidators = 
        {
            mailaddress:
            {
                same: function (modelValue, viewValue)
                {
                    var val = modelValue || viewValue;
                    if (void 0 === val || val.length === 0) return true;
                    
                    return User.validators.isSameMailAddress($scope.user.user_id, val);
                }
            }
        };
    }
    
    function setRole(items)
    {
        angular.forEach(items, function(item, key)
        {
            if (item.isPush)
            {
                $scope.user.role_id = item.role_id;
            }
        });
    }
    
    $scope.initialize = function()
    {
        Shared.setRoot('user control');
        $scope._construct();
        setInitializeScope();
        setValidation();

        Role.resource.get().$promise.then(function(response)
        {
            $scope.roleList = response.data;
        });
        
        if (1 === $scope.passwordEdit)
        {
            // user_name != password判定のため
            $scope.$watch('user.name', function()
            {
                $scope.userForm.password.$validate();
            });
     
            // password == password_confirm判定のため
            $scope.$watch('user.password', function()
            {
                $scope.userForm.password_confirm.$validate();
            });
        }
    
        $scope.$watch('roleList', function()
        {
            $scope.userForm.selected_role.$validate();
        },true);
    };
    
    /**
     * 登録/更新
     */
    $scope.save = function()
    {
        setRole($scope.roleList);
        
        var message = $scope.user.name + 'さんの情報を保存しました';
        if (2 === pageProp.type)
        {
            Utility.deleteCommonInfo($scope.user);
            if ('1' !== $scope.passwordEdit.show)
            {
                delete $scope.user.password_confirm;
                delete $scope.user.password;
            }
            User.resource.save({id: $scope.user.user_id, data: $scope.user}).$promise.then(function(response)
            {
                Utility.successSticky(message);
                Location.user();
            });
        }
        else
        {
            User.resource.create({data: $scope.user}).$promise.then(function(response)
            {
                Utility.successSticky(message);
                Location.user();
            });
        }
    };
    
    $scope.isSameMailAddress = function()
    {
        $scope.userForm.mailaddress.$validate();
    };

}]);

var accessCtrl = angular.module('accessCtrl',['AccessServices']);
accessCtrl.controller('AccessCtrl',['$scope', '$sce', '$routeParams', 'Shared', 'Access', 'Utility',
function ($scope, $sce, $routeParams, Shared, Access, Utility)
{
    function setInitializeScope()
    {
        $scope.showDate = '';
        $scope.serchDay = '';
        Shared.destloy('serchDay');
        Shared.setRoot('accsess');
    }
    
    function getInitializeData()
    {
        var today = Utility.today('YYYY-MM-DD');
        Access.resource.day({day: today}).$promise.then(function(response)
        {
            $scope.logList = response.data;
        });
    }
    
    $scope.initialize = function()
    {
        $scope.$emit('requestStart');
        
        $scope._construct();
        setInitializeScope();
        getInitializeData();
        
        $scope.$emit('requestEnd');
    };
    
    $scope.serchByDay = function()
    {
        if (Utility.isDateValid($scope.serchDay))
        {
            Access.resource.day({day: $scope.serchDay}).$promise.then(function(response)
            {
                $scope.logList = response.data;
                Shared.set('serchDay', $scope.serchDay);
            });
        }
    };
    
    //time line functions 
    function getTimeInitializeData()
    {
        var day = Shared.get('serchDay');
        if (void 0 === day)
        {
            day = Utility.today('YYYY-MM-DD');
        }
        getTimeLine(day);
    }
    
    function getTimeLine(day)
    {
        Access.resource.day({day: day, id: $routeParams.id}).$promise.then(function(response)
        {
            $scope.targetName = response.data[0].name;
            $scope.showDate = day;
            $scope.timelineList = response.data;
        });
    }

    $scope.timeLineInitialize = function()
    {
        getTimeInitializeData();
    };
    
    $scope.setPosition = function(index)
    {
        return index % 2 == 0;
    };
    
}]);

var bugCtrl = angular.module('bugCtrl',['BugServices']);
bugCtrl.controller('BugCtrl',['$rootScope','$scope', '$sce', 'Upload', 'Shared', 'Bug', 'Modal','Utility',
function ($rootScope, $scope, $sce, Upload, Shared, Bug, Modal, Utility)
{
    $scope.selectedFile = [];
    
    function setInitializeScope()
    {
        $scope.bug = {resolve: 0, type: null};
    }
    
    function getInitializeData()
    {
        getInfo();
    }
    
    function getInfo()
    {
        Bug.resource.getByConditon($scope.bug).$promise.then(function(response)
        {
            $scope.isBugShow = response.data.length > 0;
            if ($scope.isBugShow)
            {
                Bug.addViewInfo(response.data);
                $scope.bugList = response.data;
                $scope.roleId = response.role;
            }
        });
    }
    
    $scope.initialize = function()
    {
        $scope._construct();
        setInitializeScope();
        getInitializeData();
    };
    
    $scope.show = function()
    {
      $scope.modalParam = 
      {
          type: '',
          title: '',
          contents: '',
          category: '',
          categoryList: Bug.categoryList,
          files: null,
      };
      $scope.modalInstance = Modal.open($scope, "partials/modal/send.html");
    };
    
    $scope.apology = function()
    {
        Utility.info('障害ですか。。。<br>すみません！');
    };
    
    $scope.getByCondition = function()
    {
        getInfo();
    };

    $scope.resolve = function(index)
    {
        var name = $scope.bugList[index].title;
        Bug.resource.resolve({id: $scope.bugList[index].id}).$promise.then(function(response)
        {
            Utility.info(name + '<br>を解決しました。');
            $scope.bugList[index].resolve_name = '解決';
            getInfo();
        });
    };

    $scope.save = function()
    {
        var params = 
        {
            type: $scope.modalParam.type,
            title: $scope.modalParam.title,
            contents: $scope.modalParam.contents,
            category: $scope.modalParam.category.type,
        };
        
        if (null !== $scope.modalParam.files)
        {
            $rootScope.$broadcast('requestStart');
            Bug.saveAndUpload($scope.modalParam.files, params, function(err)
            {
                $scope.modalInstance.close();
                if (null !== err)
                {
                    Utility.error(err);
                }
                getInfo();
                $rootScope.$broadcast('requestEnd');
            });
        }
        else
        {
            Bug.resource.save(params).$promise.then(function(response)
            {
                Utility.info('ありがとございました。');
                $scope.modalInstance.close();
                getInfo();
            });
        }
    };
    
    $scope.showComment = function(index)
    {
        $scope.modalParam = 
        {
            execute: saveComment,
            onFileSelect: onFileSelect,
            files: null,
            newComment: '',
            id: $scope.bugList[index].id,
        };
        $scope.modalInstance = Modal.open($scope, "partials/modal/comment.html");
    };
    
    function onFileSelect($files)
    {
		$scope.selectedFile.push($files[0]);
    }
    
    $scope.showCommentView = function(index)
    {
        Bug.resource.getComment({id: $scope.bugList[index].id}).$promise.then(function(response)
        {
            $scope.bugList[index].comments = response.data;
        });
    };
    
    $scope.vote = function(index)
    {
        Bug.resource.vote({id: $scope.bugList[index].id}).$promise.then(function(response)
        {
            getInfo();
//            $scope.bugList[index].comments = response.data;
        });
    };

    function saveComment()
    {
        if (0 === $scope.modalParam.newComment.length) return;
        var params = 
        {
            demand_bug_id: $scope.modalParam.id,
            comment: $scope.modalParam.newComment,
        };
        if (null !== $scope.modalParam.files)
        {
            $rootScope.$broadcast('requestStart');
            Bug.commentSaveAndUpload($scope.modalParam.files, params, function(err)
            {
                $scope.modalInstance.close();
                if (null !== err)
                {
                    Utility.error(err);
                }
                getInfo();
                $rootScope.$broadcast('requestEnd');
            });
        }
        else
        {
            Bug.resource.saveComment(params).$promise.then(function(response)
            {
                $scope.modalInstance.close();
                getInfo();
            });
        }
    }
    
    $scope.download = function(id)
    {
        if (null === id || void 0 === id) return false;
        Bug.resource.download({id: id}).$promise.then(function(response)
        {
            $scope.modalInstance.close();
            getInfo();
        });
    };
}]);

/**
 * @ngdoc function
 * @name workspaceApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the workspaceApp
 */
var mapCtrl = angular.module('mapCtrl',[]);
mapCtrl.controller('MapCtrl',['$scope', 'Shared', 'Utility',
function ($scope, GEO, Shared, Utility)
{
    /**
     * scope初期化用
     */
    function setInitializeScope()
    {
        
    }
    
    /**
     * 初期処理
     * @author niikawa
     */
    $scope.initialize = function()
    {
        $scope._construct();
        setInitializeScope();
    };
    
}]);

/**
 * 共通サービス
 * 
 * @author niikawa
 */
var utilsServices = angular.module("myApp");
utilsServices.service("Utility", ['$rootScope', function($rootScope)
{
    //--------------------------------------------------------------------------
    //共通項目除去
    //--------------------------------------------------------------------------
    this.deleteCommonInfo = function(param)
    {
        if (angular.isArray(param))
        {
            angular.forEach(param, function(data, k)
            {
                if (data.hasOwnProperty('delete_flag')) delete data.delete_flag;
                if (data.hasOwnProperty('create_by')) delete data.create_by;
                if (data.hasOwnProperty('create_date')) delete data.create_date;
                if (data.hasOwnProperty('update_by')) delete data.update_by;
                if (data.hasOwnProperty('update_date')) delete data.update_date;
            });
        }
        else
        {
            if (param.hasOwnProperty('delete_flag')) delete param.delete_flag;
            if (param.hasOwnProperty('create_by')) delete param.create_by;
            if (param.hasOwnProperty('create_date')) delete param.create_date;
            if (param.hasOwnProperty('update_by')) delete param.update_by;
            if (param.hasOwnProperty('update_date')) delete param.update_date;
        }
    };
    
    //--------------------------------------------------------------------------
    //メッセージアラート
    //stickyの場合は自動で消えない
    //--------------------------------------------------------------------------
    this.info = function(message, position)
    {
        position = position == null ? 'top-center' : position;
        $().toastmessage('showToast', {
            text     : message,
            sticky   : false,
            position : position,
            type     : 'notice'
        });
    };
    
    this.infoSticky = function(message, position) {
        position = position == null ? 'top-center' : position;
        $().toastmessage('showToast', {
            text     : message,
            sticky   : true,
            position : position,
            type     : 'notice'
        });
    };
    
    this.warning = function(message, position) {
        position = position == null ? 'top-center' : position;
        $().toastmessage('showToast', {
            text     : message,
            sticky   : false,
            position : position,
            type     : 'warning'
        });
    };

    this.warningSticky = function(message, position) {
        position = position == null ? 'top-center' : position;            
        $().toastmessage('showToast', {
            text     : message,
            sticky   : true,
            position : position,
            type     : 'warning'
        });
    };
    
    this.error = function(message, position) {
        position = position == null ? 'top-center' : position;            
        var dispMessage = (message.trim().length === 0) ? '通信エラー' : message;
        $().toastmessage('showToast', {
            text     : dispMessage,
            sticky   : false,
            position : position,
            type     : 'error'
        });
    };

    this.errorSticky = function(message, position) {
        position = position == null ? 'top-center' : position;
        var dispMessage = (message.trim().length === 0) ? '通信エラー' : message;
        $().toastmessage('showToast', {
            text     : dispMessage,
            sticky   : true,
            position : position,
            type     : 'error'
        });
    };
    
    this.success = function(message, position) {
        position = position == null ? 'top-center' : position;            
        $().toastmessage('showToast', {
            text     : message,
            sticky   : false,
            position : position,
            type     : 'success'
        });
    };        

    this.successSticky = function(message, position) {
        position = position == null ? 'top-center' : position;
        $().toastmessage('showToast', {
            text     : message,
            sticky   : true,
            position : position,
            type     : 'success'
        });
    };
    
    //--------------------------------------------------------------------------
    //日付
    //本アプリケーションは日付に関してmoment.jsに依存させるため必ず読み込むこと
    //http://momentjs.com/
    //--------------------------------------------------------------------------
    //momentオブジェクトを取得する
    this.momentDefault = function() {
        return moment();
    };
    this.moment = function(d) {
        return moment(d);
    };
    //本日の日付けを文字列で取得する
    this.today = function(format) {
        var formatString = (null == format) ? 'YYYY-MM-DD' : format;
        return this.moment().format(formatString);
    };
    //指定したフォーマットでパラメータの日付を文字列で取得する
    this.formatString = function(d,format) {
        var formatString = (null == format) ? 'YYYY-MM-DD' : format;
        return this.moment(d).format(formatString);
    };
    
    //指定した年月の持つ最終日を取得する
    this.dayInMonth = function(a) {
        return moment(a).daysInMonth();
    };
    //aがbより未来かを判定する
    this.isAfter = function(a, b) {
        return moment(a).isAfter(moment(b));
    };
    this.getMomemtObject = function(date) {
        return moment(date);
    };
    //
    // add
    //
    this.addDay = function(a, b) {

        return moment(a).add(b, 'day');
    };
    this.addMonth = function(a, b) {

        return moment(a).add(b, 'month');
    };
    this.addYear = function(a, b) {

        return moment(a).add(b, 'year');
    };
    //
    // subtract
    //
    this.subtractDay = function(a, b) {
        
        return moment(a).subtract('day', b);
    };
    
    this.subtractMonth = function(a, b) {
        
        return moment(a).subtract('month', b);
    };
    this.subtractYear = function(a, b) {
        
        return moment(a).subtract('year', b);
    };
    //
    // diff
    //
    this.diffDay = function(a, b) {
        
        return moment(a).diff(moment(b), 'day');
    };

    this.diffMonth = function(a, b) {
        
        return moment(a).diff(moment(b), 'month');
    };

    this.diffYear = function(a, b) {
        
        return moment(a).diff(moment(b), 'year');
    };

    this.createDayList = function(maxDay) {
        
        var dayList = [];
        for (var index=1; index <= maxDay; index++) {
            var day = ('00' + index).slice(-2);
            dayList.push({value:day, text:day});
        }
        return dayList;
    };
    
    this.createMonthList = function() {
        var monthList = [];
        for (var index=1; index < 12; index++) {
            var month = ('00' + index).slice(-2);
            monthList.push({value:month, text:month});
        }
        return monthList;
    };
    
    this.createYearList = function(min, max) {
        
        var yearList = [];
        for (var year= min; year <= max; year++) {
            yearList.push({value:String(year), text:year});
        }
        return yearList;
    };
    
    this.setSpinner = function(bool)
    {
        if (bool)
        {
            $rootScope.$broadcast('requestStart');
        }
        else
        {
            $rootScope.$broadcast('requestEnd');
        }
    };
    
    this.isDateValid = function(target, delimiter)
    {
        if (null === target) return false;
        if (void 0 === delimiter) delimiter = '-';
        var days = target.split(delimiter);
        if (3 !== days.length) return false;
        
        var m = this.moment(target);
        return m.isValid();
    };
    
    this.confirmAlert = function(execute)
    {
        swal({
            title: "削除してもよろしいですか？",
            type: "warning",
            allowOutsideClick: true,
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "削除する",
            cancelButtonText:"キャンセル",
            closeOnConfirm: true,
            html: false
        }, function() {
            execute();
        });
    };
    this.infoAlert = function(params)
    {
        swal({
            title: params.title,
            text: params.text,
            type: "info",
            allowOutsideClick: true,
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: params.confirmButtonText,
            cancelButtonText:"閉じる",
            closeOnConfirm: true,
            html: true
        }, function() {
            params.execute();
        });
    };
}]);
var sharedServices = angular.module("myApp");
sharedServices.service('Shared', function()
{
    var sharedServices = {};
    var data = {};
    
    sharedServices.set = function(name, value)
    {
        data[name] = value;
    };
    
    sharedServices.setRoot = function(value)
    {
        if (!data.hasOwnProperty('applicationAccsessRoot'))
        {
            data['applicationAccsessRoot'] = [];
        }
        data['applicationAccsessRoot'].push(value);
    };
    sharedServices.getRoot = function(value)
    {
        return data['applicationAccsessRoot'];
    };
    
    sharedServices.get = function(name) {
        return data[name];
    };
    
    sharedServices.destloyByName = function(name)
    {
        delete data[name];
    };

    sharedServices.destloy = function()
    {
        data = [];
    };

    return sharedServices;
});

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
var modalService = angular.module("myApp");
modalService.service("Modal", ["$modal" ,　function($modal) 
{
    var open = function($scope, path) {
        return $modal.open(
                {
                    templateUrl : path,
                    backdrop : 'static',
                    scope: $scope
                }
            );
        };
        return {open: open};
    }]
);
var mailServices = angular.module("myApp");
mailServices.service("Mail", ['$resource',
    function($resource) 
    {
        var mailServices = {};
        
        mailServices.resource = $resource('https://api-gozaru9.c9.io/V1/mail/:site/', {site: '@site'});

        return mailServices;
    }
]);
angular.module('myApp').factory('d3Service', function () {
  return {d3: d3};
});

/**
 * 共通サービス
 * 
 * @author niikawa
 */
var locationServices = angular.module("myApp");
locationServices.service("Location", ['$location',function($location)
{
    var locationServices = {};
    
    locationServices.home = function()
    {
        $location.path('/');
    };
    
    locationServices.user = function()
    {
        $location.path('/user');
    };

    locationServices.query = function()
    {
        $location.path('/query');
    };

    locationServices.query = function()
    {
        $location.path('/query/list');
    };

    locationServices.querySet = function()
    {
        $location.path('/query/set');
    };

    locationServices.querySave = function()
    {
        $location.path('/query/save');
    };

    locationServices.segment = function()
    {
        $location.path('/segment');
    };

    locationServices.segmentControl = function(id)
    {
        $location.path('/segment/control/'+id);
    };

    locationServices.trigger = function()
    {
        $location.path('/scenario/trigger');
    };

    locationServices.schedule = function()
    {
        $location.path('/scenario/schedule');
    };

    return locationServices;

}]);
/**
 * アプリケーション固有の通信を伴言わない処理を記述するサービスクラス
 **/
var mainServices = angular.module("myApp");
mainServices.service("Main", function()
{
    var mainService = {};
    
    mainService.getUserIdFromList = function(list, parent, child)
    {
        return list[parent].my._id;
    };
    
    mainService.getTaskIdFromList = function(list, parent, child)
    {
        return list[parent].taskList[child]._id;
    };

    mainService.removeTaskByIndex = function(list, parent, child)
    {
        list[parent].taskList.splice(child, 1);
    };

    mainService.getProgressFromList = function(list, parent, child)
    {
        return list[parent].taskList[child].progress;
    };

    mainService.getContentsFromList = function(list, parent, child)
    {
        return list[parent].taskList[child].contents;
    };


    return mainService;

});
var customerServices = angular.module("CustomerServices", ["ngResource"]);
customerServices.factory("Customer", ['$resource','Utility',
    function($resource, Utility) 
    {
        var customerServices = {};
        
        customerServices.resource = $resource('/customer/:id/', {id: '@id'},
        {
            detail:
            {
                method: 'GET',
                url: 'custmoer/detail/:id',
                cache: true,
            },
            orders:
            {
                method: 'GET',
                url: 'custmoer/orders/:id',
                cache: true,
            }
        });

        return customerServices;
    }
]);
var scenarioServices = angular.module("ScenarioServices", ["ngResource"]);
scenarioServices.factory("Scenario", ['$resource','$http','$q','Utility',
    function($resource, $http, $q, Utility) 
    {
        var scenarioServices = {};

        var pageProp = {
                schedule: {type: 1, mode: 0, title: 'スケジュール型', addTitle: '', template: 'views/scenario/schedule.html'}, 
                trigger: {type: 2, mode: 0, title: 'トリガー型', addTitle: '', template: 'views/scenario/trigger.html'}
        };
        scenarioServices.daysCondition = function()
        {
            var data = [];
            var num = 31;
            for (var index = 1; index <= num ; index++)
            {
                data.push({name: index, check:false});
            }
            data.push({name: '最終日', check:false});
            return data;
        };

        scenarioServices.resource = $resource('/scenario/:type/:id/', {id: '@id'},
        {
            list:
            {
                method: 'GET',
                url: 'scenario/list/:id',
                cache: true,
            },
            initializeData:
            {
                method: 'GET',
                url: 'scenario/initialize/:type/:id',
            },
            action:
            {
                method: 'GET',
                url: 'action/:name',
                cache: true,
            },
            save:
            {
                method: 'POST',
                url: 'scenario/save',
            },
            remove:
            {
                method: 'DELETE',
                url: 'scenario/:type/remove/:id',
            },
            valid:
            {
                method: 'GET',
                url: 'scenario/valid',
            },
            priority:
            {
                method: 'POST',
                url: 'scenario/priority',
            },
            typeCount:
            {
                method: 'GET',
                url: 'scenario/typecount',
            },
            executeplan:
            {
                method: 'GET',
                url: 'scenario/execute/plan',
            },
            bulkInvalid:
            {
                method: 'GET',
                url: 'scenario/bulkInvalid',
            },
            bulkEnable:
            {
                method: 'GET',
                url: 'scenario/bulkEnable',
            },
        });
        
        scenarioServices.getPageProp = function(type, id)
        {
            var target = pageProp[type];
            target.addTitle = (void 0 === id) ? '登録' : '更新';
            target.mode = (void 0 === id) ? 1 : 2;
            
            return target;
        };
        
        scenarioServices.validators =
        {
            isSameName : function(parameters)
            {
                return $http.post('scenario/name/', parameters
                ).then(function(response)
                {
                    if (response.data.result.count > 0)
                    {
                        return $q.reject('exists');
                    }
                    return false;
                });
            },
        };
        
        scenarioServices.setActivePushItem = function(items, propertie, bindObj, bindProp)
        {
            angular.forEach(items, function(item, key)
            {
                if (item.isPush)
                {
                    bindObj[bindProp] = item[propertie];
                    return false;
                }
            });
        };
        
        scenarioServices.createCondtionString = function(list)
        {
            var condition = '';
            var last = list.length - 1;
            angular.forEach(list, function(item, key)
            {
                condition += item.logicalname + 'が[' + item.condition.value1;
                if ('' !== item.condition.value2)
                {
                    condition += ',' + item.condition.value2;
                }
                condition += ']' + item.selectedCondition.name;
                
                if (key !== last)
                {
                    condition += ('AND' === item.condition.where) ? ' かつ ' : ' または ';
                }
            });
            return condition;
        };
        
        scenarioServices.getConditionDoc = function(list)
        {
            var doc = [];
            angular.forEach(list, function(items, key)
            {
                var push = [];
                angular.forEach(items, function(item, key)
                {
                    push.push(
                    {
                        physicalname: item.physicalname,
                        condition: item.condition,
                        selectedCondition: item.selectedCondition
                    });
                });
                doc.push(push);
            });
            return doc;
        };
        
        return scenarioServices;
    }
]);
var segmentServices = angular.module("SegmentServices", ["ngResource"]);
segmentServices.factory("Segment", ['$resource', '$http','Utility',
    function($resource, $http, Utility) 
    {
        var segmentServices = {};
        
        segmentServices.resource = $resource('/segment/:id/', {id: '@id'},
        {
            getDoc:
            {
                method: 'GET',
                url: 'segment/getdoc',
            },
            saveDoc:
            {
                method: 'POST',
                url: 'segment/savedoc',
            },
            save:
            {
                method: 'POST',
                url: 'segment/save',
            },
            download:
            {
                method: 'GET',
                url: 'segment/:id/download',
            },
            remove:
            {
                method: 'DELETE',
                url: 'segment/remove/:id/:segment_document_id',
            },
            executeQuery:
            {
                method: 'POST',
                url: 'segment/execute',
            },
            useSegment:
            {
                method: 'POST',
                url: '/segment/query/use',
            }
        });

        segmentServices.pageProp = function(id)
        {
            if (void 0 === id)
            {
                return {
                    viewMode: 1,
                    pageTitle: '登録'
                };
            }
            else
            {
                return {
                    viewMode: 2,
                    pageTitle: '更新'
                };
            }
        };
        
        segmentServices.setWhereProp = function(list, initializeData)
        {
            if (void 0 === initializeData)
            {
                angular.forEach(list, function(v, k)
                {
                    v.where = 'AND';
                });
            }
            else
            {
                angular.forEach(list, function(v, k)
                {
                    var value = (null === initializeData[k]) ? 'AND' : initializeData[k];
                    v.where = value;
                });
            }
        };
        
        segmentServices.setListData = function(queryList, queryIdList, conditionList)
        {
            angular.forEach(queryIdList, function(qid, k1)
            {
                angular.forEach(queryList, function(query, k2)
                {
                    if (qid == query.id)
                    {
                        conditionList.push(query);
                        queryList.splice(k2, 1);
                    }
                });
            });
        };
        
        segmentServices.createExecuteInfo = function(list)
        {
            var qIds = [];
            var where = {};
            var tables = {};
            
            angular.forEach(list, function(v, k)
            {
                qIds.push(v.id);
                where[v.id] = v.where;
                Object.keys(v.tables).forEach(function(key)
                {
                    if (!tables.hasOwnProperty(key))
                    {
                        tables[key] = key;
                    }
                });
            });
            return {qIds: qIds, tables: tables, conditionMap: where};
        };
        
        segmentServices.createSQL = function(list)
        {
            var sql = '';
            var last = list.length -1;
            angular.forEach(list, function(v, k)
            {
                sql += '(' + v.sql + ') ' ;
                if (last !== k) sql += v.where;
            });
            return sql;
        };
        
        segmentServices.getTables = function(list)
        {
            var tables = {};
            angular.forEach(list, function(v, k)
            {
                Object.keys(v.tables).forEach(function(key)
                {
                    if (!tables.hasOwnProperty(key))
                    {
                        tables[key] = key;
                    }
                });
            });
            
            return tables;
        };
        
        segmentServices.createDocData = function(list)
        {
            var sql = '';
            var last = list.length -1;
            var ids = [];
            var where = [];
            angular.forEach(list, function(v, k)
            {
                sql += '(' + v.sql + ') ' ;
                if (last !== k) sql += v.where;
                ids.push(v.id);
                where.push(v.where);
            });
            
            return {condition: sql, qIds: ids, whereList: where};
        };
   
        return segmentServices;
    }
]);
var queryServices = angular.module("QueryServices", ["ngResource"]);
queryServices.factory("Query", ['$resource', '$http','Shared',
    function($resource, $http, Shared)
    {
        var queryServices = {};
        
        queryServices.sql = '';
        
        queryServices.resource = $resource('/query', {id: '@id'},
        {
            getQuery:
            {
                method: 'GET',
                url: '/query/get',
            },
            getList:
            {
                method: 'GET',
                url: '/query/list',
            },
            getControlInit:
            {
                method: 'GET',
                url: '/query/control/:id',
            },
            create:
            {
                method: 'POST',
                url: '/query/create',
            },
            remove:
            {
                method: 'DELETE',
                url: '/query/:id',
            },
            getUseSegment:
            {
                method: 'GET',
                url: '/query/use/segment/:id',
            },
            executeQuery:
            {
                method: 'POST',
                url: '/query/execute',
            },
        });

        queryServices.getContentsByColumsType = function(type)
        {
            var countents = {inputType:'', };
            console.log(type);
            if ('INT' === type)
            {
                countents.inputType = 'number';
            }
            else if ('VARCHAR' === type)
            {
                countents.inputType = 'text';
            }
            else if ('DATETIME' === type)
            {
                countents.inputType = 'date';
            }
            return countents.inputType;
        };
        
        queryServices.createCondtionString = function(list)
        {
            angular.forEach(list, function(v, k)
            {
                if (void 0 === v.condition.value2 || '' === v.condition.value2)
                {
                    v.selectedCondition.condtionString = 
                        v.condition.value1 +''+ v.selectedCondition.name;
                }
                else
                {
                    v.selectedCondition.condtionString = 
                        v.condition.value1 +'から'+ v.condition.value2 + v.selectedCondition.name;
                }
            });
        };

        queryServices.getTables = function(list)
        {
            var tables = {};
            angular.forEach(list, function(v, k)
            {
                if (void 0 === tables[v.table.physicalname])
                {
                    tables[v.table.physicalname] = [];
                }
                var info = 
                {
                    column: v.column.physicalname,
                    conditionType: v.selectedCondition.value,
                    values: v.condition
                };
                tables[v.table.physicalname].push(info);
            });
            return tables;
        };
        
        queryServices.getRefTabels = function(tables)
        {
            var tableList = [];
            angular.forEach(tables, function(table)
            {
                tableList.push(table);
            });
            return tableList;
        };
        
        queryServices.getReturnURL = function()
        {
            var root = Shared.getRoot();
            var num = root.length;
            var before = root[root.length-1];
            var url = '';
            if ('query list' === before)
            {
                url = '/query/list';
            }
            else if ('query list' === before)
            {
                url = '/segment/control';
            }
            else
            {
                for (num; 0 < num; num--)
                {
                    if ('query list' === root[num])
                    {
                        url = '/query/list';
                        break;
                    }
                    else if ('segment control' === root[num])
                    {
                        url = '/segment/control';
                        break;
                    }
                }
            }
            return url;
        };

        return queryServices;
    }
]);
var approachServices = angular.module("ApproachServices", ["ngResource"]);
approachServices.factory("Approach", ['$resource','Utility',
    function($resource, Utility) 
    {
        var approachServices = {};
        
        approachServices.resource = $resource('/approach/');
        
        approachServices.pageProp = function(id)
        {
            
            if (void 0 === id)
            {
                return {
                    viewMode: 1,
                    pageTitle: '登録'
                };
            }
            else
            {
                return {
                    viewMode: 2,
                    pageTitle: '更新'
                };
            }
        };

        approachServices.getInfomation = function(id)
        {
            var info = {};
            if (1 === id)
            {
                info.title = '1日の制限回数について';
                info.message = '対象の顧客に対して1日に抽出対象とする回数になります。<br>複数のシナリオで抽出対象となる顧客の場合この回数以上は抽出されなくなります。';
            }
            else if (2 === id)
            {
                info.title = '1週間の制限回数について';
                info.message = '対象の顧客に対して1週間に抽出対象とする回数';
            }
            return info;
        };
        
        return approachServices;
    }
]);
var uesrServices = angular.module("UesrServices", ["ngResource"]);
uesrServices.factory("User", ['$resource','$http','$q','Utility',
    function($resource, $http, $q, Utility)
    {
        var userService = {};
        
        var pageProp = {
                regist: {type: 1, title: 'ユーザー登録'}, 
                edit: {type: 2, title: 'ユーザー更新'}
            };
        
        userService.resource = $resource('/user/:id', {id: '@id'},
        {
            create:
            {
                method: 'POST',
                url: 'user/create',
            },
            remove:
            {
                method: 'GET',
                url: 'user/delete',
            },
        });
        
        userService.validators = 
        {
            isSameMailAddress : function(userId, mailaddress)
            {
                return $http.post('user/mail/',{user_id: userId, mailaddress: mailaddress}
                ).then(function(response)
                {
                    if (response.data.result.count > 0)
                    {
                        return $q.reject('exists');
                    }
                    return false;
                });
            }
        };
        
        //生年月日を生成
        userService.createBirth = function (year, month, day)
        {
            if ('' !== year && '' !== month && '' !== day ) {
                
                return year + '-' + month + '-' + day;
            }
            return '';
        };
        
        //都道府県を取得
        userService.getPrefectures = function()
        {
            return [
                {value:'01', text:'北海道'},{value:'02', text:'青森'}, {value:'03', text:'岩手'},
                {value:'04', text:'宮城'},{value:'05', text:'秋田'}, {value:'06', text:'山形'},
                {value:'07', text:'福島'},{value:'08', text:'茨城'}, {value:'09', text:'栃木'},
                {value:'10', text:'群馬'},{value:'11', text:'埼玉'}, {value:'12', text:'千葉'},
                {value:'13', text:'東京'},{value:'14', text:'神奈川'}, {value:'15', text:'新潟'},
                {value:'16', text:'富山'},{value:'17', text:'石川'}, {value:'18', text:'福井'},
                {value:'19', text:'山梨'},{value:'20', text:'長野'}, {value:'21', text:'岐阜'},
                {value:'22', text:'静岡'},{value:'23', text:'愛知'}, {value:'24', text:'三重'},
                {value:'25', text:'滋賀'},{value:'26', text:'京都'}, {value:'27', text:'大阪'},
                {value:'28', text:'兵庫'},{value:'29', text:'奈良'}, {value:'30', text:'和歌山'},
                {value:'31', text:'鳥取'},{value:'32', text:'島根'}, {value:'33', text:'岡山'},
                {value:'34', text:'広島'},{value:'35', text:'山口'}, {value:'36', text:'徳島'},
                {value:'37', text:'香川'},{value:'38', text:'愛媛'}, {value:'39', text:'高知'},
                {value:'40', text:'福岡'},{value:'41', text:'佐賀'}, {value:'42', text:'長崎'},
                {value:'43', text:'熊本'},{value:'44', text:'大分'}, {value:'45', text:'宮崎'},
                {value:'46', text:'鹿児島'},{value:'47', text:'沖縄'},
            ];
        };
        
        userService.getPageProp = function(id)
        {
            if (void 0 === id)
            {
                return pageProp.regist;
            }
            else
            {
                return pageProp.edit;
            }
            
        };
        
        userService.getSelectedUserIdAndML = function(list, name)
        {
            var selectedList = [];
            var num = list.length;
            for (var i = 0; i < num; i ++)
            {
                if (list[i][name])
                {
                   selectedList.push({_id: list[i]._id, mailAddress:list[i].mailAddress}); 
                }
            }
            return selectedList;
        };

        return userService;        
    }
]);
var roleServices = angular.module("RoleServices", ["ngResource"]);
roleServices.factory("Role", ['$resource','Utility',
    function($resource, Utility) 
    {
        var roleServices = {};
        
        roleServices.resource = $resource('/role/:id', {id: '@id'}, {});

        return roleServices;
    }
]);
var accessServices = angular.module("AccessServices", ["ngResource"]);
accessServices.factory("Access", ['$resource','Utility',
    function($resource, Utility) 
    {
        var accessServices = {};
        
        accessServices.resource = $resource('/access/', {}, 
        {
            day: 
            {
                method:"POST",
                url: "/access"
            },
            dayByUser: 
            {
                method:"POST",
                url: "/access/user"
            }
        });
        return accessServices;
    }
]);
var bugServices = angular.module("BugServices", ["ngResource"]);
bugServices.factory("Bug", ['$resource','Utility', 'Upload',
    function($resource, Utility, Upload) 
    {
        var bugServices = {};
        
        bugServices.categoryList = 
        [
            {name: 'ダッシュボード', type: 1},
            {name: 'トリガーシナリオ管理', type: 2},
            {name: 'スケジュールシナリオ管理', type: 3},
            {name: 'セグメント管理', type: 4},
            {name: 'クエリー管理', type: 5},
            {name: 'アプローチ管理', type: 6},
            {name: 'ユーザー管理', type: 7},
            {name: '操作履歴', type: 8},
            {name: 'その他', type: 99},
        ];

        bugServices.resource = $resource('/bug/', {}, 
        {
            getByConditon:
            {
                method:"POST",
                url: "/bug"
            },
            resolve:
            {
                method:"GET",
                url: "/bug/resolve/:id"
            },
            save: 
            {
                method:"POST",
                url: "/bug/save"
            },
            saveComment: 
            {
                method:"POST",
                url: "/bug/save/comment"
            },
            getComment: 
            {
                method:"GET",
                url: "/bug/comment/:id"
            },
            vote:
            {
                method:"GET",
                url: "/bug/vote/:id"
            },
            download:
            {
                method:"GET",
                url: "/bug/download/:id"
            },
        });
        
        bugServices.commentSaveAndUpload = function(file, parameter, callback)
        {
            Upload.upload(
            {
                "url":"/bug/save/comment/upload/",
                file: file,
                data: {data: parameter},
            }).success(function(result, status, headers, config)
            {
                callback(null);
                
            }).error(function()
            {
                callback("通信エラー");
            });
        };
        
        bugServices.saveAndUpload = function(file, parameter, callback)
        {
            Upload.upload(
            {
                "url":"/bug/save/upload/",
                file: file,
                data: {data: parameter},
            }).success(function(result, status, headers, config)
            {
                callback(null);
                
            }).error(function()
            {
                callback("通信エラー");
            });
        };
        
        bugServices.addViewInfo = function(list)
        {
            angular.forEach(list, function(item)
            {
                switch (item.category)
                {
                    case 1:
                        item.category_name = 'ダッシュボード';
                        break;
                    case 2:
                        item.category_name = 'トリガーシナリオ管理';
                        break;
                    case 3:
                        item.category_name = 'スケジュールシナリオ管理';
                        break;
                    case 4:
                        item.category_name = 'セグメント管理';
                        break;
                    case 5:
                        item.category_name = 'クエリー管理';
                        break;
                    case 6:
                        item.category_name = 'アプローチ管理';
                        break;
                    case 7:
                        item.category_name = 'ユーザー管理';
                        break;
                    case 8:
                        item.category_name = '操作履歴';
                        break;
                    default:
                        item.category_name = 'その他';
                }
                item.type_name = (1 === item.type) ? '要望' : 'バグ';
                item.resolve_name = (1 === item.resolve) ? '解決' : '未解決';
            });
        };

        return bugServices;
    }
]);
var azureServices = angular.module("AzureServices", ["ngResource"]);
azureServices.factory("Azure", ['$resource', '$http','Shared',
    function($resource, $http, Shared)
    {
        var azureServices = {};
        
        azureServices.resource = $resource('/customer/:id/', {id: '@id'},
        {
            recomender:
            {
                method: 'GET',
                url: '/azure/recomender/:id',
            },
        });

        return azureServices;
    }
]);
var myApp = angular.module('myApp');
myApp.controller('HeadCtrl',['$scope', 'Auth', 'Modal', 'Shared', 'Mail', function ($scope, Auth, Modal, Shared, Mail)
{
    $scope.initialize = function()
    {
        if (1 == Shared.get("role"))
        {
            $scope.isShowUser = true;
        }
        else
        {
            $scope.isShowUser = false;
        }
    };
    
    $scope.addMenber = function()
    {
        $scope.modalParam = 
        {
            mailaddress:'',
            execute: sendMail,
        };
        $scope.modalInstance = Modal.open($scope, "partials/memberAdd.html");
    };
    
    $scope.logout = function()
    {
        Shared.destloy();
        Auth.logout().then(function()
        {
            $('#view').addClass('view-animate-container-wide');
            $('#view').removeClass('view-animate-container');
            $scope.$emit('logoutConplete');
        });
    };
    
    var sendMail = function()
    {
        Mail.resource.save({site: 'niikawa'}).$promise.then(function()
        {
            $scope.modalInstance.close();
        });
    };
}]);

myApp.directive('myHeader', function(){
    return {
        restrict: 'E',
        replace: true,
        controller: 'HeadCtrl',
        templateUrl: 'partials/common/header.html',
        link: function (scope, element, attrs, ctrl) 
        {
            scope.isOpenMenu = true;
            $('#view').removeClass('view-animate-container-wide');
            $('#view').addClass('view-animate-container');

            scope.openClose = function()
            {
                scope.isOpenMenu = !scope.isOpenMenu;
                if (scope.isOpenMenu)
                {
                    $('#view').removeClass('view-animate-container-wide');
                    $('#view').addClass('view-animate-container');
                }
                else
                {
                    $('#view').removeClass('view-animate-container');
                    $('#view').addClass('view-animate-container-wide');
                }
            };
            
        }
    };
});


/**
 * オートコンプリートディレクティブ
 * 
 * [属性]
 * selectedItem : コントローラー側と選択した値のバインド用
 * itemList     : リスト表示用のデータ
 * 
 * [使用方法]
 * <auto-complete-directive item-list="trackerList" selected-item="ticketModel.tracker" ></auto-complete-directive>
 * 
 * @module autoCompleteDirective
 * @author niikawa
 */
var myApp = angular.module('myApp');
myApp.directive('autoCompleteDirective', function()
{
    return {
        restrict: 'E',
        scope: {selectedItem: '=', itemList: '=', execute: '&', namePropertie: '@', appendString: '@', showLabel: '=', selectByList: '=', selectName: '='},
        template:   '<form class="navbar-form navbar-left"><input ng-show="!isLabel" class="form-control d-complete-input" ng-model="selectName">' +
                    '<span ng-show="isLabel && selectName.length != 0" ng-click="changeElement()">{{appendString}}{{selectName}}</span>' +
                    '<ul class="complete-list" ng-show="isFocus">' +
                    '<li ng-repeat="item in itemList" ng-click="click($event, item)" >' +
                    '{{item[namePropertie]}}' +
                    '</li>' +
                    '</ul></form>',
        replace: true,
        link: function (scope, element, attrs) 
        {
            scope.selectName = '';
            scope.isFocus = false;
            scope.isLabel = false;
            var originList = [];
            scope.$watch('itemList', function(newValue, oldValue)
            {
                if (void 0 !== newValue && void 0 !== oldValue)
                {
                    console.log('watch itemList');
                    if (newValue.length === oldValue.length)
                    {
                        return false;
                    }
                    if (newValue.length > oldValue.length)
                    {
                        originList = angular.copy(newValue);
                    }
                    else if (newValue.length < oldValue.length)
                    {
                        originList = angular.copy(oldValue);
                    }
                }
                else
                {
                    if (void 0 !== scope.itemList)
                    {
                        console.log('set initialize data');
                        angular.copy(scope.itemList, originList);
                    }
                }
            });

            /**
             * 要素のインプットにフォーカが合った場合にリストを表示する
             * 
             * @author niikawa
             */
            element.find('input').on('focus', function()
            {
                if (0 < scope.itemList.length)
                {
                    scope.$apply(function ()
                    {
                        scope.isFocus = true;
                    });
                }
            });
            
            /**
             * 要素のインプットからにフォーカが外れた場合にリストを非表示する
             * 
             * @author niikawa
             */
            element.find('input').on('blur', function()
            {
                var hide = setInterval(function(isExist)
                {
                    scope.$apply(function ()
                    {
                        if (scope.selectByList)
                        {
                            var num = originList.length;
                            var isExist = scope.selectName.length === 0 ? true : false;
                            for (var i = 0; i < num; i++)
                            {
                                if (scope.selectName === originList[i][scope.namePropertie])
                                {
                                    isExist = true;
                                    break;
                                }
                            }
                            
                            if (isExist)
                            {
                                element.find('input').removeClass('auto-complete-item-error');
                            }
                            else
                            {
                                element.find('input').addClass('auto-complete-item-error');
                            }
                            scope.isFocus = false;
                        }
                    });
                    clearInterval(hide);
                }, 300);
            });
            
            /**
             * 入力文字に合致した選択肢を表示する
             * 
             * @author niikawa
             */
            element.find('input').on('keyup', function()
            {
                if (0 === originList.length)
                {
                    angular.copy(scope.itemList, originList);
                }
                var createList = [];

                if (0 < scope.itemList.length)
                {
                    scope.isFocus = true;
                }
                if (scope.selectName.length === 0)
                {
                    angular.copy(originList, createList);
                }
                else
                {
                    var num = originList.length;
                    for (var i = 0; i < num ; i++)
                    {
                        if (originList[i][scope.namePropertie].indexOf(scope.selectName) !== -1)
                        {
                            createList.push(angular.copy(originList[i]));
                        }
                    }
                }
                scope.$apply(function ()
                {
                    angular.copy(createList, scope.itemList);
                });
            });
            
            /**
             * 選択肢がクリックされた時に実行され、選択したアイテムを
             * selectedItemに格納する
             * 
             * @event click
             * @author niikawa
             * @param {object} $event イベント
             * @param {string} item   選択したアイテム
             */
            scope.click = function ($event, item) 
            {
                //イベントが伝搬しないように制御
                $event.preventDefault();
                $event.stopPropagation();
                
                angular.copy(item, scope.selectedItem);
                element.find('input').removeClass('auto-complete-item-error');
                scope.isFocus = false;
                if (void 0 !== scope.execute)
                {
                    scope.execute();
                }
                if (scope.showLabel) scope.isLabel = true;
                scope.selectName = item[scope.namePropertie]; 
            };
            
            /**
             * spanからinputに変更する
             * 
             * @event click
             * @author niikawa
             */
            scope.changeElement = function()
            {
                angular.copy(originList, scope.itemList);
                scope.isLabel = false;
                element.find('input').focus();
            };
        }
    };
});
var myApp = angular.module('myApp');
myApp.directive('spinnerDirective', function()
{
    return {
        restrict: 'E',
        scope: {is: '=', src: '@'},
        template: '<div ng-show="is"><img ng-src="{{src}}"></div>',
        link: function (scope, element, attrs) 
        {
        }
    };
});
/**
 * マップを生成する
 * 
 * 
 */
var myApp = angular.module('myApp');
myApp.directive('mapDirective', [ 'Utility' ,function(Utility){
    return {
        restrict: 'AE',
        scope:{
            mapClass: '@',
            overlayClass: '@',
        },
        // compile: function(element, attrs) {
            
        //     //JS読み込みたいな
        //     // <script src="http://maps.google.com/maps/api/js?sensor=true&libraries=places"></script>
        //     // <script src="vendor/map/gmaps.js"></script>
            
            
        // },
        link: function (scope, element, attrs) 
        {
            if (void 0 === attrs.id) return false;
            
            if (!navigator.geolocation)
            {
                Utility.errorSticky('ご利用のブラウザでは位置情報を取得できません。');
                return false;
            }

            element.addClass(scope.mapClass); 

            navigator.geolocation.getCurrentPosition(createGoogleMap, error);
            
            function createGoogleMap(position)
            {
                var map = new GMaps({
                    div: '#' + attrs.id,
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    zoom: 18,
                });
                map.addMarker(
                {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    animation: google.maps.Animation.BOUNCE,
                    click: function(lat, lng)
                    {
                        var geocoder = new google.maps.Geocoder();
                        var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

                        geocoder.geocode({'latLng': latlng}, function(results, status)
                        {
                            if (status == google.maps.GeocoderStatus.OK)
                            {
                                if (results[1])
                                {
                                    Utility.info(results[1].formatted_address);
                                    map.setZoom(17);
                                }
                                else
                                {
                                    Utility.warning('対象の住所は存在しません');
                                }
                            }
                            else
                            {
                                Utility.warning('対象の住所は存在しません');
                            }
                          });
                    }
                });
            }
            
            function error(error)
            {
                var message = "";
                
                switch (error.code) {
                
                  // 位置情報が取得できない場合
                  case error.POSITION_UNAVAILABLE:
                    message = "位置情報の取得ができませんでした。";
                    break;
                
                  // Geolocationの使用が許可されない場合
                  case error.PERMISSION_DENIED:
                    message = "位置情報取得の使用許可がされませんでした。";
                    break;
                
                  // タイムアウトした場合
                  case error.PERMISSION_DENIED_TIMEOUT:
                    message = "位置情報取得中にタイムアウトしました。";
                    break;         
                }
                
                Utility.errorSticky(message);
            }
            
        }
    };
}]);
var myApp = angular.module('myApp');
myApp.directive('drawerMenuDirective', function()
{
    return {
        restrict: 'E',
        scope: {menuList: '=', position: '@'},
        template: '<nav class="hi-icon-effect-8 drawer-menu">'
                    +'<a ng-repeat="item in itemList" style="{{item.style}}" class="drawer-menu-item" ng-href={{item.link}}>'+
                    '<i ng-if="item.fa" class="fa {{item.fa}} fa-3x"></i>'+
                    '<span ng-if="item.s">{{item.s}}</span>'+
                    '</a>'+
                    '</nav>',
        link: function (scope, element, attrs) 
        {
            if (void 0 === scope.menuList)
            {
                console.log(scope.menuList);
            }
            
            //config
            var pi = 3.14;
            var openingAngle = pi - .2;
            var menuItemsNum = 5;
            
            //実行タイプ
            var type = 1;
            
            //表示対象
            var targetWidth = 50;

            //cssクラス
            var openButtonClass = 'fa-bars';
            var closeButtonClass = 'fa-times';
            
            //座標
            var x = 0;
            var y = 0;
            
            //描画
            var durbase = 1000;

            scope.itemList = [];
            scope.isOpen = false;
            var openItem = {fa: openButtonClass, link: '', style: '#/'};
            scope.itemList.push(openItem);
            
            element.on('click', function()
            {
                scope.$apply(function()
                {
                    if (scope.isOpen)
                    {
                        scope.itemList[0].fa = openButtonClass;
                        scope.itemList.splice(1, scope.itemList.length-1);
                        
                        if (1 === type)
                        {
                            scope.itemList[0].style = 'transform: translate(0);';
                        }
                        element.children('nav').addClass('drawer-menu-right');
                        element.children('nav').removeClass('drawer-menu-center');
                    }
                    else
                    {
                        scope.itemList[0].fa = closeButtonClass;
                        element.children('nav').removeClass('drawer-menu-right');
                        element.children('nav').addClass('drawer-menu-center');
                        
                        //element.addClass('move');
                        
                        var linkList = ['', '/#/segment', '/#/scenario', '/#/approach', '/#/user'];
                        var sList = ['D', 'SE', 'SC', 'AP', 'US'];

                        if (1 === type)
                        {
                            for (var i = 1; i <= menuItemsNum; i++)
                            {
                                var angle = ((pi - openingAngle)/2)+((openingAngle/(menuItemsNum - 1))*(i - 1));
        
                                x = Math.cos(angle) * 75;
                                y = Math.sin(angle) * 75 - ((i-1) * targetWidth) - targetWidth/2;
                                var dur = durbase+(400*i);
                                var translate = 'transition-timing-function:cubic-bezier(0.935, 0.000, 0.340, 1.330);transition-duration: '+dur+'ms;transform: translate3d(' + x +'px,' + y + 'px, 0);';
                                var add = {s: sList [i-1], link: linkList[i-1],style: translate};
                                scope.itemList.push(add);
                            }
                        }
                        
                        // else if (2 === type)
                        // {
                        //     for (var i = 0; i < 5; i++)
                        //     {
                        //         x = -60;
                        //         y = -60;
                        //         var dur = 1000 +(400*i);
                        //         var translate = 'transition-timing-function:cubic-bezier(0.935, 0.000, 0.340, 1.330);transition-duration: '+dur+'ms;transform: translate3d(' + x +'px,' + y + 'px, 0);';
                        //         var add = {fa: 'fa-dashcube', link: '',style: translate};
                        //         scope.itemList.push(add);
                        //     }
                        // }
                    }
                    scope.isOpen = !scope.isOpen;
                });
            });

        }
    };
});
var dDSharedServices = angular.module("myApp");
dDSharedServices.service('DDShared', function()
{
    var dDSharedServices = {};
    var orverIndex = 0;
    var fromData = {};
    var deforePosistion = 0;
    var isMoveDown = false;

    dDSharedServices.setFrom = function(data)
    {
        fromData = data;
    };
    
    dDSharedServices.getFrom = function()
    {
        return fromData;
    };
    
    dDSharedServices.getFromCopyByIndex = function(index)
    {
        return angular.copy(fromData[index]);
    };

    dDSharedServices.getCopyFrom = function()
    {
        return angular.copy(fromData);
    };

    dDSharedServices.setOrverIndex = function(index)
    {
        orverIndex = index;
    };

    dDSharedServices.getOrverIndex = function()
    {
        return orverIndex;
    };

    dDSharedServices.getBeforePosition = function()
    {
        return deforePosistion;
    };

    dDSharedServices.setBeforePosition = function(num)
    {
        deforePosistion = num;
    };

    dDSharedServices.isMoveDown = function()
    {
        return isMoveDown;
    };

    dDSharedServices.setMove = function(num)
    {
        isMoveDown = (0 < num) ? true : false;
    };

    dDSharedServices.clear = function()
    {
        orverIndex = 0;
        fromData = {};
    };

    return dDSharedServices;
});

var myApp = angular.module('myApp');
myApp.directive('dragItemDirective', ['DDShared', function(DDShared)
{
    return {
        restrict: 'AE',
        transclude: false,
        require: '^ngModel',
        scope: {dragindex: '='},
        link: function (scope, element, attrs, ctrl) 
        {
            element.attr('draggable', true);
            element.attr('data-index', scope.dragindex);
            
            element.on('dragstart', function(event)
            {
                var index = event.target.dataset.index;
                var item = element.html();
                event.originalEvent.dataTransfer.setData('item', item);
                event.originalEvent.dataTransfer.setData('itemIndex', index);
                DDShared.setFrom(ctrl.$modelValue);
                DDShared.setBeforePosition(0);
            });
        }
    };
}]);
myApp.directive('dropDirective', ['DDShared', function(DDShared)
{
    return {
        restrict: 'A',
        scope: {dropLineName: '@'},
        require: '^ngModel',
        link: function (scope, element, attrs, ctrl) 
        {
            var lineName = (void 0 === scope.dropLineName || '' === scope.dropLineName)  ? 'line' : scope.dropLineName;
            
            element.on('dragenter', function(event)
            {
                element.addClass('ui-drop-target');
            });
            
            element.on('dragover', function(event)
            {
                event.preventDefault();
                if (void 0 !== event.target.dataset.index)
                {
                    DDShared.setOrverIndex(event.target.dataset.index);
                    var wholeheight = Math.max.apply(
                        null, 
                        [document.body.clientHeight , document.body.scrollHeight, document.documentElement.scrollHeight, document.documentElement.clientHeight]
                    );
                    var windowHeight = (window.innerHeight||document.body.clientHeight||0);
                    if (wholeheight > windowHeight)
                    {
                        var now = event.target.getBoundingClientRect().top + $(event.target).position().top + 50;
                        var move = 0;
                        if (0 != DDShared.getBeforePosition() && DDShared.getBeforePosition() != now)
                        {
                            var elementHeight = $(event.target).height() + 15;
                            // up : down
                            move =(DDShared.getBeforePosition() > now) ?  -elementHeight : elementHeight;
                            DDShared.setMove(move);
                            DDShared.setBeforePosition(now - (move));
                            $(window).scrollTop($(window).scrollTop()+move);
                            
                        }
                        else
                        {
                            DDShared.setBeforePosition(now);
                        }
                    }
                }
                event.originalEvent.dataTransfer.dropEffect = 'move';
            });
            
            element.on('dragleave', function(event)
            {
                element.removeClass('ui-drop-target');
            });
            
            element.on('drop', function(event)
            {
                event.stopPropagation();
                DDShared.setBeforePosition(0);
                var index = event.originalEvent.dataTransfer.getData('itemIndex');
                var pushItem = {};
                
                var orverIndex = (ctrl.$modelValue.length === 0) ? 0 : DDShared.getOrverIndex();
                if (index === orverIndex) return false;

                if (angular.isArray(DDShared.getFrom()))
                {
                    pushItem = DDShared.getFromCopyByIndex(index);
                    DDShared.getFrom().splice(index, 1);
                }
                else
                {
                    pushItem = DDShared.getCopyFrom();
                }
                
                if (void 0 !== pushItem)
                {
                    ctrl.$modelValue.splice(orverIndex, 0, pushItem);
                }
                
                var len = ctrl.$modelValue.length;

                for (var i=0; i < len; i++)
                {
                    ctrl.$modelValue[i][lineName] = i+1;
                }
                var emitObject = {
                    to:{}, 
                    from:{}, 
                    remove:{}, 
                    isSameContainer:false, 
                    areaKey: attrs.dropAreaKey, 
                    insertLine: orverIndex
                };
                emitObject.to = ctrl.$modelValue;
                emitObject.from = DDShared.getFrom();
                emitObject.remove = pushItem;
                emitObject.isSameContainer = (emitObject.to == emitObject.from);
                scope.$emit('dropItemComplete', emitObject);
                console.log(emitObject);
                scope.$$phase || scope.$apply();
            });
        }
    };
}]);

//完全に画面（データ依存）のため使い回しはできない
myApp.directive('dropJoinDirective', ['DDShared', function(DDShared)
{
    return {
        restrict: 'A',
        scope: {dropJoinIndex: '='},
        require: '^ngModel',
        link: function (scope, element, attrs, ctrl) 
        {
            element.on('dragenter', function(event)
            {
                element.addClass('ui-drop-target');
            });
            element.on('dragover', function(event)
            {
                event.preventDefault();
                if (void 0 !== event.target.dataset.index)
                {
                    DDShared.setOrverIndex(event.target.dataset.index);
                }
                event.originalEvent.dataTransfer.dropEffect = 'move';
            });
            
            element.on('dragleave', function(event)
            {
                element.removeClass('ui-drop-target');
            });
            
            element.on('drop', function(event)
            {
                event.stopPropagation();
                
                if (ctrl.$modelValue == DDShared.getFrom()) return false;

                var index = event.originalEvent.dataTransfer.getData('itemIndex');
                //自分自身へのjoinは禁止
                var pushItem = DDShared.getFromCopyByIndex(index);
                if (void 0 === pushItem) return false;
                
                //固有条件
                var isModelArray = false;
                console.log(ctrl.$modelValue);
                if (angular.isArray(ctrl.$modelValue))
                {
                    //画面別
                    if (ctrl.$modelValue[0].hasOwnProperty('table') 
                        && ctrl.$modelValue[0].hasOwnProperty('column') )
                    {
                        if (ctrl.$modelValue[0].table.physicalname == pushItem[0].table.physicalname 
                            && ctrl.$modelValue[0].column.physicalname == pushItem[0].column.physicalname) return false;
                    }
                    isModelArray = true;
                }
                
                if (angular.isArray(DDShared.getFrom()))
                {
                    DDShared.getFrom().splice(index, 1);
                }
                else
                {
                    pushItem = DDShared.getCopyFrom();
                }
                
                if (ctrl.$modelValue == DDShared.getFrom())
                {
                    console.log(index);
                    //順番を入れ替える
                    ctrl.$modelValue.splice(index, index+1, pushItem, ctrl.$modelValue[index+1]);
                    return false;
                }
                else
                {
                    if (!isModelArray)
                    {
                        var mergeItems = [];
                        mergeItems.push(ctrl.$modelValue);
                        mergeItems.push(pushItem);
                    }
                    else
                    {
                        if (angular.isArray(pushItem))
                        {
                            ctrl.$modelValue.push(pushItem[0]);
                        }
                        else
                        {
                            ctrl.$modelValue.push(pushItem);
                        }
                    }
                }

                if (ctrl.$modelValue.length > 1) 
                {
                    ctrl.$modelValue.isJoin = true;
                }
                else
                {
                    ctrl.$modelValue.isJoin = false;
                }
                console.log(ctrl.$modelValue);
                scope.$$phase || scope.$apply();
//                scope.$emit('dropJoinItemComplete', mergeItems);
                console.log('drop join complete');
            });
        }
    };
}]);

/**
 * 
 */
var myApp = angular.module('myApp');
myApp.directive('pushDirective', function(){
    return {
        restrict: 'A',
        scope:{
            list : '=',
            pushInfo: '=info',
            active: '=',
            activekey: '@',
            multiple: '='
        },
        link: function (scope, element, attrs) 
        {
            element.css({cursor: 'pointer'});
            
            if (void 0 !== scope.active)
            {
                var setActive = false;
                if ("boolean" === typeof(scope.active))
                {
                    scope.pushInfo.isPush = scope.active;
                    setActive = scope.active;
                }
                else if ("string" === typeof(scope.active) || "number" === typeof(scope.active))
                {
                    if (scope.pushInfo[scope.activekey] == scope.active)
                    {
                        scope.pushInfo.isPush = true;
                        setActive = true;
                    }
                }
                if (setActive) element.addClass('push-active');
            }
            else
            {
                scope.pushInfo.isPush = false;
            }

            element.on('click', function()
            {
                scope.$apply(function()
                {
                    if (element.hasClass('push-active'))
                    {
                        scope.pushInfo.isPush = false;
                        element.removeClass('push-active');
                    }
                    else
                    {
                        if (void 0 === scope.multiple || !scope.multiple)
                        {
                            element.parent().children().removeClass('push-active');
                            angular.forEach(scope.list, function(item, key){item.isPush = false;});
                        }
                        scope.pushInfo.isPush = true;
                        element.addClass('push-active');
                    }
                });
            });
        }
    };
});
/**
 * 絞込みディレクティブ
 * 
 * [属性]
 * selectedItem : コントローラー側と選択した値のバインド用
 * itemList     : リスト表示用のデータ
 * 
 * [使用方法]
 * <refine-directive item-list="trackerList" selected-item="ticketModel.tracker" ></refine-directive>
 * 
 * @module refineDirective
 * @author niikawa
 */
var myApp = angular.module('myApp');
myApp.directive('refineDirective', function()
{
    return {
        restrict: 'A',
        scope: {refineItem: '=', namePropertie: '@', keyword: '=', execute: '&', },
        replace: true,
        link: function (scope, element, attrs) 
        {
            var originList = [];

            /**
             * 入力文字に合致した選択肢を表示する
             * 
             * @author niikawa
             */
            element.on('keyup', function()
            {
                if (0 === originList.length)
                {
                    angular.copy(scope.refineItem, originList);
                }
                var createList = [];

                if (void 0 === scope.keyword || scope.keyword.length === 0)
                {
                    angular.copy(originList, createList);
                }
                else
                {
                    var num = originList.length;
                    var nameList = scope.namePropertie.split('|');
                    var pushList = [];
                    var primeKey = Object.keys(originList[0]);

                    for (var i = 0; i < num ; i++)
                    {
                        angular.forEach(nameList, function(name, key)
                        {
                            if (originList[i][name].indexOf(scope.keyword) !== -1)
                            {
                                if (void 0 === pushList[originList[i][primeKey[0]]])
                                {
                                    createList.push(angular.copy(originList[i]));
                                    pushList[originList[i][primeKey[0]]] = true;
                                }
                            }
                        });
                    }
                }
                scope.$apply(function ()
                {
                    angular.copy(createList, scope.refineItem);
                });
            });
        }
    };
});
var myApp = angular.module('myApp');
myApp.directive('closeButtonDirecitve', function(Shared, Utility)
{
    return {
        restrict: 'E',
        scope: {execute: '&'},
        template: '<button ng-if="isShowMine" class="close-button" ng-click="click()"><i class="fa fa-times"></i></button>',
        link: function (scope, element, attrs) 
        {
            if (3 != Shared.get("role"))
            {
                scope.isShowMine = true;
            }
            else
            {
                scope.isShowMine = false;
            }
            
            scope.click = function()
            {
                Utility.confirmAlert(scope.execute);
            };
        }
    };
});
var myApp = angular.module('myApp');
myApp.directive('saveButtonDirecitve', function(Shared)
{
    return {
        restrict: 'E',
        scope: {is:"=", execute: '&', name: "@"},
        template: '<button ng-if="is" class="close-button" ng-click="click()">{{name}}</button>',
        link: function (scope, element, attrs) 
        {
            if (3 != Shared.get("role"))
            {
                scope.isShowMine = true;
            }
            else
            {
                scope.isShowMine = false;
            }
            
            scope.click = function()
            {
                scope.execute();
            };
        }
    };
});
var myApp = angular.module('myApp');
myApp.directive('linkButtonDirecitve', function(Shared)
{
    return {
        restrict: 'E',
        scope: {href: '@', name: "@"},
        template: '<a ng-if="isShowMine" class="btn btn-default" ng-href="/#/{{href}}">{{name}}</a> ',
        link: function (scope, element, attrs) 
        {
            if (3 != Shared.get("role"))
            {
                scope.isShowMine = true;
            }
            else
            {
                scope.isShowMine = false;
            }
            
            scope.click = function()
            {
                scope.execute();
            };
        }
    };
});
/**
 * 
 */
var myApp = angular.module('myApp');
myApp.directive('conditionDirective', function(Utility){
    return {
        restrict: 'EA',
        scope:{
            conditionAppend: '=',
            screenType: '@',
        },
        template: 
                '指定した値' +
                '<select ng-model="mySlected" class="form-control"' +
                    ' ng-options="item as item.name for item in selectItems" ng-required="true"></select>'+
                'ものを条件とする'+
                '<div ng-if="isOneInput"><input type="text" name="{{conditionAppend.column.physicalname}}" class="form-control" ng-model="conditionAppend.condition.value1" ng-keyup="check()" ng-required="true">'+

                '<div ng-if="conditionAppend.error" class="item-error-box"><p class="item-error">{{conditionAppend.message}}</p></div>'+

                '</div>'+
                '<div ng-if="isTextArea"><textarea class="form-control" ng-model="conditionAppend.condition.value1" ng-required="true"></textarea></div>'+
                
                '<div ng-if="isTwoInput"><input type="text" class="form-control" ng-model="conditionAppend.condition.value1" ng-keyup="check()" ng-required="true">～<input type="text" class="form-control" ng-model="conditionAppend.condition.value2" ng-keyup="check()" ng-required="true"></div>'
                  ,
        link: function (scope, element, attrs) 
        {
            var showOneInput = function()
            {
                scope.isOneInput = true;
                scope.isTextArea = false;
                scope.isTwoInput = false;
            };
            
            var showTextArea = function()
            {
                scope.isOneInput = false;
                scope.isTextArea = true;
                scope.isTwoInput = false;
            };
            
            var showTwoInput = function()
            {
                scope.isOneInput = false;
                scope.isTextArea = false;
                scope.isTwoInput = true;
            };
            
            if (1 == scope.screenType)
            {
                scope.selectItems = [
                    {name: 'に等しい', value: 1, execute: showOneInput, 'symbol': '='},
                    {name: '以上', value: 2, execute: showOneInput, 'symbol': '>='},
                    {name: '以下', value: 3, execute: showOneInput, 'symbol': '<='},
                    {name: 'を超える', value: 4, execute: showOneInput, 'symbol': '>'},
                    {name: '未満', value: 5, execute: showOneInput, 'symbol': '<'},
                    {name: 'の間', value: 6, execute: showTwoInput, 'symbol': 'BETWEEN'},
                ];
            }
            else
            {
                scope.selectItems = [
                    {name: 'に等しい', value: 1, execute: showOneInput, 'symbol': '='},
                    {name: '以上', value: 2, execute: showOneInput, 'symbol': '>='},
                    {name: '以下', value: 3, execute: showOneInput, 'symbol': '<='},
                    {name: 'を超える', value: 4, execute: showOneInput, 'symbol': '>'},
                    {name: '未満', value: 5, execute: showOneInput, 'symbol': '<'},
                    {name: 'の間', value: 6, execute: showTwoInput, 'symbol': 'BETWEEN'},
                    {name: 'を含む', value: 7, execute: showTextArea, 'symbol': 'IN'},
                    {name: 'を含まない', value: 8, execute: showTextArea, 'symbol': 'NOT IN'},
                    {name: 'から始まる', value: 9, execute: showOneInput, 'symbol': 'LIKE'},
                    {name: 'で終わる', value: 10, execute: showOneInput, 'symbol': 'LIKE'},
                    {name: 'を一部に持つ', value: 11, execute: showOneInput, 'symbol': 'LIKE'},
                ];
            }
            

            scope.isOneInput = false;
            scope.isTextArea = false;
            scope.isTwoInput = false;

            if (void 0 === scope.conditionAppend.selectedCondition)
            {
                scope.conditionAppend.selectedCondition = {name: '', value: '', symbol: ''};
                scope.conditionAppend.condition = {value1: '', value2: '', where: 'AND'};
            }
            else
            {
                angular.forEach(scope.selectItems, function(item)
                {
                    if (item.value === scope.conditionAppend.selectedCondition.value)
                    {
                        scope.mySlected = item;
                        scope.conditionAppend.selectedCondition.name = scope.mySlected.name;
                        scope.conditionAppend.selectedCondition.value = scope.mySlected.value;
                        scope.conditionAppend.selectedCondition.symbol = scope.mySlected.symbol;
                        item.execute();
                        return false;
                    }
                });
            }
            
            element.find('select').on('change', function()
            {
                scope.conditionAppend.selectedCondition.name = scope.mySlected.name;
                scope.conditionAppend.selectedCondition.value = scope.mySlected.value;
                scope.conditionAppend.selectedCondition.symbol = scope.mySlected.symbol;
                scope.$apply(function()
                {
                    scope.mySlected.execute();
                });
            });
            
            scope.check = function(event)
            {
                var type = '';
                if (void 0 === scope.conditionAppend.column)
                {
                    type = scope.conditionAppend.type;
                }
                else
                {
                    type = scope.conditionAppend.column.type;
                }
                var val = scope.conditionAppend.condition.value1;
                if ('bigint' === type || 'int' === type || 'number' === type)
                {
                    if (void 0 === val)
                    {
                        scope.conditionAppend.error = false;
                        scope.conditionAppend.message = '';
                    }
                    else
                    {
                        if (!isFinite(parseInt(val, 10)))
                        {
                            scope.conditionAppend.error = true;
                            scope.conditionAppend.message = '数値で入力してください';
                        }
                        else
                        {
                            scope.conditionAppend.error = false;
                            scope.conditionAppend.message = '';
                        }
                    }
                }
                else if ('datetime' === type || 'smalldatetime' === type)
                {
                    if (void 0 === val)
                    {
                        scope.conditionAppend.error = false;
                        scope.conditionAppend.message = '';
                    }
                    else
                    {
                        var valL = val.split('-') ;
                        if (3 !== valL.length)
                        {
                            scope.conditionAppend.error = true;
                            scope.conditionAppend.message = '日付はYYYY-MM-DDで入力してください';
                        }
                        else
                        {
                            var m = Utility.moment(val);
                            if (!m.isValid())
                            {
                                scope.conditionAppend.error = true;
                                scope.conditionAppend.message = '有効な日付ではありません';
                            }
                            else
                            {
                                scope.conditionAppend.error = false;
                                scope.conditionAppend.message = '';
                            }
                        }
                    }
                }
            };
        }
    };
});
/**
 * オートコンプリートディレクティブ
 * 
 * [属性]
 * selectedItem : コントローラー側と選択した値のバインド用
 * itemList     : リスト表示用のデータ
 * 
 * [使用方法]
 * <auto-complete-directive item-list="trackerList" selected-item="ticketModel.tracker" ></auto-complete-directive>
 * 
 * @module autoCompleteDirective
 * @author niikawa
 */
var myApp = angular.module('myApp');
myApp.directive('autoCompleteFaDirective', function()
{
    return {
        restrict: 'E',
        scope: {selectedItem: '=', itemList: '=', execute: '&', clickExecute: '&', namePropertie: '@', appendString: '@', showLabel: '=', selectByList: '=', selectName: '=', addonString: '@'},
        template:   '<div class="input-group"><span class="input-group-addon">{{addonString}}</span>'+
                    '<input ng-show="!isLabel" class="form-control form-control-add-fa2 " ng-model="selectName">' +
                    '<span ng-show="isLabel && selectName.length != 0" ng-click="changeElement()">{{appendString}}{{selectName}}</span>' +
                    '<ul class="complete-list" ng-show="isFocus">' +
                    '<li ng-repeat="item in itemList" ng-click="click($event, item)" >' +
                    '{{item[namePropertie]}}' +
                    '</li>' +
                    '</ul>' +
                    '<span class="input-group-addon question"><i class="fa fa-plus fa-2x" ng-click="clickI()"></i></span>',
        replace: true,
        link: function (scope, element, attrs) 
        {
            scope.selectName = '';
            scope.isFocus = false;
            scope.isLabel = false;
            var originList = [];
            scope.$watch('itemList', function(newValue, oldValue)
            {
                if (void 0 !== newValue && void 0 !== oldValue)
                {
                    console.log('watch itemList');
                    if (newValue.length === oldValue.length)
                    {
                        return false;
                    }
                    if (newValue.length > oldValue.length)
                    {
                        originList = angular.copy(newValue);
                    }
                    else if (newValue.length < oldValue.length)
                    {
                        originList = angular.copy(oldValue);
                    }
                }
                else
                {
                    if (void 0 !== scope.itemList)
                    {
                        console.log('set initialize data');
                        angular.copy(scope.itemList, originList);
                    }
                }
            });

            /**
             * 要素のインプットにフォーカが合った場合にリストを表示する
             * 
             * @author niikawa
             */
            element.find('input').on('focus', function()
            {
                if (0 < scope.itemList.length)
                {
                    scope.$apply(function ()
                    {
                        scope.isFocus = true;
                    });
                }
            });
            
            /**
             * 要素のインプットからにフォーカが外れた場合にリストを非表示する
             * 
             * @author niikawa
             */
            element.find('input').on('blur', function()
            {
                var hide = setInterval(function(isExist)
                {
                    scope.$apply(function ()
                    {
                        if (scope.selectByList)
                        {
                            var num = originList.length;
                            var isExist = scope.selectName.length === 0 ? true : false;
                            for (var i = 0; i < num; i++)
                            {
                                if (scope.selectName === originList[i][scope.namePropertie])
                                {
                                    isExist = true;
                                    break;
                                }
                            }
                            
                            if (isExist)
                            {
                                element.find('input').removeClass('auto-complete-item-error');
                            }
                            else
                            {
                                element.find('input').addClass('auto-complete-item-error');
                            }
                            scope.isFocus = false;
                        }
                    });
                    clearInterval(hide);
                }, 300);
            });
            
            /**
             * 入力文字に合致した選択肢を表示する
             * 
             * @author niikawa
             */
            element.find('input').on('keyup', function()
            {
                if (0 === originList.length)
                {
                    angular.copy(scope.itemList, originList);
                }
                var createList = [];

                if (0 < scope.itemList.length)
                {
                    scope.isFocus = true;
                }
                if (scope.selectName.length === 0)
                {
                    angular.copy(originList, createList);
                }
                else
                {
                    var num = originList.length;
                    for (var i = 0; i < num ; i++)
                    {
                        if (originList[i][scope.namePropertie].indexOf(scope.selectName) !== -1)
                        {
                            createList.push(angular.copy(originList[i]));
                        }
                    }
                }
                scope.$apply(function ()
                {
                    angular.copy(createList, scope.itemList);
                });
            });
            
            /**
             * 選択肢がクリックされた時に実行され、選択したアイテムを
             * selectedItemに格納する
             * 
             * @event click
             * @author niikawa
             * @param {object} $event イベント
             * @param {string} item   選択したアイテム
             */
            scope.click = function ($event, item) 
            {
                //イベントが伝搬しないように制御
                $event.preventDefault();
                $event.stopPropagation();
                
                angular.copy(item, scope.selectedItem);
                element.find('input').removeClass('auto-complete-item-error');
                scope.isFocus = false;
                if (void 0 !== scope.execute)
                {
                    scope.execute();
                }
                if (scope.showLabel) scope.isLabel = true;
                scope.selectName = item[scope.namePropertie]; 
            };
            
            /**
             * spanからinputに変更する
             * 
             * @event click
             * @author niikawa
             */
            scope.changeElement = function()
            {
                angular.copy(originList, scope.itemList);
                scope.isLabel = false;
                element.find('input').focus();
            };
            
            scope.clickI = function()
            {
                angular.copy(originList, scope.itemList);
                scope.isFocus = false;
                scope.clickExecute();
            };
        }
    };
});
var myApp = angular.module('myApp');
myApp.controller('CalendarCtrl',['$scope','Calendar', 'Utility', function ($scope, Calendar, Utility)
{
    $scope.calendarList = [];
    $scope.calendarofMonthList = [];
    $scope.isWeek = false;
    $scope.isMonth = false;
    var isDisabled = false;
    $scope.initialize = function()
    {
        Calendar.resource.get().$promise.then(function(response)
        {
            $scope.isWeek = true;
            $scope.calendarList = response.data;
        });
    };
    
    $scope.nextDay = function()
    {
        if (isDisabled) return;
        isDisabled = true;
        var days = Object.keys($scope.calendarList);
        var last = Utility.moment(days[days.length-1]).format("YYYY-MM-DD");
        var next = Utility.addDay(last, 1).format("YYYY-MM-DD");
        
        Calendar.resource.oneDay({day: next}).$promise.then(function(response)
        {
            delete $scope.calendarList[Object.keys($scope.calendarList)[0]];
            var nextKey = Object.keys(response.data);
            $scope.calendarList[nextKey] = response.data[nextKey];
            isDisabled = false;
        });
    };
    
    $scope.deforeDay = function()
    {
        if (isDisabled) return;
        isDisabled = true;
        var last = Utility.moment(Object.keys($scope.calendarList)[0]).format("YYYY-MM-DD");
        var next = Utility.subtractDay(last, 1).format("YYYY-MM-DD");
        
        Calendar.resource.oneDay({day: next}).$promise.then(function(response)
        {
            var days = Object.keys($scope.calendarList);
            delete $scope.calendarList[days[days.length-1]];
            var minKey = Object.keys(response.data);
            var newList = {};
            newList[minKey] = response.data[minKey];
            Object.keys($scope.calendarList).forEach(function(key)
            {
                newList[key] = $scope.calendarList[key];
            });
            $scope.calendarList = newList;
            isDisabled = false;
        });
    };
    
    $scope.showWeek = function()
    {
        if (isDisabled) return;
        isDisabled = true;
        Calendar.resource.get().$promise.then(function(response)
        {
            isDisabled = false;
            $scope.isWeek = true;
            $scope.isMonth = false;
            $scope.calendarList = response.data;
        });
    };
    
    $scope.showMonth = function()
    {
        if (isDisabled) return;
        isDisabled = true;
        var days = Object.keys($scope.calendarList);
        var year = Utility.moment(days[days.length-1]).format("YYYY");
        var month = Utility.moment(days[days.length-1]).format("MM");
        Calendar.resource.month({year:year, month: month}).$promise.then(function(response)
        {
            isDisabled = false;
            $scope.isMonth = true;
            $scope.isWeek = false;
            $scope.calendarofMonthList = response.data;
            $scope.year = response.year;
            $scope.month = response.month;
        });
    };
    
    $scope.nextMonth = function()
    {
        if (isDisabled) return;
        isDisabled = true;
        var now = $scope.year + '/' + $scope.month + '/01';
        var yearMonth = Utility.addMonth(now, 1).format("YYYY-MM");
        var params = yearMonth.split("-");

        Calendar.resource.month({year:params[0], month: params[1]}).$promise.then(function(response)
        {
            isDisabled = false;
            $scope.isWeek = false;
            $scope.isMonth = true;
            $scope.calendarofMonthList = response.data;
            $scope.year = response.year;
            $scope.month = response.month;
        });
    };

    $scope.deforeMonth = function()
    {
        if (isDisabled) return;
        isDisabled = true;
        var now = $scope.year + '/' + $scope.month + '/01';
        var yearMonth = Utility.subtractMonth(now, 1).format("YYYY-MM");
        var params = yearMonth.split("-");
        Calendar.resource.month({year:params[0], month: params[1]}).$promise.then(function(response)
        {
            isDisabled = false;
            $scope.isWeek = false;
            $scope.isMonth = true;
            $scope.calendarofMonthList = response.data;
            $scope.year = response.year;
            $scope.month = response.month;
        });
    };

}]);
myApp.factory("Calendar", ['$resource','Utility', function($resource, Utility) 
{
    var calendarServices = {};
    
    calendarServices.resource = $resource('/calendar/', {}, 
    {
        oneDay:
        {
            method:"GET",
            url: "calendar/one/:day"
        },
        month:
        {
            method:"GET",
            url: "calendar/:year/:month"
        },
    });
    
    return calendarServices;
}]);

myApp.directive('calendarDirective', function(Utility)
{
    return {
        restrict: 'E',
        templateUrl: '../../partials/calendar.html',
        controller: 'CalendarCtrl',
        replace: true,
        link: function (scope, element, attrs, ctrl) 
        {
            scope.showCircle = false;

            scope.enterCircle = function()
            {
                scope.showCircle = true;
            };
            
            scope.leaveCircle = function()
            {
                scope.showCircle = false;
            };
            
            scope.isTrigger = function(type)
            {
                return 1 === type;
            };
            scope.isScSingle = function(type)
            {
                return 2 === type;
            };
            scope.isScPriod = function(type)
            {
                return 3 === type;
            };
            scope.isHoliday = function(dayMin)
            {
                return '0sun' == dayMin;
            };
            scope.isHolidayToWeek = function(day)
            {
                return 0 == Utility.moment(day).format("e");
            };
        }
    };
});

var myApp = angular.module('myApp');
myApp.directive('myValidators', function () {
    return {
        require: 'ngModel',
        scope: {
            myValidators: '=',
        },
        link: function (scope, elem, attrs, ctrl) {
            var validators = scope.myValidators || {};
            angular.forEach(validators, function (val, key) {
                ctrl.$validators[key] = val;
            });
        }
    };
});
myApp.directive('myAsyncValidators', function () {
    return {
        require: 'ngModel',
        scope: {
            myAsyncValidators: '='
        },
        link: function (scope, elem, attrs, ctrl) {
            var asyncValidators = scope.myAsyncValidators || {};
            angular.forEach(asyncValidators, function (val, key) {
                ctrl.$asyncValidators[key] = val;
            });
        }
    };
});
var myApp = angular.module('myApp');
myApp.directive('d3Bar', ['d3Service', '$parse', function (d3Service, $parse) {
  var d3 = d3Service.d3;
  return{
    restrict: 'EAC',
    scope:{
      data: '=', // APLのController側とデータをやり取り.
      key: '@',
      valueProp: '@',
      label: '@'
    },
    link: function(scope, element){
      // 初期化時に可視化領域の確保.a
      var svg = d3.select(element[0]).append('svg').style('width', '100%');
      var colorScale = d3.scale.category20();

      var watched = {}; // $watchリスナの登録解除関数格納用.

      // (Angular) $parseでCollection要素へのアクセサを確保しておく.
      var getId = $parse(scope.key || 'id');
      var getValue = $parse(scope.valueProp || 'value');
      var getLabel = $parse(scope.label || 'name');

      // (Angular) Collectionの要素変動を監視.
      scope.$watchCollection('data', function(){
        if(!scope.data){
          return;
        }

        // (D3 , Angular) data関数にて, $scopeとd3のデータを紐付ける.
        var dataSet = svg.selectAll('g.data-group').data(scope.data, getId);

        // (D3) enter()はCollection要素の追加に対応.
        var createdGroup = dataSet.enter()
        .append('g').classed('data-group', true)
        .each(function(d){
          // (Angular) Collection要素毎の値に対する変更は、$watchで仕込んでいく.
          var self = d3.select(this);
          watched[getId(d)] = scope.$watch(function(){
            return getValue(d);
          }, function(v){
            self.select('rect').attr('width', v);
          });
        });
        createdGroup.append('rect')
        .attr('x', 130)
        .attr('height', 18)
        .attr('fill', function(d){
          return colorScale(d.name);
        });
        createdGroup.append('text').text(getLabel).attr('height', 15);

        // (D3) exit()はCollection要素の削除に対応.
        dataSet.exit().each(function(d){
          // (Angular) $watchに登録されたリスナを解除して、メモリリークを防ぐ.
          var id = getId(d);
          watched[id]();
          delete watched[id];
        }).remove();

        // (D3) Collection要素変動の度に再計算する箇所.
        dataSet.each(function(d, i){
          var self = d3.select(this);
          self.select('rect').attr('y', i * 25);
          self.select('text').attr('y', i * 25 + 15);
        });

      });

    }
  };
}]);
var myApp = angular.module('myApp');
myApp.directive('lineChart', ['d3Service', '$parse', '$window', function (d3Service, $parse, $window)
{
    var d3 = d3Service.d3;
    return {
        restrict: 'EA',
        scope:{
          data: '=',
          type: '@',
          headerLabel: '=',
          legendLabel: '=',
        },
        link: function(scope, element)
        {
            //画面
            var w = angular.element($window);

            var colorList = ['#FF8C00', '#A9A9A9'];

            //D3.jsで表現できる線のリスト
            var lineTypeList = [
              'linear','linear-closed', 'step', 'step-before', 'step-after',
              'basis', 'basis-open', 'basis-close', 'bundle', 'cardinal',
              'cardinal-open', 'cardinal-close', 'monotone'
              ];

            //描画時のmargin  
            var margin = {top: 40, right: 40, bottom: 70, left: 90};
            
            //日付パース用
            var parseDate = d3.time.format("%Y/%m").parse;

            //dataを監視して変更があったら実行する
            scope.$watchCollection('data', function()
            {
                if (void 0 !== scope.headerLabel && '' !== scope.headerLabel)
                {
                    if (element.children('p').length > 0)
                    {
                        element.children('p').remove();
                    }
                    var add = '<p class="line-title">'+scope.headerLabel+'</p>';
                    element.append(add);
                }
                
                if(!scope.data) return;
                removeSVG();
                drowLegend(false);
                drowLine(false);
            });
            
            w.on('resize', function()
            {
                removeSVG();
                drowLegend(true);
                drowLine(true);
            });
            
            //---------------------
            //描画対象取得
            //---------------------
            function getType(type)
            {
                if (-1 === lineTypeList.indexOf(type))
                {
                    return lineTypeList[0];
                }
                return type;
            }
            
            //---------------------
            //凡例描画
            //---------------------
            function drowLegend(isResize)
            {
                if (void 0 === scope.legendLabel)
                {
                    return;
                }
                var num = angular.isArray(scope.legendLabel) ? scope.legendLabel.length : 0;
                if (0 === num) return;
                var size = {width : '100%', height: num * 15};
                var svg = d3.select(element[0])
                                  .append('svg')
                                  .attr("width", size.width)
                                  .attr("height", size.height);
//                var colorScale = d3.scale.category20();
                
                svg.selectAll('rect').data(scope.legendLabel)
                  .enter().append('rect')
                  .attr("class", "pull-right")
                  .attr("width", 50)
                  .attr('height', 5)
                  .attr('x', w.width() - 150)
                  .attr('y', function(d,i){return i * 20})
                  .attr('fill', function(d, i){return colorList[i];});
                
                //ラベル生成
                svg.selectAll('text').data(scope.legendLabel)
                  .enter().append('text')
                  .text(function(d, i){ return d }) 
                  .attr('x', function(d, i){ return w.width() - 250})
                  .attr('y', function(d, i){ 
                    if (0 === i)
                    {
                        return 10;
                    } 
                    else
                    {
                        return i * 5 + 20;
                    }
                  });
            }
            
            //---------------------
            //グラフ描画
            //---------------------
            function drowLine(isResize)
            {
                //描画サイズ  
                var size = {width : w.width(), height: w.height() / 2};
                var xrange = size.width - margin.left - margin.right - 50;
                var yrange = size.height - margin.top - margin.bottom;
                //Xメモリを日付にしてrangeで描画サイズを決定する
                var x = d3.time.scale()
                  .range([0, xrange]);
                //yはscale
                var y = d3.scale.linear()
                  .range([yrange, 0]);
            
                //TODO 
                var xAxis = 
                  d3.svg.axis().scale(x).orient("bottom").innerTickSize(-yrange)
                    .outerTickSize(0).tickFormat(d3.time.format("%Y/%m"));

                var yAxis = 
                  d3.svg.axis().scale(y).orient("left").innerTickSize(-xrange).outerTickSize(0);
                  
                //描画エリアを生成
                var svg = d3.select(element[0])
                                  .append('svg')
                                  .attr("width", "100%")
                                  .attr("height", size.height)
                                  .append("g")
                                  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                var lineType = getType(scope.type);
                
                //d3.svg.line()で座標値を計算して線の種類を設定
                var line = d3.svg.line()
                  .x(
                    function(d, i)
                    {
                      return x(d.date); 
                    }
                  )
                  .y(
                    function(d, i)
                    { 
                      return y(d.price);
                    }
                  )
                  .interpolate(lineType);

                angular.forEach(scope.data, function(dataset, i)
                {
                    //TODO
                    if (isResize)
                    {
                        dataset.forEach(function(d)
                        {
                            d.date = d.date;
                            d.price = +d.price;
                        });
                    }
                    else
                    {
                        dataset.forEach(function(d)
                        {
                            d.date = parseDate(d.date);
                            d.price = +d.price;
                        });
                    }
                                      
                    //表X軸、Y軸のメモリを設定する
                    var lineClass = 'line-avg';
                    if (0 === i)
                    {
                        lineClass = 'line-main';
                        x.domain(d3.extent(dataset, function(d){ return d.date; })).nice();
                        y.domain(d3.extent(dataset, function(d){ return d.price; })).nice();
                        
                        // 描画
                        svg.append("g")
                          .attr("class", "x axis")
                          .attr("transform", "translate(0, " + ( size.height - margin.top - margin.bottom ) + ")")
                          .call(xAxis)
                          .selectAll("text")
                            .attr("transform", "rotate (-70)")
                            .attr("dx", "-5em")
                            .attr("dy", "-0.1em")
                            .style("text-anchor", "start");

                        svg.append("g")
                          .attr("class", "y axis")
                          .call(yAxis)
                          .append("text")
                            .attr("transform", "rotate(-90)")
                            .attr("y", 6)
                            .attr("dy", ".7em")
                            .style("text-anchor", "end");
                    }
                    
                    svg.append("path")
                      .datum(dataset)
                      .attr("class", lineClass)
                      .attr("d", line);
                });
            }
            
            //---------------------
            //削除
            //---------------------
            function removeSVG()
            {
                if (element.children('svg').length > 0)
                {
                    element.children('svg').remove();
                }
            }
        }
    };
}]);