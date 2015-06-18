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
        $scope.showPassword = true;
        $scope.pageType = pageProp.type;

        if (2 === pageProp.type)
        {
            $scope.showPassword = false;
            var id = parseInt($routeParams.id, 10);
            User.resource.get({id: id}).$promise.then(function(response)
            {
                $scope.user = response.data[0];
                $scope.user.password_confirm = $scope.user.password;
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
                same: function (modelValue, viewValue)
                {
                    var val = modelValue || viewValue;
                    var user = $scope.user || {};
    
                    return val != user.name;
                }
            },
            password_confirm:
            {
                // パスワード確認
                confirm: function (modelValue, viewValue)
                {
                    var user = $scope.user || {};
                    var val = modelValue || viewValue;
    
                    return val == user.password;
                }
            },
            selected_role:
            {
                // ロール選択
                role: function (modelValue, viewValue)
                {
                    var roleList = $scope.roleList || {};
                    var isSelect = false;
                    angular.forEach(roleList, function(item, key)
                    {
                        if (item.isPush) isSelect = true;
                    });
                    return isSelect;
                }
            },
            mailaddress:
            {
                same: function (modelValue, viewValue)
                {
                    var val = modelValue || viewValue;
                    if (void 0 === val || val.length === 0) return true;
                    
                    //形式不正の場合も送信したくない
                    
                    User.resource.isSameMailAddress({user_id: $scope.user.user_id, mailaddress: val}).$promise.then(function(response)
                    {
                        console.log(response.result.count);
                        return (0 === response.result.count);
                    });
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
        var message = '';
        if (2 === pageProp.type)
        {
            message = $scope.user.name + 'の情報を更新しました';
            User.resource.update({data: $scope.user}).$promise.then(function(response)
            {
                Utility.successSticky(message);
                Location.user();
            });
        }
        else
        {
            message = '新しくユーザーを登録しました';
            User.resource.create({data: $scope.user}).$promise.then(function(response)
            {
                Utility.successSticky(message);
                Location.user();
            });
        }
    };
    
    $scope.isSameMailAddress = function()
    {
        $scope.userForm.mailaddress.$validate();
    };

}]);
