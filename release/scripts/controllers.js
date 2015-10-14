class AccessController
{
    constructor($scope, $sce, $routeParams, Shared, Utility, Access)
    {
        this._scope = $scope; 
        this.$sce = $sce;
        this.$routeParams = $routeParams;
        this.Shared = Shared;
        this.Access = Access;
        this.Utility = Utility;

        this.Shared.destloy('serchDay');
        this.Shared.setRoot('accsess');
        
        this.showDate = '';
        this.serchDay = '';
        this.logList = [];
        
        this.targetName = '';
        this.showDate = '';
        this.timelineList = [];
    }
    
    initialize()
    {
        this._scope._construct();
        let today = this.Utility.today('YYYY-MM-DD');
        this._scope.$emit('requestStart');
        this.Access.resource.day({day: today}).$promise.then(response =>
        {
            this.logList = response.data;
            this._scope.$emit('requestEnd');
        });
    }
    
    serchByDay()
    {
        if (this.Utility.isDateValid(this.serchDay))
        {
            this.Access.resource.day({day: this.serchDay}).$promise.then(response =>
            {
                this.logList = response.data;
                this.Shared.set('serchDay', this.serchDay);
            });
        }
    }

    getTimeInitializeData()
    {
        let day = this.Shared.get('serchDay');
        if (void 0 === day)
        {
            day = this.Utility.today('YYYY-MM-DD');
        }
        this.Access.resource.day({day: day, id: this.$routeParams.id}).$promise.then(response =>
        {
            this.targetName = response.data[0].name;
            this.showDate = day;
            this.timelineList = response.data;
        });
    }
    
    setPosition(index)
    {
        return index % 2 == 0;
    }
}
AccessController.$inject = ['$scope', '$sce', '$routeParams', 'Shared', 'Utility', 'Access'];
angular.module('accessCtrl',['AccessServices']).controller('AccessCtrl', AccessController);
//
//アプローチコントローラークラス
//
class ApproachController
{
    constructor($scope, Shared, Utility, Approach, Scenario, Modal)
    {
        this._scope = $scope;
        this._sharedService = Shared;
        this._utilityService = Utility;
        this._approachService = Approach;
        this._scenarioService = Scenario;
        this._modalService = Modal;
        
        this._scope._construct();
        this._sharedService.setRoot('approach');
        this._clear();
    }
    
    initialize()
    {
        this._clear();
        this._getInitializeData();
    }
    
    _clear()
    {
        this.approachData = [];
        this.scenarioList = [];
        this.showScenarioList = false;
    }

    _getInitializeData()
    {
        this._approachService.resource.get().$promise.then(approachResponse =>
        {
            this.approachData = approachResponse.data;
            this._scenarioService.resource.valid().$promise.then(scenarioResponse =>
            {
                this.scenarioList = scenarioResponse.data;
                this.showScenarioList = (0 < this.scenarioList.length);
            });
        });
    }
    
    _setEventListeners()
    {
        this._scope.$on('dropItemComplete', function(event, data)
        {
            this.scenarioList = data.to;
            this._scope.$apply();
        });
    }
    
    save()
    {
        this._approachService.resource.save(this.approachData).$promise.then(response =>
        {
            this._utilityService.info('設定を更新しました');
        });
    }
    
    savePriority()
    {
        this._scenarioService.resource.priority({data: this.scenarioList}).$promise.then(response =>
        {
            this._utilityService.info('優先順位を更新しました');
        });
    }
    
    showDiscription(id)
    {
        let info = this._approachService.getInfomation(id);
        
        this._scope.modalParam = 
        {
            title: info.title,
            message: info.message,
            isExecute: false,
        };
        this._scope.modalInstance = this._modalService.open(this._scope, "partials/modal/message.html");
    }
    
    bulkInvalid()
    {
        let params = 
        {
            title: 'シナリオの一括無効について',
            text: '有効なシナリオをすべて無効にしますがよろしいですか？<br>実行した場合、実行予定シナリオはなくなります。',
            confirmButtonText: '一括で無効にする',
            execute: function()
            {
                this._scenarioService.resource.bulkInvalid().$promise.then(response=>
                {
                    this._utilityService.info('アプローチ対象シナリオをすべて無効しました。');
                    this.initialize();
                });
            }
        };
        this._utilityService.infoAlert(params);
    }
    
