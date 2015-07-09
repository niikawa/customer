var accessCtrl = angular.module('accessCtrl',['ScenarioServices']);
accessCtrl.controller('AccessCtrl',['$scope', 'Shared', 'Scenario', 'Utility',
function ($scope, Shared, Scenario, Utility)
{
    function setInitializeScope()
    {
    }
    
    function getInitializeData()
    {
    }
    
    $scope.initialize = function()
    {
        $scope.$emit('requestStart');
        
        $scope._construct();
        setInitializeScope();
        getInitializeData();
        
        $scope.$emit('requestEnd');
    };
}]);
