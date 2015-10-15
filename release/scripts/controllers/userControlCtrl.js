'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var UserControlController = (function () {
    function UserControlController($scope, $routeParams, Shared, Utility, Location, User, Role) {
        var _this = this;

        _classCallCheck(this, UserControlController);

        this._scope = $scope;
        this._routeParams = $routeParams;
        this._sharedService = Shared;
        this._utilityService = Utility;
        this._locationService = Location;
        this._userService = User;
        this._roleService = Role;

        this._sharedService.setRoot('user control');
        this._scope._construct();

        this.pageProp = this._userService.getPageProp(this._routeParams.id);
        this.user = {};
        this.pageTitle = this.pageProp.title;
        this.showPassword = true;
        this.passwordEdit = { show: '1' };
        this.pageType = this.pageProp.type;

        if (2 === this.pageProp.type) {
            this.passwordEdit.show = '0';
            this.showPassword = false;
            var id = parseInt(this._routeParams.id, 10);
            this._userService.resource.get({ id: id }).$promise.then(function (response) {
                _this.user = response.data[0];
                _this.user.password_confirm = _this.user.password;
            });
        }

        this._setValidation();

        this._roleService.resource.get().$promise.then(function (response) {
            _this.roleList = response.data;
        });

        if (1 === this.passwordEdit) {
            // user_name != password判定のため
            this._scope.$watch('user.name', function () {
                this._scope.userForm.password.$validate();
            });

            // password == password_confirm判定のため
            this._scope.$watch('user.password', function () {
                this._scope.userForm.password_confirm.$validate();
            });
        }

        this._scope.$watch('roleList', function () {
            this._scope.userForm.selected_role.$validate();
        }, true);
    }

    _createClass(UserControlController, [{
        key: '_setValidation',
        value: function _setValidation() {
            this.validators = {
                password: {
                    // ユーザー名とパスワードは一緒はダメ
                    same: function same(modelValue, viewValue) {
                        var val = modelValue || viewValue;
                        var user = this.user || {};

                        return val != user.name;
                    }
                },
                password_confirm: {
                    // パスワード確認
                    confirm: function confirm(modelValue, viewValue) {
                        var user = this.user || {};
                        var val = modelValue || viewValue;

                        return val == user.password;
                    }
                },
                selected_role: {
                    // ロール選択
                    role: function role(modelValue, viewValue) {
                        var roleList = this.roleList || {};
                        var isSelect = false;
                        angular.forEach(roleList, function (item, key) {
                            if (item.isPush) isSelect = true;
                        });

                        return isSelect;
                    }
                }
            };
            this.asyncValidators = {
                mailaddress: {
                    same: function same(modelValue, viewValue) {
                        var val = modelValue || viewValue;
                        if (void 0 === val || val.length === 0) return true;

                        return this._userService.validators.isSameMailAddress(this.user.user_id, val);
                    }
                }
            };
        }
    }, {
        key: '_setRole',
        value: function _setRole(items) {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = items[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var item = _step.value;

                    if (item.isPush) {
                        this.user.role_id = item.role_id;
                        break;
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator['return']) {
                        _iterator['return']();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }
    }, {
        key: 'save',
        value: function save() {
            this._setRole(this.roleList);
            var message = this.user.name + 'さんの情報を保存しました';
            if (2 === this.pageProp.type) {
                this._utilityService.deleteCommonInfo(this.user);
                if ('1' !== this.passwordEdit.show) {
                    delete this.user.password_confirm;
                    delete this.user.password;
                }
                this._userService.resource.save({ id: this.user.user_id, data: this.user }).$promise.then(function (response) {
                    this._utilityService.successSticky(message);
                    this._locationService.user();
                });
            } else {
                this._userService.resource.create({ data: this.user }).$promise.then(function (response) {
                    this._utilityService.successSticky(message);
                    this._locationService.user();
                });
            }
        }
    }, {
        key: 'isSameMailAddress',
        value: function isSameMailAddress() {
            this.userForm.mailaddress.$validate();
        }
    }]);

    return UserControlController;
})();

UserControlController.$inject = ['$scope', '$routeParams', 'Shared', 'Utility', 'Location', 'User', 'Role'];
angular.module('userControlCtrl', ['UesrServices', 'RoleServices']).controller('UserControlCtrl', UserControlController);

