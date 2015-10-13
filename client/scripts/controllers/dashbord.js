class DashbordController
{
    constructor($scope, Shared, Utility, Scenario, Modal)
    {
        this._scope = $scope;
        this._sharedService = Shared;
        this._utilityService = Utility;
        this._scenarioService = Scenario;
        this._modalService = Modal;
        
        this.scenario = [];
        this.scenarioList = [];
        this.isShowExecutePlanScenario = false;
        this.executePlanScenario = [];
        this._getInitializeData();
    }
    
    initialize()
    {
        
    }
    _getInitializeData()
    {
        this._scenarioService.resource.typeCount().$promise.then(typeCountResponse =>
        {
            this.scenarioList = typeCountResponse.data;
            
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
DashbordController.$inject = ['$scope', 'Shared', 'Scenario', 'Utility', 'Modal'];
angular.module('dashbordCtrl', DashbordController);

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
