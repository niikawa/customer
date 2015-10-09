/**
 * @ngdoc function
 * @name workspaceApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the workspaceApp
 */
'use strict';

var userCtrl = angular.module('userCtrl', ['UesrServices']);
userCtrl.controller('UserCtrl', ['$scope', '$routeParams', 'Shared', 'User', 'Utility', function ($scope, $routeParams, Shared, User, Utility) {
    function setInitializeScope() {
        $scope.userList = [];
    }

    $scope.initialize = function () {
        Shared.setRoot('user');
        $scope._construct();
        setInitializeScope();

        User.resource.get().$promise.then(function (response) {
            $scope.userList = response.data;
        });
    };

    $scope.remove = function (id) {
        User.resource['delete']({ id: id }).$promise.then(function (response) {
            angular.forEach($scope.userList, function (v, k) {
                if (v.user_id === id) {
                    $scope.userList.splice(k, 1);
                }
            });
            Utility.successSticky('ユーザーを削除しました');
        });
    };
}]);
