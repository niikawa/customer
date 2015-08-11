var myApp = angular.module('myApp');
myApp.directive('calendarDirective', function()
{
    return {
        restrict: 'E',
        scope:{showCircle:"="},
        templateUrl: '../../partials/calendar.html',
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
