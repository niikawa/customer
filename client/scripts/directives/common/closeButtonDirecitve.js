var myApp = angular.module('myApp');
myApp.directive('closeButtonDirecitve', function(Shared)
{
    return {
        restrict: 'E',
        scope: {execute: '&', params: "="},
        template: '<button ng-if="isShowMine" class="close-button" ng-click="click()"><i class="fa fa-times"></i></button>',
        link: function (scope, element, attrs) 
        {
            if (1 == Shared.get("role"))
            {
                console.log("ok");
                console.log(Shared.get("role"));                
                scope.isShowMine = true;
            }
            else
            {
                console.log("dameyo");
                console.log(Shared.get("role"));                
                scope.isShowMine = false;
            }
            
            scope.click = function()
            {
                scope.execute();
            };
        }
    };
});