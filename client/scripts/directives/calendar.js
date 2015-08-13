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
        var days = Object.keys($scope.calendarList);
        var last = Utility.moment(days[days.length-1]).format("YYYY-MM-DD");
        var next = Utility.addDay(last, 1).format("YYYY-MM-DD");
        
        Calendar.resource.oneDay({day: next}).$promise.then(function(response)
        {
            delete $scope.calendarList[Object.keys($scope.calendarList)[0]];
            var nextKey = Object.keys(response.data);
            $scope.calendarList[nextKey] = response.data[nextKey];
        });
    };
    
    $scope.deforeDay = function()
    {
        var last = Utility.moment(Object.keys($scope.calendarList)[0]).format("YYYY-MM-DD");
        var next = Utility.subtractDay(last, 1).format("YYYY-MM-DD");
        
        Calendar.resource.oneDay({day: next}).$promise.then(function(response)
        {
            var days = Object.keys($scope.calendarList);
            delete $scope.calendarList[days[days.length-1]];
            var minKey = Object.keys(response.data);
            var newList = {};
            newList[minKey] = response.data[minKey];
            Object.keys($scope.calendarList).forEach(function(key)
            {
                newList[key] = $scope.calendarList[key];
            });
            $scope.calendarList = newList;
        });
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
        oneDay:
        {
            method:"GET",
            url: "calendar/one/:day"
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
            
            scope.isTrigger = function(type)
            {
                return  1 === type;
            };
            scope.isScPriod = function(type)
            {
                return  2 === type;
            };
            scope.isScSingle = function(type)
            {
                return  3 === type;
            };
        }
    };
});
