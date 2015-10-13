'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var LoginController = (function () {
    function LoginController($scope, $location, Auth, Location) {
        _classCallCheck(this, LoginController);

        this._scope = $scope;
        this._location = $location;
        this._authService = Auth;
        this._locationService = Location;

        this._scope.$emit('loginInit');
        this.data = { mailAddress: '', password: '', remember: false };
    }

    _createClass(LoginController, [{
        key: 'submit',
        value: function submit() {
            this._scope.$emit('requestStart');
            this._authService.login(this.data).then(function (response) {
                this._scope.$emit('requestEnd');
                this._scope.$emit('loginComplete');
                this._locationService.home();
            }, function () {
                this._scope.$emit('requestEnd');
            });
        }
    }]);

    return LoginController;
})();

LoginController.$inject = ['$scope', '$location', 'Auth', 'Location'];
angular.module('loginCtrl', ['AuthServices']).controller('LoginCtrl', LoginController);

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
