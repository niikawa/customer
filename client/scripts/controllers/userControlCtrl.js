/**
 * @ngdoc function
 * @name workspaceApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the workspaceApp
 */
var userControlCtrl = angular.module('userControlCtrl',['UesrServices','RoleServices']);
userControlCtrl.controller('UserControlCtrl',['$scope', '$routeParams', 'User', 'Role', 'Utility', 'Location',
function ($scope, $routeParams, User, Role, Utility, Location)
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
            console.log('get user!');
            var id = parseInt($routeParams.id);
            User.resource.get({id: id}).$promise.then(function(response)
            {
                console.log(response.data);
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
                // ロール選択
                role: function (modelValue, viewValue) {
                    var roleList = $scope.roleList || {};
                    var isSelect = false;
                    angular.forEach(roleList, function(item, key)
                    {
                        if (item.isPush) isSelect = true;
                    });
                    console.log(isSelect);
                    return isSelect;
                }
            }
        };
    }
    
    function setRole(items)
    {
        angular.forEach(items, function(item, key)
        {
            if (item.isPush)
            {
                $scope.user.role_id = item.role_id;
            }
        });
    }
    
    /**
     * 初期処理
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
            $scope.userForm.selected_role.$validate();
        },true);
    };
    
    /**
     * 登録/更新
     */
    $scope.save = function()
    {
        setRole($scope.roleList);
        
        User.resource.create({data: $scope.user}).$promise.then(function(response)
        {
            Utility.successSticky('新しくユーザーを登録しました');
            Location.user();
        });
    };

    /**
     * 更新画面初期表示時のロール選択
     */
    $scope.roleActive = function(item, set)
    {
        return item === set;
    };
    
    
    
}]);
