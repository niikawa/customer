var accessCtrl = angular.module('accessCtrl',['AccessServices']);
accessCtrl.controller('AccessCtrl',['$scope', 'Shared', 'Access', 'Utility',
function ($scope, Shared, Access, Utility)
{
    function setInitializeScope()
    {
    }
    
    function getInitializeData()
    {
        var today = Utility.today('YYYY/MM/DD');
        Access.resource.post({day: today}).$promise.then(function(response)
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
        
    };
    
    $scope.timeLineInitialize = function()
    {
        getInitializeData();
    };
    
}]);
