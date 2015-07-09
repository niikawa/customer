var accessCtrl = angular.module('accessCtrl',['AccessServices']);
accessCtrl.controller('AccessCtrl',['$scope', 'Shared', 'Access', 'Utility',
function ($scope, Shared, Access, Utility)
{
    function setInitializeScope()
    {
    }
    
    function getInitializeData()
    {
        Access.resource.get().$promise.then(function(err, response)
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
}]);
