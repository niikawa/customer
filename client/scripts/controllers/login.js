var loginCtrl = angular.module('loginCtrl',['AuthServices',]);
loginCtrl.controller('LoginCtrl', ['$scope', '$location', 'Auth',
    function($scope, $location, Auth) {
    
    $scope.initialize = function()
    {
        $scope.$emit('loginInit');
        $scope.data = {mailAddress:'', password:'', remember:false};
    };
    
    $scope.submit = function()
    {
        $scope.$emit('loginComplete');
        $location.path('/');
        //$scope.$emit('requestStart');
        // Auth.login($scope.data).then(function(response)
        // {
        //     $scope.$emit('requestEnd');
        //     $scope.$emit('loginComplete');
        //     Auth.setLoginStatus(response.data.item._id);
        // });
    };
}]);
