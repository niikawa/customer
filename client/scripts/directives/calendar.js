var myApp = angular.module('myApp');
myApp.directive('calendarDirective', function()
{
    return {
        restrict: 'E',
        scope: {},
        templateUrl: '../../partials/calendar.html',
        transclude: true,
        link: function (scope, element, attrs) 
        {
            scope.showCircle = false;
            element.on("mouseenter", function()
            {
                console.log("mouseenter");
                element.children('i').addClass("show");
                scope.showCircle = true;
            })
            
            element.on("mouseleave", function()
            {
                console.log("mouseleave");
//                element.find("i").remnoveClass("show");
                scope.showCircle = false;
            });
            
        }
    };
});
