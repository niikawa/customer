var myApp = angular.module('myApp');
myApp.controller('CalendarCtrl',['$scope', function ($scope)
{
}]);
myApp.directive('calendarDirective', function()
{
    return {
        restrict: 'E',
        templateUrl: '../../partials/calendar.html',
        controller: 'CalendarCtrl',
        transclude: true,
        link: function (scope, element, attrs) 
        {
            scope.showCircle = false;
            element.on("mouseenter", function()
            {
                console.log("mouseenter");
                scope.showCircle = true;
            });
            
            element.on("mouseleave", function()
            {
                console.log("mouseleave");
                scope.showCircle = false;
            });
            
        }
    };
});
