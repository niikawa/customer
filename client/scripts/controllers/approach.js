/**
 * @ngdoc function
 * @name workspaceApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the workspaceApp
 */
var approachCtrl = angular.module('approachCtrl',['ApproachServices','ScenarioServices']);
approachCtrl.controller('ApproachCtrl',['$scope', '$routeParams','Shared', 'Approach', 'Scenario',
function ($scope, $routeParams, Shared, Approach, Scenario)
{
    /**
     * scope初期化用
     */
    function setInitializeScope()
    {
//        $scope.addPageTitle = Approach.getPageProp($routeParams.scenario).title;
//        $scope.type = $routeParams.scenario;
        
        $scope.scenarioList = [];
        $scope.warningMessage = '';
    }
    
    function setEventListeners()
    {
        $scope.$on('dropItemComplete', function(event, data)
        {
            $scope.scenarioList = data.to;
            $scope.$apply();
        });
        
    }
    
    /**
     * 初期処理
     * @author niikawa
     */
    $scope.initialize = function()
    {
        $scope._construct();
        setInitializeScope();
        setEventListeners();
        
        var data = Scenario.mock();
        $scope.scenarioList = data.priorities;

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
