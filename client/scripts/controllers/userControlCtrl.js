/**
 * @ngdoc function
 * @name workspaceApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the workspaceApp
 */
var userControlCtrl = angular.module('userControlCtrl',['UesrServices','RoleServices']);
userControlCtrl.controller('UserControlCtrl',['$scope', '$routeParams', 'User', 'Role', 'Utility', 'Shared','Location',
function ($scope, $routeParams, User, Role, Utility, Shared, Location)
{
    var pageProp = User.getPageProp($routeParams.id);
    
    function setInitializeScope()
    {
        $scope.user = {};
        $scope.pageTitle = pageProp.title;
        $scope.showPassword = true;
        $scope.passwordEdit = {show: '1'};
        $scope.pageType = pageProp.type;

        if (2 === pageProp.type)
        {
            $scope.passwordEdit.show = '0';
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
        $scope.validators = 
        {
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
        };
        $scope.asyncValidators = 
        {
            mailaddress:
            {
                same: function (modelValue, viewValue)
                {
                    var val = modelValue || viewValue;
                    if (void 0 === val || val.length === 0) return true;
                    
                    return User.validators.isSameMailAddress($scope.user.user_id, val);
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
    
    $scope.initialize = function()
    {
        Shared.setRoot('user control');
        $scope._construct();
        setInitializeScope();
        setValidation();

        Role.resource.get().$promise.then(function(response)
        {
            $scope.roleList = response.data;
        });
        
        if (1 === $scope.passwordEdit)
        {
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
        }
    
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
        
        var message = $scope.user.name + 'さんの情報を保存しました';
        if (2 === pageProp.type)
        {
            Utility.deleteCommonInfo($scope.user);
            if ('1' !== $scope.passwordEdit.show)
            {
                delete $scope.user.password_confirm;
                delete $scope.user.password;
            }
            User.resource.save({id: $scope.user.user_id, data: $scope.user}).$promise.then(function(response)
            {
                Utility.successSticky(message);
                Location.user();
            });
        }
        else
        {
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
