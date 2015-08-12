var myApp = angular.module('myApp');
myApp.controller('CalendarCtrl',['$scope','Calendar', 'Utility', function ($scope, Calendar, Utility)
{
    $scope.initialize = function()
    {
        console.log("CalendarCtrl initialize");
//        Calendar.resource()
        
        
    };
}]);
myApp.factory("Calendar", ['$resource','Utility', function($resource, Utility) 
{
    var calendarServices = {};
    
    calendarServices.resource = $resource('/bug/', {}, 
    {
        getWeek:
        {
            method:"GET",
            url: "/bug"
        },
        getMonth:
        {
            method:"GET",
            url: "/bug/resolve/:id"
        },
    });
    
    return calendarServices;
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
