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
                element.children('i').removeClass("hide");
                scope.showCircle = true;
            })
            
            element.on("mouseleave", function()
            {
                console.log("mouseleave");
                element.children('i').addClass("hide");
                element.children('i').removeClass("show");
                scope.showCircle = false;
            });
            
        }
    };
});