    bulkEnable()
    {
        let params = 
        {
            title: 'シナリオの一括有効について',
            text: '無効なシナリオをすべて有効にしますがよろしいですか？<br>実行した場合、実行予定シナリオとしてダッシュボード画面に表示されます。',
            isExecute: true,
            confirmButtonText: '一括で有効にする',
            execute: function()
            {
                this._scenarioService.resource.bulkEnable().$promise.then(response =>
                {
                    this._utilityService.info('アプローチ対象シナリオをすべて有効しました。');
                    this.initialize();
                });
            }
        };
        this._utilityService.infoAlert(params);
    }
}
ApproachController.$inject = ['$scope', 'Shared', 'Utility', 'Approach', 'Scenario', 'Modal'];
angular.module('approachCtrl',['ApproachServices','ScenarioServices']).controller('ApproachCtrl', ApproachController);
//approachCtrl.controller('ApproachCtrl',['$scope', '$routeParams','Shared', 'Utility', 'Approach', 'Scenario', 'Modal',
// function ($scope, $routeParams, Shared, Utility, Approach, Scenario, Modal)
// {
//     function setInitializeScope()
//     {
//         $scope.approach = [];
//         $scope.scenarioList = [];
//         $scope.showScenarioList = false;
//     }
    
//     function getInitializeData()
//     {
//         Approach.resource.get().$promise.then(function(approachResponse)
//         {
//             $scope.approach = approachResponse.data;
            
//             Scenario.resource.valid().$promise.then(function(scenarioResponse)
//             {
//                 $scope.scenarioList = scenarioResponse.data;
//                 $scope.showScenarioList = (0 < $scope.scenarioList.length);
//             });
//         });
//     }
    
//     function setEventListeners()
//     {
//         $scope.$on('dropItemComplete', function(event, data)
//         {
//             $scope.scenarioList = data.to;
//             $scope.$apply();
//         });
//     }
    
//     $scope.initialize = function()
//     {
//         $scope._construct();
//         setInitializeScope();
//         getInitializeData();
//         setEventListeners();
//         Shared.setRoot('approach');
//     };
    
//     $scope.save = function()
//     {
//         console.log($scope.approach);
//         Approach.resource.save($scope.approach).$promise.then(function(response)
//         {
//             Utility.info('設定を更新しました');
//         });
//     };
    
//     $scope.savePriority = function()
//     {
//         console.log($scope.scenarioList);
//         Scenario.resource.priority({data: $scope.scenarioList}).$promise.then(function(response)
//         {
//             Utility.info('優先順位を更新しました');
//         });
//     };
    
//     $scope.showDiscription = function(id)
//     {
//         var info = Approach.getInfomation(id);
        
//         $scope.modalParam = 
//         {
//             title: info.title,
//             message: info.message,
//             isExecute: false,
//         };
//         $scope.modalInstance = Modal.open($scope, "partials/modal/message.html");
//     };

//     $scope.bulkInvalid = function()
//     {
//         var params = 
//         {
//             title: 'シナリオの一括無効について',
//             text: '有効なシナリオをすべて無効にしますがよろしいですか？<br>実行した場合、実行予定シナリオはなくなります。',
//             confirmButtonText: '一括で無効にする',
//             execute: function()
//             {
//                 Scenario.resource.bulkInvalid().$promise.then(function(response)
//                 {
//                     Utility.info('アプローチ対象シナリオをすべて無効しました。');
//                     $scope.initialize();
//                 });
//             }
//         };
//         Utility.infoAlert(params);
//     };
    
//     $scope.bulkEnable = function()
//     {
//         var params = 
//         {
//             title: 'シナリオの一括有効について',
//             text: '無効なシナリオをすべて有効にしますがよろしいですか？<br>実行した場合、実行予定シナリオとしてダッシュボード画面に表示されます。',
//             isExecute: true,
//             confirmButtonText: '一括で有効にする',
//             execute: function()
//             {
//                 Scenario.resource.bulkEnable().$promise.then(function(response)
//                 {
//                     Utility.info('アプローチ対象シナリオをすべて有効しました。');
//                     $scope.initialize();
//                 });
//             }
//         };
//         Utility.infoAlert(params);
//     };
    
// }]);

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

//
//core controller
//
//すべての上位コントローラー
//アプリケーションの全体変更に関する処理のみを記述し、下位コントローラーは継承されたscopeの直接変更するのではなく、
//bordcastすることで変更通知を行うこと
//
// class CoreContrller
// {
//     constructor($scope, Shared)
//     {
//         this._scope = $scope;
//         this._shared = Shared;
        
