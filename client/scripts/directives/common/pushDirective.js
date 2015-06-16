/**
 * 
 */
var myApp = angular.module('myApp');
myApp.directive('pushDirective', function(){
    return {
        restrict: 'A',
        scope:{
            pushInfo: '=info',
            multiple: '='
        },
        link: function (scope, element, attrs) 
        {
            element.css({cursor: 'pointer'});
            scope.pushInfo.isPush = false;
            
            element.on('click', function()
            {
                scope.$apply(function ()
                {

                    if (element.hasClass('push-active'))
                    {
                        scope.pushInfo.isPush = false;
                        element.removeClass('push-active');
                    }
                    else
                    {
                        if (void 0 === scope.multiple || !scope.multiple)
                        {
                            element.parent().children().removeClass('push-active');
                        }
                        scope.pushInfo.isPush = true;
                        element.addClass('push-active');
                    }
                });
            });
        }
    };
});