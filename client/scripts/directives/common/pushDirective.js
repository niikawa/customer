/**
 * 
 */
var myApp = angular.module('myApp');
myApp.directive('pushDirective', function(){
    return {
        restrict: 'A',
        scope:{
            list : '=',
            pushInfo: '=info',
            active: '&',
            multiple: '='
        },
        link: function (scope, element, attrs) 
        {
            element.css({cursor: 'pointer'});
            
            if (void 0 !== scope.active)
            {
                scope.pushInfo.isPush = scope.active();
                element.addClass('push-active');
            }
            else
            {
                scope.pushInfo.isPush = false;
            }

            element.on('click', function()
            {
                scope.$apply(function()
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
                            angular.forEach(scope.list, function(item, key){item.isPush = false;});
                        }
                        scope.pushInfo.isPush = true;
                        element.addClass('push-active');
                    }
                });
            });
        }
    };
});