// var userControlCtrl = angular.module('userControlCtrl',['UesrServices','RoleServices']);
// userControlCtrl.controller('UserControlCtrl',['$scope', '$routeParams', 'User', 'Role', 'Utility', 'Shared','Location',
// function ($scope, $routeParams, User, Role, Utility, Shared, Location)
// {
//     var pageProp = User.getPageProp($routeParams.id);

//     function setInitializeScope()
//     {
//         $scope.user = {};
//         $scope.pageTitle = pageProp.title;
//         $scope.showPassword = true;
//         $scope.passwordEdit = {show: '1'};
//         $scope.pageType = pageProp.type;

//         if (2 === pageProp.type)
//         {
//             $scope.passwordEdit.show = '0';
//             $scope.showPassword = false;
//             var id = parseInt($routeParams.id, 10);
//             User.resource.get({id: id}).$promise.then(function(response)
//             {
//                 $scope.user = response.data[0];
//                 $scope.user.password_confirm = $scope.user.password;
//             });
//         }
//     }

//     // TODO コントローラーに記載すべきなのか。。。。。
//     function setValidation()
//     {
//         $scope.validators =
//         {
//             password:
//             {
//                 // ユーザー名とパスワードは一緒はダメ
//                 same: function (modelValue, viewValue)
//                 {
//                     var val = modelValue || viewValue;
//                     var user = $scope.user || {};

//                     return val != user.name;
//                 }
//             },
//             password_confirm:
//             {
//                 // パスワード確認
//                 confirm: function (modelValue, viewValue)
//                 {
//                     var user = $scope.user || {};
//                     var val = modelValue || viewValue;

//                     return val == user.password;
//                 }
//             },
//             selected_role:
//             {
//                 // ロール選択
//                 role: function (modelValue, viewValue)
//                 {
//                     var roleList = $scope.roleList || {};
//                     var isSelect = false;
//                     angular.forEach(roleList, function(item, key)
//                     {
//                         if (item.isPush) isSelect = true;
//                     });
//                     return isSelect;
//                 }
//             },
//         };
//         $scope.asyncValidators =
//         {
//             mailaddress:
//             {
//                 same: function (modelValue, viewValue)
//                 {
//                     var val = modelValue || viewValue;
//                     if (void 0 === val || val.length === 0) return true;

//                     return User.validators.isSameMailAddress($scope.user.user_id, val);
//                 }
//             }
//         };
//     }

//     function setRole(items)
//     {
//         angular.forEach(items, function(item, key)
//         {
//             if (item.isPush)
//             {
//                 $scope.user.role_id = item.role_id;
//             }
//         });
//     }

//     $scope.initialize = function()
//     {
//         Shared.setRoot('user control');
//         $scope._construct();
//         setInitializeScope();
//         setValidation();

//         Role.resource.get().$promise.then(function(response)
//         {
//             $scope.roleList = response.data;
//         });

//         if (1 === $scope.passwordEdit)
//         {
//             // user_name != password判定のため
//             $scope.$watch('user.name', function()
//             {
//                 $scope.userForm.password.$validate();
//             });

//             // password == password_confirm判定のため
//             $scope.$watch('user.password', function()
//             {
//                 $scope.userForm.password_confirm.$validate();
//             });
//         }

//         $scope.$watch('roleList', function()
//         {
//             $scope.userForm.selected_role.$validate();
//         },true);
//     };

//     /**
//      * 登録/更新
//      */
//     $scope.save = function()
//     {
//         setRole($scope.roleList);

//         var message = $scope.user.name + 'さんの情報を保存しました';
//         if (2 === pageProp.type)
//         {
//             Utility.deleteCommonInfo($scope.user);
//             if ('1' !== $scope.passwordEdit.show)
//             {
//                 delete $scope.user.password_confirm;
//                 delete $scope.user.password;
//             }
//             User.resource.save({id: $scope.user.user_id, data: $scope.user}).$promise.then(function(response)
//             {
//                 Utility.successSticky(message);
//                 Location.user();
//             });
//         }
//         else
//         {
//             User.resource.create({data: $scope.user}).$promise.then(function(response)
//             {
//                 Utility.successSticky(message);
//                 Location.user();
//             });
//         }
//     };

//     $scope.isSameMailAddress = function()
//     {
//         $scope.userForm.mailaddress.$validate();
//     };

// }]);
