/**
 * core controller
 * 
 * すべての上位コントローラー
 * アプリケーションの全体変更に関する処理のみを記述し、下位コントローラーは継承されたscopeの直接変更するのではなく、
 * bordcastすることで変更通知を行うこと
 */
var coreCtrl = angular.module('coreCtrl',[]);
coreCtrl.controller('CoreCtrl', ['$scope', 'Shared', function($scope, Shared) 
{
    /** ヘッダー表示 */
    $scope.isHeader = (void 0 !== Shared.get('id'));

    $scope._construct = function()
    {
        $scope.isHeader = true;
    };
    
    $scope.$on('loginComplete', function(event)
    {
        $scope.isHeader = true;
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
