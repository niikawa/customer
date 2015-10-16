'use strict';

var myApp = angular.module('myApp');
myApp.directive('linkButtonDirecitve', ['Shared', function (Shared) {
    return {
        restrict: 'E',
        scope: { href: '@', name: "@" },
        template: '<a ng-if="isShowMine" class="btn btn-default" ng-href="/#/{{href}}">{{name}}</a> ',
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
