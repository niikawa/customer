/**
 * @ngdoc function
 * @name workspaceApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the workspaceApp
 */
var userCtrl = angular.module('userCtrl',['UesrServices']);
userCtrl.controller('UserCtrl',['$scope', '$routeParams','Shared', 'User', 'Utility',
function ($scope, $routeParams, Shared, User, Utility)
{
    /**
     * scope初期化用
     */
    function setInitializeScope()
    {
//        $scope.addPageTitle = Approach.getPageProp($routeParams.scenario).title;
//        $scope.type = $routeParams.scenario;
        
        $scope.userList = [];
        $scope.warningMessage = '';
    }
    
    /**
     * 初期処理
     * @author niikawa
     */
    $scope.initialize = function()
    {
        $scope._construct();
        setInitializeScope();

        User.resource.get().$promise.then(function(response)
        {
            $scope.userList = response.data;
        });
    };
    
    $scope.remove = function(id)
    {
        console.log(id);
        User.resource.delete({id: id}).$promise.then(function(response)
        {
            Utility.successSticky('ユーザーを削除しました');
        });
        
    };
    
}]);
