'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var CoreContrller = (function () {
    function CoreContrller($scope, Shared) {
        _classCallCheck(this, CoreContrller);

        this._scope = $scope;
        this._shared = Shared;

        this.isHeader = void 0 !== this._shared.get('id');
        this._shared.set('isSpinner', false);
    }

    _createClass(CoreContrller, [{
        key: 'loginInit',
        value: function loginInit() {
            this._scope.isHeader = false;
        }
    }, {
        key: 'loginComplete',
        value: function loginComplete() {
            this._scope.isHeader = true;
            this._scope.userName = this._shared.get('userName');
        }
    }, {
        key: 'loginFailed',
        value: function loginFailed() {
            this._scope.isHeader = false;
        }
    }, {
        key: 'logoutConplete',
        value: function logoutConplete() {
            this._scope.isHeader = false;
        }
    }, {
        key: 'requestStart',
        value: function requestStart() {
            this._scope.isSpinner = true;
        }
    }, {
        key: 'requestEnd',
        value: function requestEnd() {
            this._scope.isSpinner = false;
        }
    }]);

    return CoreContrller;
})();

exports['default'] = CoreContrller;

CoreContrller.$inject = ['$scope', 'Shared'];

// var coreCtrl = angular.module('coreCtrl',[]);
// coreCtrl.controller('CoreCtrl', ['$scope', 'Shared', function($scope, Shared)
// {

//     $scope._construct = function()
//     {
//         $scope.isHeader = true;
//     };

//     $scope.$on('loginComplete', function(event)
//     {
//         $scope.isHeader = true;
//         $scope.userName = Shared.get('userName');
//     });

//     $scope.$on('loginInit', function(event)
//     {
//         $scope.isHeader = false;
//     });

//     $scope.$on('loginFailed', function(event)
//     {
//         $scope.isHeader = false;
//     });

//     $scope.$on('logoutConplete', function(event)
//     {
//         $scope.isHeader = false;
//     });

//     $scope.$on('requestStart', function(event)
//     {
//         $scope.isSpinner = true;
//     });

//     $scope.$on('requestEnd', function(event)
//     {
//         $scope.isSpinner = false;
//     });

// }]);
module.exports = exports['default'];
