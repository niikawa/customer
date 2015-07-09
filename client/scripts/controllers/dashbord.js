var mainCtrl = angular.module('dashbordCtrl',['ScenarioServices']);
mainCtrl.controller('DashbordCtrl',['$scope', 'Shared', 'Scenario', 'Utility',
function ($scope, Shared, Scenario, Utility)
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
        
        $scope.$emit('requestEnd');
        
        /* サーバーサイド実装後に開放
        Scenario.resource.get().$promise.then(function(response)
        {
            $scope.scenario = response.data.scenario;
            $scope.executePlanScenario = response.data.executePlanScenario;
        });
        */
        
    };
}]);
