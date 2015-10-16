var myApp = angular.module('myApp');
myApp.directive('spinnerDirective', function()
{
    return {
        restrict: 'E',
        scope: {is: '=', src: '@'},
        template: '<div ng-show="is"><img ng-src="{{src}}"></div>',
        link: function (scope, element, attrs) 
        {
        }
    };
});