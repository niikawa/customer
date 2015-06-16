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
        $scope.user = {};
        $scope.pageTitle = pageProp.title;
            
        if (2 === pageProp.type)
        {
            var id = parseInt($routeParams.id);
            User.resource.get({id: id}).$promise.then(function(response)
            {
                $scope.userData = response.data;
            });
        }
    }
    
    // TODO コントローラーに記載すべきなのか。。。。。
    function setValidation()
    {
        $scope.validators = {
            password:
            {
                // ユーザー名とパスワードは一緒はダメ
                same: function (modelValue, viewValue) {
                    var val = modelValue || viewValue;
                    var user = $scope.user || {};
    
                    return val != user.name;
                }
            },
            password_confirm:
            {
                // パスワード確認
                confirm: function (modelValue, viewValue) {
                    var user = $scope.user || {};
                    var val = modelValue || viewValue;
    
                    return val == user.password;
                }
            },
            selected_role:
            {
                // パスワード確認
                role: function (modelValue, viewValue) {
                    var roleList = $scope.roleList || {};
                    var val = modelValue || viewValue;
                    
                    console.log(val);
    
                    return val == roleList.isPush;
                }
            }
        };
    }
    
    function setRole(items)
    {
        console.log(items);
        angular.forEach(items, function(item, key)
        {
            console.log(item.isPush);
            if (item.isPush)
            {
                $scope.user.role_id = item.role_id;
            }
        });
    }
    
    /**
     * 初期処理
     * @author niikawa
     */
    $scope.initialize = function()
    {
        $scope._construct();
        setInitializeScope();
        setValidation();

        Role.resource.get().$promise.then(function(response)
        {
            $scope.roleList = response.data;
        });
        
       // user_name != password判定のため
        $scope.$watch('user.name', function()
        {
            $scope.userForm.password.$validate();
        });
 
        // password == password_confirm判定のため
        $scope.$watch('user.password', function()
        {
            $scope.userForm.password_confirm.$validate();
        });
        
        $scope.$watch('roleList', function()
        {
            console.log('watch role');
            $scope.userForm.selected_role.$validate();
        },true);
    };
    
    
    $scope.save = function()
    {
        setRole($scope.roleList);
        console.log($scope.user);
    };

    $scope.remove = function()
    {
        
    };
    
}]);
