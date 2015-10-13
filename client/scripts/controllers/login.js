class LoginController
{
    constructor($scope, Auth, Location)
    {
        this._scope = $scope;
        this._authService = Auth;
        this._locationService = Location;

        this._scope.$emit('loginInit');
        this.data = {mailAddress:'', password:'', remember:false};
    }
    
    submit()
    {
        this._scope.$emit('requestStart');
        this._authService.login(this.data).then(function(response)
        {
            this._scope.$emit('requestEnd');
            this._scope.$emit('loginComplete');
            this._locationService.home();
        }, 
        function()
        {
            this._scope.$emit('requestEnd');
        });
    }
}
LoginController.$inject = ['$scope', 'Auth', 'Location'];
angular.module('loginCtrl',['AuthServices']).controller('LoginCtrl', LoginController);

// var loginCtrl = angular.module('loginCtrl',['AuthServices',]);
// loginCtrl.controller('LoginCtrl', ['$scope', '$location', 'Auth', 'Location',
//     function($scope, $location, Auth, Location) {
    
//     $scope.initialize = function()
//     {
//         $scope.$emit('loginInit');
//         $scope.data = {mailAddress:'', password:'', remember:false};
//     };
    
//     $scope.submit = function()
//     {
//         $scope.$emit('requestStart');
//         Auth.login($scope.data).then(function(response)
//         {
//             $scope.$emit('requestEnd');
//             $scope.$emit('loginComplete');
//             Location.home();
//             //Auth.setLoginStatus(response.data.user_id);
//         }, function()
//         {
//             $scope.$emit('requestEnd');
//         });
//     };
// }]);
