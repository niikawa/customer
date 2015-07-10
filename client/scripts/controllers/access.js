var accessCtrl = angular.module('accessCtrl',['AccessServices']);
accessCtrl.controller('AccessCtrl',['$scope', '$routeParams', 'Shared', 'Access', 'Utility',
function ($scope, $routeParams, Shared, Access, Utility)
{
    function setInitializeScope()
    {
    }
    
    function getInitializeData()
    {
        var today = Utility.today('YYYY/MM/DD');
        Access.resource.day({day: today}).$promise.then(function(response)
        {
            $scope.logList = response.data;
        });
    }
    
    $scope.initialize = function()
    {
        $scope.$emit('requestStart');
        
        $scope._construct();
        setInitializeScope();
        getInitializeData();
        
        $scope.$emit('requestEnd');
    };
    
    
    function getTimeInitializeData()
    {
        var today = Utility.today('YYYY/MM/DD');
        Access.resource.day({day: today, id: $routeParams.id}).$promise.then(function(response)
        {
            $scope.logList = response.data;
        });
    }
    
    $scope.timeLineInitialize = function()
    {
        getTimeInitializeData();
    };
    
}]);
