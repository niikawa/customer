var myApp = angular.module('myApp');
myApp.directive('calendarDirective', function()
{
    return {
        restrict: 'E',
        templateUrl: '../../partials/calendar.html',
        transclude: true,
        link: function (scope, element, attrs) 
        {
            scope.showCircle = false;
            element.on("mouseenter", function()
            {
                console.log("mouseenter");
                element.children().children('i').addClass("show");
                element.children().children('i').removeClass("hide");
//                $(element.find("i")).addClass("show");
                scope.showCircle = true;
            });
            
            element.on("mouseleave", function()
            {
                console.log("mouseleave");
                element.children().children('i').addClass("hide");
                element.children().children('i').removeClass("show");
                scope.showCircle = false;
            });
            
        }
    };
});
