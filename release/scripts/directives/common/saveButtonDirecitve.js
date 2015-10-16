'use strict';

var myApp = angular.module('myApp');
myApp.directive('saveButtonDirecitve', ['Shared', function (Shared) {
    return {
        restrict: 'E',
        scope: { is: "=", execute: '&', name: "@" },
        template: '<button ng-if="is" class="close-button" ng-click="click()">{{name}}</button>',
        link: function link(scope, element, attrs) {
            if (3 != Shared.get("role")) {
                scope.isShowMine = true;
            } else {
                scope.isShowMine = false;
            }

            scope.click = function () {
                scope.execute();
            };
        }
    };
}]);
