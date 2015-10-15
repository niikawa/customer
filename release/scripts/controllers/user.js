'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var UserControll = (function () {
    function UserControll($scope, $routeParams, Shared, Utility, User) {
        var _this = this;

        _classCallCheck(this, UserControll);

        this._scope = $scope;
        this._routeParams = $routeParams;
        this._sharedService = Shared;
        this._utilityService = Utility;
        this._userService = User;

        this._scope._construct();

        this.userList = [];
        this._sharedService.setRoot('user');

        this._userService.resource.get().$promise.then(function (response) {
            _this.userList = response.data;
        });
    }

    _createClass(UserControll, [{
        key: 'remove',
        value: function remove(id, index) {
            var _this2 = this;

            this._userService.resource['delete']({ id: id }).$promise.then(function (response) {
                _this2.userList.splice(index, 1);
                _this2._utilityService.successSticky('ユーザーを削除しました');
            });
        }
    }]);

    return UserControll;
})();

UserControll.$inject = ['$scope', '$routeParams', 'Shared', 'Utility', 'User'];
angular.module('userCtrl', ['UesrServices']).controller('UserCtrl', UserControll);

//
// ↓↓↓↓↓↓↓ anguler + ES5 ↓↓↓↓↓
//
// var userCtrl = angular.module('userCtrl',['UesrServices']);
// userCtrl.controller('UserCtrl',['$scope', '$routeParams','Shared', 'User', 'Utility',
// function ($scope, $routeParams, Shared, User, Utility)
// {
//     function setInitializeScope()
//     {
//         $scope.userList = [];
//     }

//     $scope.initialize = function()
//     {
//         Shared.setRoot('user');
//         $scope._construct();
//         setInitializeScope();

//         User.resource.get().$promise.then(function(response)
//         {
//             $scope.userList = response.data;
//         });
//     };

//     $scope.remove = function(id)
//     {
//         User.resource.delete({id: id}).$promise.then(function(response)
//         {
//             angular.forEach($scope.userList, function(v, k)
//             {
//                 if (v.user_id === id)
//                 {
//                     $scope.userList.splice(k,1);
//                 }
//             });
//             Utility.successSticky('ユーザーを削除しました');
//         });

//     };

// }]);
