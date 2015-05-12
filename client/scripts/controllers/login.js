var loginCtrl = angular.module('loginCtrl',['AuthServices',]);
loginCtrl.controller('LoginCtrl', ['$scope', 'Auth',
    function($scope, Auth) {
    
    $scope.initialize = function()
    {
        $scope.data = {mailAddress:'', password:'', remember:false};
    };
    
    $scope.submit = function()
    {
        Auth.login($scope.data).then(function(response)
        {
            $scope.$emit('loginComplete');
            Auth.setLoginStatus(response.data.item._id);
        });
    };
}]);
