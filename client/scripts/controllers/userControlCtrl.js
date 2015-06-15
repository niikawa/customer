/**
 * @ngdoc function
 * @name workspaceApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the workspaceApp
 */
var userControlCtrl = angular.module('userControlCtrl',['UesrServices','RoleServices']);
userControlCtrl.controller('UserControlCtrl',['$scope', '$routeParams','Shared', 'User', 'Role',
function ($scope, $routeParams, Shared, User, Role)
{
    var pageProp = User.getPageProp($routeParams.id);
    /**
     * scope初期化用
     */
    function setInitializeScope()
    {
        $scope.userData = {};
        $scope.pageTitle = pageProp.title;
            
        if (2 === pageProp.type)
        {
            var id = parseInt($routeParams.id);
            User.resource.get({id: id}).$promise.then(function(response)
            {
                $scope.userData = response.data;
            });
        }
        else
        {
            console.log(pageProp);
        }
        
        
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

        Role.resource.get().$promise.then(function(response)
        {
            $scope.roleList = response.data;
        });
    };
    
    $scope.remove = function()
    {
        
    };
    
}]);
