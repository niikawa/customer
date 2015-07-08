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
        $scope._construct();
        setInitializeScope();

        Scenario.resource.get({type: $routeParams.scenario}).$promise.then(function(response)
        {
            console.log(response.data.length);
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
            type:$routeParams.scenario,
            id: id,
        };

        Scenario.resource.remove(params).$promise.then(function(response)
        {
            Utility.info(name+'<br>'+'を削除しました。');
            $scope.scenarioList.splice(index, 1);
        });
    };
    
}]);
