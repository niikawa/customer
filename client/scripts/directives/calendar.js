var myApp = angular.module('myApp');
myApp.controller('CalendarCtrl',['$scope','Calendar', 'Utility', function ($scope, Calendar, Utility)
{
    $scope.calendarList = [];
    $scope.calendarofMonthList = [];
    $scope.isWeek = true;
    $scope.isMonth = false;
    var isDisabled = false;
    $scope.initialize = function()
    {
        Calendar.resource.get().$promise.then(function(response)
        {
            $scope.calendarList = response.data;
        });
    };
    
    $scope.nextDay = function()
    {
        if (isDisabled) return;
        isDisabled = true;
        var days = Object.keys($scope.calendarList);
        var last = Utility.moment(days[days.length-1]).format("YYYY-MM-DD");
        var next = Utility.addDay(last, 1).format("YYYY-MM-DD");
        
        Calendar.resource.oneDay({day: next}).$promise.then(function(response)
        {
            delete $scope.calendarList[Object.keys($scope.calendarList)[0]];
            var nextKey = Object.keys(response.data);
            $scope.calendarList[nextKey] = response.data[nextKey];
            isDisabled = false;
        });
    };
    
    $scope.deforeDay = function()
    {
        if (isDisabled) return;
        isDisabled = true;
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
            isDisabled = false;
        });
    };
    
    $scope.showWeek = function()
    {
        if (isDisabled) return;
        isDisabled = true;
        Calendar.resource.get().$promise.then(function(response)
        {
            isDisabled = false;
            $scope.isWeek = true;
            $scope.isMonth = false;
            $scope.calendarList = response.data;
        });
    };
    
    $scope.showMonth = function()
    {
        if (isDisabled) return;
        isDisabled = true;
        var year = Utility.moment(Object.keys($scope.calendarList)[0]).format("YYYY");
        var month = Utility.moment(Object.keys($scope.calendarList)[0]).format("M");
        Calendar.resource.month({year:year, month: month}).$promise.then(function(response)
        {
            isDisabled = false;
            $scope.isWeek = false;
            $scope.isMonth = true;
            $scope.calendarofMonthList = response.data;
            $scope.year = response.year;
            $scope.month = response.month;
        });
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
        month:
        {
            method:"GET",
            url: "calendar/:year/:month"
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
                return 1 === type;
            };
            scope.isScSingle = function(type)
            {
                return 2 === type;
            };
            scope.isScPriod = function(type)
            {
                return 3 === type;
            };
        }
    };
});
