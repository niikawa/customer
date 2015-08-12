var myApp = angular.module('myApp');
myApp.controller('CalendarCtrl',['$scope','Calendar', 'Utility', function ($scope, Calendar, Utility)
{
    $scope.calendarList = [];
    
    $scope.initialize = function()
    {
        console.log("CalendarCtrl initialize");
        Calendar.resource.get().$promise.then(function(response)
        {
            $scope.calendarList = response.data;
        });
    };
    
    $scope.nextDay = function()
    {
        
    };
    
    $scope.deforeDay = function()
    {
        
    };
    
    $scope.showMonth = function()
    {
        
    };
    
}]);
myApp.factory("Calendar", ['$resource','Utility', function($resource, Utility) 
{
    var calendarServices = {};
    
    calendarServices.resource = $resource('/calendar/', {}, 
    {
        calendar:
        {
            method:"GET",
            url: "calendar"
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
