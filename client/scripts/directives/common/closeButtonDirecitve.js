var myApp = angular.module('myApp');
myApp.controller('CloseButtonCtrl',['$scope', 'Modal', function ($scope, Modal)
{
    var ctrl = this;
    
    ctrl.modal = function()
    {
        $scope.modalParam = 
        {
            title: "",
            message: "",
            isExecute: false,
        };
        $scope.modalInstance = Modal.open($scope.modalParam, "partials/modal/message.html");
    };
    
}]);

myApp.directive('closeButtonDirecitve', function(Shared, Modal)
{
    return {
        restrict: 'E',
        scope: {execute: '&', params: "="},
        controller:'CloseButtonCtrl',
        template: '<button ng-if="isShowMine" class="close-button" ng-click="click()"><i class="fa fa-times"></i></button>',
        link: function (scope, element, attrs, closeButtonCtrl) 
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
                console.log(closeButtonCtrl);
                closeButtonCtrl.modal();
                // scope.modalParam = 
                // {
                //     title: "",
                //     message: "",
                //     isExecute: false,
                // };
                // scope.modalInstance = Modal.open(scope.modalParam, "partials/modal/message.html");
                
//                scope.execute();
            };
        }
    };
});