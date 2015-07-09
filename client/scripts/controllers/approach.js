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
        
        var data = Scenario.mock();
        $scope.scenarioList = data.priorities;
    };
    
    $scope.save = function()
    {
        console.log($scope.approach);
    };
    
    $scope.savePriority = function()
    {
        console.log($scope.scenarioList);
    };
    
}]);
