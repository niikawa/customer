var myApp = angular.module('myApp');
myApp.controller('CalendarCtrl',['$scope','Utility', function ($scope, Utility)
{
    $scope.initialize = function()
    {
        console.log("CalendarCtrl initialize");
        
    };

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

            scope.enterCircle = function()
            {
                scope.showCircle = true;
            };
            
            scope.leaveCircle = function()
            {
                scope.showCircle = false;
            };
        }
    };
});
