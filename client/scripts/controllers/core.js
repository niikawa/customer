var coreCtrl = angular.module('coreCtrl',[]);
coreCtrl.controller('CoreCtrl', ['$scope', 'Shared', function($scope, Shared) 
{
    /** ヘッダー表示 */
    $scope.isHeader = (void 0 !== Shared.get('id'));
    Shared.set('isSpinner', false);

    $scope._construct = function()
    {
        $scope.isHeader = true;
    };
    
    $scope.$on('loginComplete', function(event)
    {
        $scope.isHeader = true;
        $scope.userName = Shared.get('userName');
    });

    $scope.$on('loginInit', function(event)
    {
        $scope.isHeader = false;
    });

    $scope.$on('loginFailed', function(event)
    {
        $scope.isHeader = false;
    });

    $scope.$on('logoutConplete', function(event)
    {
        $scope.isHeader = false;
    });
    
    $scope.$on('requestStart', function(event)
    {
        $scope.isSpinner = true;
    });

    $scope.$on('requestEnd', function(event)
    {
        $scope.isSpinner = false;
    });

}]);
