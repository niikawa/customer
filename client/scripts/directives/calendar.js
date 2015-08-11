var myApp = angular.module('myApp');
myApp.controller('CalendarCtrl',['$scope', function ($scope)
{
    $scope.showCircle = true;

}]);
myApp.directive('calendarDirective', function()
{
    return {
        restrict: 'E',
        templateUrl: '../../partials/calendar.html',
        controller: 'CalendarCtrl',
        replace: true,
        link: function (scope, element, attrs, ctrl) 
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
            
            scope.test = function()
            {
                alert("hote");
            }
        }
    };
});
