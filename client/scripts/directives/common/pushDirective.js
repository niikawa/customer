/**
 * 
 */
var myApp = angular.module('myApp');
myApp.directive('pushDirective', function(){
    return {
        restrict: 'A',
        scope:{
            pushInfo: '=info',
        },
        link: function (scope, element, attrs) 
        {
            element.css({cursor: 'pointer'}); 
            scope.pushInfo.isPush = false;
            
            element.on('click', function()
            {
                if (element.hasClass('push-active'))
                {
                    scope.pushInfo.isPush = false;
                    element.removeClass('push-active');
                }
                else
                {
                    scope.pushInfo.isPush = true;
                    element.addClass('push-active');
                }
            });
        }
    };
});