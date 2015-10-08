var myApp = angular.module('myApp');
myApp.directive('myValidators', [function() {
    return {
        require: 'ngModel',
        scope: {
            myValidators: '=',
        },
        link: function (scope, elem, attrs, ctrl) {
            var validators = scope.myValidators || {};
            angular.forEach(validators, function (val, key) {
                ctrl.$validators[key] = val;
            });
        }
    };
}]);
myApp.directive('myAsyncValidators', [function() {
    return {
        require: 'ngModel',
        scope: {
            myAsyncValidators: '='
        },
        link: function (scope, elem, attrs, ctrl) {
            var asyncValidators = scope.myAsyncValidators || {};
            angular.forEach(asyncValidators, function (val, key) {
                ctrl.$asyncValidators[key] = val;
            });
        }
    };
}]);