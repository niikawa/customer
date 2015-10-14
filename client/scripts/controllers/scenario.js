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
        alert(type);
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
