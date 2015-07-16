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
                $scope.isShowExecutePlanScenario = (response.data.length > 0);
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
        Shared.setRoot('dashbord');
        
        $scope.$emit('requestEnd');
    };
}]);
