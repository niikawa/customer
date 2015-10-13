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
        this.approach = [];
        this.scenarioList = [];
        this.showScenarioList = false;
    }

    _getInitializeData()
    {
        this._approachService.resource.get().$promise.then(approachResponse =>
        {
            this.approach = approachResponse.data;
            this._scenarioService.resource.valid().$promise.then(scenarioResponse =>
            {
                this.scenarioList = scenarioResponse.data;
                this.showScenarioList = (0 < this._scope.scenarioList.length);
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
        this._approachService.resource.save(this.approach).$promise.then(response =>
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
        var info = this._approachService.getInfomation(id);
        
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
        var params = 
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
        var params = 
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
