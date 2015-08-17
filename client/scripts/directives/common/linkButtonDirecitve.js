var myApp = angular.module('myApp');
myApp.directive('linkButtonDirecitve', function(Shared)
{
    return {
        restrict: 'E',
        scope: {href: '=', name: "@"},
        template: '<ng-if="isShowMine" a class="btn btn-default" ng-href="/#/{{href}}">{{name}}</a> ',
        link: function (scope, element, attrs) 
        {
            if (3 != Shared.get("role"))
            {
                scope.isShowMine = true;
            }
            else
            {
                scope.isShowMine = false;
            }
            
            scope.click = function()
            {
                scope.execute();
            };
        }
    };
});