/**
 * @ngdoc function
 * @name workspaceApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the workspaceApp
 */
var scenarioCtrl = angular.module('scenarioCtrl',['ScenarioServices']);
scenarioCtrl.controller('ScenarioCtrl',['$scope', '$routeParams','Shared', 'Scenario', 
function ($scope, $routeParams, Shared, Scenario)
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
        $scope.scenarioList = Scenario.mock().getList(Scenario.getPageProp($routeParams.scenario).type);

        /* サーバーサイド実装後に開放
        Segment.resource.get().$promise.then(function(response)
        {
            $scope.segmentList = response.data;
        });
        */
    };
    
    $scope.remove = function()
    {
        
    };
    
}]);
