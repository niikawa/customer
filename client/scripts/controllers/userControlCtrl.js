/**
 * @ngdoc function
 * @name workspaceApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the workspaceApp
 */
var userControlCtrl = angular.module('userControlCtrl',['UesrServices']);
userControlCtrl.controller('UserControlCtrl',['$scope', '$routeParams','Shared', 'User',
function ($scope, $routeParams, Shared, User)
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
            var user = User.mock().user;
            var id = parseInt($routeParams.id);
            
            angular.forEach(user, function(value, key)
            {
                if (id === value.user_id)
                {
                    $scope.userData = value;
                }
            });
            /* サーバーサイド実装後に開放
            Scenario.resource.get({id: id}).$promise.then(function(response)
            {
                $scope.segmentList = response.data;
            });
            */
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

        $scope.roleList = User.mock().role;
        
        

        /* サーバーサイド実装後に開放
        Segment.resource.get().$promise.then(function(response)
        {
            $scope.segmentList = response.data;
        });
        */
    };
    
    $scope.remove = function()
    {
        
    };
    
}]);
