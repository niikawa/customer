var loginCtrl = angular.module('loginCtrl',['AuthServices',]);
loginCtrl.controller('LoginCtrl', ['$scope', '$location', 'Auth', 'Location',
    function($scope, $location, Auth, Location) {
    
    $scope.initialize = function()
    {
        $scope.$emit('loginInit');
        $scope.data = {mailAddress:'', password:'', remember:false};
    };
    
    $scope.submit = function()
    {
        $scope.$emit('requestStart');
        Auth.login($scope.data).then(function(response)
        {
            $scope.$emit('requestEnd');
            $scope.$emit('loginComplete');
            Location.home();
            //Auth.setLoginStatus(response.data.user_id);
        }, function()
        {
            $scope.$emit('requestEnd');
        });
    };
}]);
