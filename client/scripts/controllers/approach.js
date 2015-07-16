/**
 * @ngdoc function
 * @name workspaceApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the workspaceApp
 */
var approachCtrl = angular.module('approachCtrl',['ApproachServices','ScenarioServices']);
approachCtrl.controller('ApproachCtrl',['$scope', '$routeParams','Shared', 'Utility', 'Approach', 'Scenario',
function ($scope, $routeParams, Shared, Utility, Approach, Scenario)
{
    function setInitializeScope()
    {
        $scope.approach = [];
        $scope.scenarioList = [];
        $scope.warningMessage = '';
    }
    
    function getInitializeData()
    {
        Approach.resource.get().$promise.then(function(approachResponse)
        {
            $scope.approach = approachResponse.data;
            
            Scenario.resource.valid().$promise.then(function(scenarioResponse)
            {
                $scope.scenarioList = scenarioResponse.data;
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
    
}]);
