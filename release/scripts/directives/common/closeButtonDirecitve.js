var myApp = angular.module('myApp');
myApp.directive('closeButtonDirecitve', ["Shared", "Utility", function(Shared, Utility)
{
    return {
        restrict: 'E',
        scope: {execute: '&'},
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
                Utility.confirmAlert(scope.execute);
            };
        }
    };
}]);