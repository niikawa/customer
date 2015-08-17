var myApp = angular.module('myApp');
myApp.directive('closeButtonDirecitve', function(Shared)
{
    return {
        restrict: 'E',
        scope: {execute: '&', params: "="},
        template: '<button ng-if="isShowMine" class="close-button" ng-click="click()"><i class="fa fa-times"></i></button>',
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