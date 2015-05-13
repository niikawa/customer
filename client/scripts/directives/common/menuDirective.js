var myApp = angular.module('myApp');
myApp.controller('HeadCtrl',['$scope', 'Auth', 'Modal', 'Shared', 'Mail', function ($scope, Auth, Modal, Shared, Mail)
{
    $scope.addMenber = function()
    {
        $scope.modalParam = 
        {
            mailaddress:'',
            execute: sendMail,
        };
        $scope.modalInstance = Modal.open($scope, "partials/memberAdd.html");
    };
    
    $scope.logout = function()
    {
        Shared.destloy();
        Auth.logout().then(function()
        {
            $scope.$emit('logoutConplete');
        });
    };
    
    var sendMail = function()
    {
        Mail.resource.save({site: 'niikawa'}).$promise.then(function()
        {
            $scope.modalInstance.close();
        });
    };
}]);

myApp.directive('myHeader', function(){
    return {
        restrict: 'E',
        replace: true,
        controller: 'HeadCtrl',
        templateUrl: 'partials/common/header.html',
        link: function (scope, element, attrs, ctrl) 
        {
            
        }
    };
});

