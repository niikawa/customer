var myApp = angular.module('myApp');
myApp.directive('calendarDirective', function()
{
    return {
        restrict: 'AE',
        scope: {bind: '='},
        templateUrl: '../../partials/calendar.html',
        transclude: true,
        link: function (scope, element, attrs) 
        {
        }
    };
});
