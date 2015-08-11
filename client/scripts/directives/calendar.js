var myApp = angular.module('myApp');
myApp.directive('calendarDirective', function()
{
    return {
        restrict: 'E',
        scope: {bind: '='},
        templateUrl: '../../partials/calendar.html',
        transclude: true,
        link: function (scope, element, attrs) 
        {
            scope.showCircle = false;
            element.on("mouseorver", function()
            {
                scope.showCircle = true;
            });
            
            element.on("mouseout", function()
            {
                scope.showCircle = true;
            });
            
        }
    };
});