//         this.isHeader = (void 0 !== this._shared.get('id'));
//         this._shared.set('isSpinner', false);
        
//     }
    
//     loginInit()
//     {
//         this._scope.isHeader = false;
//     }
    
//     loginComplete()
//     {
//         this._scope.isHeader = true;
//         this._scope.userName = this._shared.get('userName');
//     }
    
//     loginFailed()
//     {
//         this._scope.isHeader = false;
//     }
    
//     logoutConplete()
//     {
//         this._scope.isHeader = false;
//     }
    
//     requestStart()
//     {
//         this._scope.isSpinner = true;
//     }
    
//     requestEnd()
//     {
//         this._scope.isSpinner = false;
//     }
// }
// CoreContrller.$inject = ['$scope', 'Shared'];
// angular.module('coreCtrl',[]).controller('CoreCtrl', CoreContrller);

var coreCtrl = angular.module('coreCtrl',[]);
coreCtrl.controller('CoreCtrl', ['$scope', 'Shared', function($scope, Shared) 
{

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

class DashbordController
{
    constructor($scope, Shared, Utility, Scenario, Modal)
    {
        this._scope = $scope;
        this._sharedService = Shared;
        this._utilityService = Utility;
        this._scenarioService = Scenario;
        this._modalService = Modal;

        this._scope._construct();
        
        this.scenario = [];
        this.scenarioList = [];
        this.isShowExecutePlanScenario = false;
        this.executePlanScenario = [];
        this._getInitializeData();
    }
    
    _getInitializeData()
    {
        this._scope.$emit('requestStart');
        this._scenarioService.resource.typeCount().$promise.then(typeCountResponse =>
        {
            this.scenarioList = typeCountResponse.data;
            
            this._scope.$emit('requestStart');
            this._scenarioService.resource.executeplan().$promise.then(scenarioResponse =>
            {
                this.isShowExecutePlanScenario = (scenarioResponse.data.length > 0);
                this.executePlanScenario = scenarioResponse.data;
            });
        });
    }
    
    bulkInvalid()
    {
        this._scope.modalParam = 
        {
            title: 'シナリオの一括無効について',
            message: '実行予定のシナリオをすべて無効にしますがよろしいですか？<br>再度有効にする場合はアプローチ管理画面から有効にできます。',
            isExecute: true,
            executeLabel: '一括で無効にする',
            execute: function()
            {
                this._scenarioService.resource.bulkInvalid().$promise.then(function(response)
                {
                    this._scope.modalInstance.close();
                    this._utilityService.info('実行予定のシナリオを一括無効しました。');
                    this._scope.initialize();
                });
            }
        };
        this._scope.modalInstance = this._modalService.open(this._scope, "partials/modal/message.html");
    }
}
DashbordController.$inject = ['$scope', 'Shared', 'Utility', 'Scenario', 'Modal'];
angular.module('dashbordCtrl',['ScenarioServices']).controller('DashbordCtrl', DashbordController);

// var mainCtrl = angular.module('dashbordCtrl',['ScenarioServices']);
// mainCtrl.controller('DashbordCtrl',['$scope', 'Shared', 'Scenario', 'Utility', 'Modal',
// function ($scope, Shared, Scenario, Utility, Modal)
// {
//     function setInitializeScope()
//     {
//         $scope.scenario = [];
//         $scope.executePlanScenario = [];
//     }
    
//     function getInitializeData()
//     {
//         Scenario.resource.typeCount().$promise.then(function(response)
//         {
//             $scope.scenarioList = response.data;
            
//             Scenario.resource.executeplan().$promise.then(function(response)
//             {
//                 $scope.isShowExecutePlanScenario = (response.data.length > 0);
//                 $scope.executePlanScenario = response.data;
//             });
//         });
//     }
    
//     $scope.initialize = function()
//     {
//         $scope.$emit('requestStart');
        
//         $scope._construct();
//         setInitializeScope();
//         getInitializeData();
//         Shared.setRoot('dashbord');
        
//         $scope.$emit('requestEnd');
//     };
    
//     $scope.bulkInvalid = function()
//     {
//         $scope.modalParam = 
//         {
//             title: 'シナリオの一括無効について',
//             message: '実行予定のシナリオをすべて無効にしますがよろしいですか？<br>再度有効にする場合はアプローチ管理画面から有効にできます。',
//             isExecute: true,
//             executeLabel: '一括で無効にする',
//             execute: function()
//             {
//                 Scenario.resource.bulkInvalid().$promise.then(function(response)
//                 {
//                     $scope.modalInstance.close();
//                     Utility.info('実行予定のシナリオを一括無効しました。');
//                     $scope.initialize();
//                 });
//             }
//         };
//         $scope.modalInstance = Modal.open($scope, "partials/modal/message.html");
//     };
    
// }]);

class LoginController
{
    constructor($scope, Auth, Location)
    {
        this._scope = $scope;
        this._authService = Auth;
        this._locationService = Location;

        this._scope.$emit('loginInit');
        this.data = {mailAddress:'', password:'', remember:false};
    }
    
    submit()
    {
        this._scope.$emit('requestStart');
        this._authService.login(this.data).then(response =>
        {
            this._scope.$emit('requestEnd');
            this._scope.$emit('loginComplete');
            this._locationService.home();
        }, 
        function()
        {
            this._scope.$emit('requestEnd');
        });
    }
}
LoginController.$inject = ['$scope', 'Auth', 'Location'];
angular.module('loginCtrl',['AuthServices']).controller('LoginCtrl', LoginController);

// var loginCtrl = angular.module('loginCtrl',['AuthServices',]);
// loginCtrl.controller('LoginCtrl', ['$scope', '$location', 'Auth', 'Location',
//     function($scope, $location, Auth, Location) {
    
//     $scope.initialize = function()
//     {
//         $scope.$emit('loginInit');
//         $scope.data = {mailAddress:'', password:'', remember:false};
//     };
    
//     $scope.submit = function()
//     {
//         $scope.$emit('requestStart');
//         Auth.login($scope.data).then(function(response)
//         {
//             $scope.$emit('requestEnd');
//             $scope.$emit('loginComplete');
//             Location.home();
//             //Auth.setLoginStatus(response.data.user_id);
//         }, function()
//         {
//             $scope.$emit('requestEnd');
//         });
//     };
// }]);

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

class QueryController
{
    constructor($scope, $routeParams, Shared, Utility, Location, Query)
    {
        this._scope = $scope;
        this._routeParams = $routeParams;
        this._sharedService = Shared;
        this._utilityService = Utility;
        this._locationService = Location;
        this._queryService = Query;
        this._selectTable = '';
        this.tableSearch = '';

        this._scope._construct();

        let isEdit = this._routeParams.hasOwnProperty('id');
        this._setInitializeScope(isEdit);
        
        if (isEdit)
        {
            let paramId = this._routeParams.id;
            this._queryService.resource.getControlInit({id: paramId}).$promise.then(response =>
            {
                this.queryName = response.data.query_name;
                this.tableList = response.table;
                this.tableListRef = response.getRefTabels(response.table);
                if (0 === this.selectColumns.length)
                {
                    this._setEdtInitializeScope(response.data);
                }
                this.isShowEditMessage = true;
                this._sharedService.set('updateQueryDocumentId', paramId);
                this._sharedService.set('updateQueryName', response.data.query_name);
            });
        }
        else
        {
            this._queryService.resource.get().$promise.then(response =>
            {
                this.tableList = response.table;
                this.tableListRef = this._queryService.getRefTabels(response.table);
            });
        }
    }
    
    _setInitializeScope(isEdit)
    {
        this._sharedService.destloyByName('queryName');
        this._sharedService.destloyByName('updateQueryDocumentId');
        this.tableList = [];
        this.tableListRef = [];
        this.columnNum = 0;
        this.selectColumns = [];
        if (!isEdit)
        {
            this.selectColumns = this._sharedService.get('queryColumns') || [];
        }
        this.showSelectedColumnsBox = this.selectColumns.length > 0;
        this.conditions = [];
        this.isShowEditMessage = false;
        this.returnUrl = this._queryService.getReturnURL();
        this._sharedService.setRoot('query');
    }
    
    _setEdtInitializeScope(data)
    {
        angular.forEach(data.tables, function(columnList, tableName)
        {
            angular.forEach(columnList, function(columnInfo)
            {
                angular.forEach(this.tableList[tableName].column, function(columnData)
                {
                    if (columnInfo.column === columnData.physicalname)
                    {
                        this.selectColumns.push(
                        {
                            table: {logicalname: this.tableList[tableName].logicalname, physicalname:  this.tableList[tableName].physicalname}, 
                            column: columnData,
                            selectedCondition: {name: '', value: columnInfo.conditionType, symbol: ''},
                            condition: columnInfo.values
                        });
                        
                        return false;
                    }
                });
            });
        });
        this.showSelectedColumnsBox = this.selectColumns.length > 0;
        this._sharedService.set('queryColumns', this.selectColumns);
    }

    showColumns(table)
    {
        this._selectTable = table;
        this.columnList = this.tableList[table].column;
        this.columnNum = this.columnList.length;
    }
    
    setColumn(index)
    {
        let target = this.tableList[this._selectTable];
        let isSame = false;
        angular.forEach(this.selectColumns, function(v, k)
        {
            if (v.table.physicalname === this._selectTable && v.column.physicalname === target.column[index].physicalname)
            {
                isSame = true;
            }
        });
        if (!isSame)
        {
            this.selectColumns.push(
            {
                table: {logicalname: target.logicalname, physicalname:  target.physicalname}, 
                column: target.column[index]
            });
        }
        this.showSelectedColumnsBox = true;
        this._sharedService.set('queryColumns', this.selectColumns);
    };
    
    removeColumn(index)
    {
        this.selectColumns.splice(index, 1);
        this.showSelectedColumnsBox = (this.selectColumns.length > 0);
        this._sharedService.set('queryColumns', this.selectColumns);
    };
}
QueryController.$inject = ['$scope', '$routeParams', 'Shared', 'Utility', 'Location', 'Query'];
angular.module('queryCtrl',['QueryServices']).controller('QueryCtrl', QueryController);

class QueryListController
{
    constructor($scope, Shared, Utility, Location, Modal, Query, Segment)
    {
        this._scope = $scope;
        this._sharedService = Shared;
        this._utilityService = Utility;
        this._modalService = Modal;
        this._locationService = Location;
        this._segmentService = Segment;
        this._queryService = Query;

        this._scope._construct();

        this.queryList = [];
        this._sharedService.setRoot('query list');
        this.querySearch = '';
        this._queryService.resource.getList().$promise.then(response =>
        {
            this.queryList = response.data;
            this.isQueryShow = this.queryList.length > 0;
        });
    }
    
    showSegment(index)
    {
        if (void 0 === this.queryList[index].id) return;
        let target = this.queryList[index];
        let params = {qId: target.id, count: target.useNum};
        this._segmentService.resource.useSegment(params).$promise.then(response =>
        {
            this._scope.modalParam = 
            {
                title: this.queryList[index].query_name+"を利用しているセグメント",
                list: response.data,
                hrefBase: '#/segment/control',
                dynamicParamKey: 'id',
                close: function(id)
                {
                    this._scope.modalInstance.close();
                    this._locationService.segmentControl(id);
                }
            };
            this._scope.modalInstance = this._modalService.open(this._scope, "partials/modal/list.html");
        });
    }
    
    deleteItem(index)
    {
        if (void 0 === this.queryList[index]) return;
        let name = this.queryList[index].query_name;
        this._queryService.resource.remove({id: this.queryList[index].id}).$promise.then(response =>
        {
            this._utilityService.info(name + '<br>を削除しました。');
            this._scope.queryList.splice(index,1);
        });
    }
    
}
QueryListController.$inject = ['$scope', 'Shared','Utility','Location','Modal', 'Query', 'Segment'];
angular.module('queryListCtrl',['QueryServices']).controller('QueryListCtrl', QueryListController);

// var queryListCtrl = angular.module('queryListCtrl',['QueryServices']);
// queryListCtrl.controller('QueryListCtrl',['$scope', 'Shared', 'Query', 'Segment','Modal','Location', 'Utility',
// function ($scope, Shared, Query, Segment, Modal, Location, Utility)
// {
//     function setInitializeScope()
//     {
//         $scope.queryList = [];
//         Shared.setRoot('query list');
//     }
    
//     $scope.initialize = function()
//     {
//         $scope._construct();
//         setInitializeScope();

//         Query.resource.getList().$promise.then(function(response)
//         {
//             $scope.queryList = response.data;
//             $scope.isQueryShow = $scope.queryList.length > 0;
//         });
//     };
    
//     $scope.showSegment = function(index)
//     {
//         if (void 0 === $scope.queryList[index].id) return;
//         var target = $scope.queryList[index];
//         var params = {qId: target.id, count: target.useNum};
//         Segment.resource.useSegment(params).$promise.then(function(response)
//         {
//             $scope.modalParam = 
//             {
//                 title: $scope.queryList[index].query_name+"を利用しているセグメント",
//                 list: response.data,
//                 hrefBase: '#/segment/control',
//                 dynamicParamKey: 'id',
//                 close: function(id)
//                 {
//                     $scope.modalInstance.close();
//                     Location.segmentControl(id);
//                 }
//             };
//             $scope.modalInstance = Modal.open($scope, "partials/modal/list.html");
            
//         });
//     };
    
//     $scope.deleteItem = function(index)
//     {
//         if (void 0 === $scope.queryList[index]) return;
//         var name = $scope.queryList[index].query_name;
//         Query.resource.remove({id: $scope.queryList[index].id}).$promise.then(function(response)
//         {
//             Utility.info(name + '<br>を削除しました。');
//             $scope.queryList.splice(index,1);
//         });
//     };
// }]);

class QuerySaveController
{
    constructor($scope, Shared, Utility, Location, Query)
    {
        this._scope = $scope;
        this._sharedService = Shared;
        this._utilityService = Utility;
        this._locationService = Location;
        this._queryService = Query;
        
        this._sharedService.setRoot('query save');
        this._setEventListeners();
        this._editSetInitializeScope();
        this.query = {query_name: this._sharedService.get('updateQueryName')};
        this.conditions = [];
        
        let selectColumns = this._sharedService.get('queryColumns');
        if (void 0 === selectColumns) Location.query();
        
        this.docIdUrl = '';
        var docId = this._sharedService.get('updateQueryDocumentId');
        if (void 0 !== docId)
        {
            this.docIdUrl = '/control/'+docId;
            this.isShowEditMessage = true;
            this.queryName = this._sharedService.get('updateQueryName');
        }
        
        this.selectColumns = [];
        this._queryService.createCondtionString(selectColumns);
        this.showConditions = [];
        angular.forEach(selectColumns, function(v, k)
        {
            var array = [];
            array.push(v);
            array.isJoin = false;
            this.showConditions.push(array);
        });
    }
    _setEventListeners()
    {
        this._scope.$on('dropItemComplete', function(event, data)
        {
            event.stopPropagation();
            angular.forEach(this.showConditions, function(v, k)
            {
                console.log(v.length);
                if (1 === v.length) v.isJoin = false;
            });
        });
    }
    
    isJoin(items)
    {
        return items.isJoin;
    };

    release(pIndex, cIndex)
    {
        let target = [];
        target.push(this.showConditions[pIndex][cIndex]);
        
        console.log('削除前：' + this.showConditions.length);
        
        this.showConditions[pIndex].splice(cIndex, 1);
        
        console.log('削除後：' + this.showConditions.length);
        console.log(this.showConditions);

        if (1 === this.showConditions[pIndex].length) this.showConditions[pIndex].isJoin = false;
        this.showConditions.push(pIndex, 0, target);
        console.log('ぷっしゅ後：' +this.showConditions.length);

        console.log(this.showConditions);
    };

    save()
    {
        let queryColumns = this._sharedService.get('queryColumns');
        let tables = this._queryService.getTables(queryColumns);

        let parameters = 
        {
            query_document_id: this._sharedService.get('updateQueryDocumentId'),
            query_name: this.query.query_name, 
            conditionList: this.showConditions, 
            tables: tables
        };
        this._queryService.resource.create(parameters).$promise.then(response =>
        {
            this._sharedService.destloyByName('queryColumns');
            this._sharedService.destloyByName('updateQueryName');
            this._sharedService.destloyByName('updateQueryDocumentId');
            this._utilityService.info('クエリを保存しました');
            this._locationService.query();
        });
    };
    
    execute()
    {
        let data = this._sharedService.get('queryColumns');
        let tables = this._queryService.getTables(data);
        let parameters = {tables: tables, conditionList: this.showConditions};
        this._queryService.resource.executeQuery(parameters).$promise.then(response =>
        {
            this._utilityService.info('該当データは' + response.result + '件あります');
        });
    };
    
    
}
QuerySaveController.$inject = ['$scope', 'Shared', 'Utility', 'Location', 'Query'];
angular.module('querySaveCtrl',['QueryServices']).controller('QuerySaveCtrl', QuerySaveController);
class QuerySetController
{
    constructor($scope, Shared, Location, Query)
    {
        this._scope = $scope;
        this._sharedService = Shared;
        this._locationService = Location;
        this._queryService = Query;
        
        this._sharedService.setRoot('query set');
        this.selectColumns = this._sharedService.get('queryColumns');
        if (void 0 === this.selectColumns) this._locationService.query();

        this.docIdUrl = '';
        let docId = this._sharedService.get('updateQueryDocumentId');
        if (void 0 !== docId)
        {
            this.docIdUrl = '/control/'+docId;
            this.isShowEditMessage = true;
            this.queryName = this._sharedService.get('updateQueryName');
        }
    }
    removeItem(index)
    {
        this.selectColumns.splice(index, 1);
        if (0 === this.selectColumns.length) this._locationService.query();
    };
    
    next()
    {
        let isNext = false;
        angular.forEach(this.selectColumns, function(item)
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
        if (isNext) this._locationService.querySave();
    };
}
QuerySetController.$inject = ['$scope', 'Shared','Location', 'Query'];
angular.module('querySetCtrl',['QueryServices']).controller('QuerySetCtrl', QuerySetController);
//
// ScenarioController
//
class ScenarioController
{
    constructor($scope, $routeParams, Shared, Utility, Scenario)
    {
        this._scope = $scope;
        this._routeParams = $routeParams;
        this._sharedService = Shared;
        this._utilityService = Utility;
        this._scenarioService = Scenario;
        
        this._sharedService.setRoot('scenario');
        this._scope._construct();
        
        let type = this._routeParams.scenario; 
        this.addPageTitle = this._scenarioService.getPageProp(type).title;
        this.type = type;
        this.scenarioList = [];
        this.scenarioSearch = '';
        this._initialize();
    }
    
    _initialize()
    {
        this._scenarioService.resource.get({type: this.type}).$promise.then(response =>
        {
            this.isScenarioShow = response.data.length > 0 ? true: false;
            if (this.isScenarioShow) this.scenarioList = response.data;
        });
    }
    
    remove(index)
    {
        if (void 0 === index || isNaN(parseInt(index, 10))) return false;
        let params = 
        {
            type: this.type,
            id: this.scenarioList[index].scenario_id,
        };
        let name = this.scenarioList[index].scenario_name;

        this._scenarioService.resource.remove(params).$promise.then(response =>
        {
            this._utilityService.info(name+'<br>'+'を削除しました。');
            this.scenarioList.splice(index, 1);
            this.isScenarioShow = this.scenarioList.length > 0 ? true: false;
        });
    }
    
}
ScenarioController.$inject = ['$scope', '$routeParams','Shared', 'Utility', 'Scenario'];
angular.module('scenarioCtrl',['ScenarioServices']).controller('ScenarioCtrl', ScenarioController);
/**
 * @ngdoc function
 * @name workspaceApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the workspaceApp
 */
// var scenarioCtrl = angular.module('scenarioCtrl',['ScenarioServices']);
// scenarioCtrl.controller('ScenarioCtrl',['$scope', '$routeParams','Shared', 'Utility', 'Scenario', 
// function ($scope, $routeParams, Shared, Utility, Scenario)
// {
//     function setInitializeScope()
//     {
//         $scope.addPageTitle = Scenario.getPageProp($routeParams.scenario).title;
//         $scope.type = $routeParams.scenario;
        
//         $scope.scenarioList = [];
//     }
    
//     $scope.initialize = function()
//     {
//         Shared.setRoot('scenario');
//         $scope._construct();
//         setInitializeScope();

//         Scenario.resource.get({type: $routeParams.scenario}).$promise.then(function(response)
//         {
//             $scope.isScenarioShow = response.data.length > 0 ? true: false;
//             if ($scope.isScenarioShow)
//             {
//                 $scope.scenarioList = response.data;
//             }
//         });
//     };
    
//     $scope.remove = function(index)
//     {
//         if (void 0 === index || isNaN(parseInt(index, 10))) return false;
//         var id = $scope.scenarioList[index].scenario_id;
//         var name = $scope.scenarioList[index].scenario_name;
//         var params = 
//         {
//             type: $routeParams.scenario,
//             id: id,
//         };

//         Scenario.resource.remove(params).$promise.then(function(response)
//         {
//             Utility.info(name+'<br>'+'を削除しました。');
//             $scope.scenarioList.splice(index, 1);
//             $scope.isScenarioShow = $scope.scenarioList.length > 0 ? true: false;
//         });
//     };
    
// }]);

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
