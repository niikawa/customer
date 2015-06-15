app.directive('myValidators', function () {
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
});