(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = (function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ('value' in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
})();

var _get = function get(_x, _x2, _x3) {
    var _again = true;_function: while (_again) {
        var object = _x,
            property = _x2,
            receiver = _x3;desc = parent = getter = undefined;_again = false;if (object === null) object = Function.prototype;var desc = Object.getOwnPropertyDescriptor(object, property);if (desc === undefined) {
            var parent = Object.getPrototypeOf(object);if (parent === null) {
                return undefined;
            } else {
                _x = parent;_x2 = property;_x3 = receiver;_again = true;continue _function;
            }
        } else if ('value' in desc) {
            return desc.value;
        } else {
            var getter = desc.get;if (getter === undefined) {
                return undefined;
            }return getter.call(receiver);
        }
    }
};

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { 'default': obj };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError('Cannot call a class as a function');
    }
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== 'function' && superClass !== null) {
        throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass);
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var _core = require('./core');

var _core2 = _interopRequireDefault(_core);

var AccessController = (function (_CoreContrller) {
    _inherits(AccessController, _CoreContrller);

    function AccessController($scope, $sce, $routeParams, Shared, Utility, Access) {
        _classCallCheck(this, AccessController);

        _get(Object.getPrototypeOf(AccessController.prototype), 'constructor', this).call(this);
        this._scope = $scope;
        this.$sce = $sce;
        this.$routeParams = $routeParams;
        this.Shared = Shared;
        this.Access = Access;
        this.Utility = Utility;

        this.Shared.destloy('serchDay');
        this.Shared.setRoot('accsess');

        this.showDate = '';
        this.serchDay = '';
        this.logList = [];

        this.targetName = '';
        this.showDate = '';
        this.timelineList = [];

        this.initialize();
    }

    _createClass(AccessController, [{
        key: 'initialize',
        value: function initialize() {
            var _this = this;

            var today = this.Utility.today('YYYY-MM-DD');
            this._scope.$emit('requestStart');
            this.Access.resource.day({ day: today }).$promise.then(function (response) {
                _this.logList = response.data;
                _this._scope.$emit('requestEnd');
            });
        }
    }, {
        key: 'serchByDay',
        value: function serchByDay() {
            var _this2 = this;

            if (this.Utility.isDateValid(this.serchDay)) {
                this.Access.resource.day({ day: this.serchDay }).$promise.then(function (response) {
                    _this2.logList = response.data;
                    _this2.Shared.set('serchDay', _this2.serchDay);
                });
            }
        }
    }, {
        key: 'getTimeInitializeData',
        value: function getTimeInitializeData() {
            var _this3 = this;

            var day = this.Shared.get('serchDay');
            if (void 0 === day) {
                day = this.Utility.today('YYYY-MM-DD');
            }
            this.Access.resource.day({ day: day, id: this.$routeParams.id }).$promise.then(function (response) {
                _this3.targetName = response.data[0].name;
                _this3.showDate = day;
                _this3.timelineList = response.data;
            });
        }
    }, {
        key: 'setPosition',
        value: function setPosition(index) {
            return index % 2 == 0;
        }
    }]);

    return AccessController;
})(_core2['default']);

AccessController.$inject = ['$scope', '$sce', '$routeParams', 'Shared', 'Utility', 'Access'];

function accessDirective() {
    return {
        restrict: 'E',
        controller: AccessController,
        controllerAs: 'access',
        scope: {},
        templateUrl: 'partials/app/access/history.html'
    };
}
angular.module('myApp').directive('accessHistory', accessDirective);

//angular.module('accessCtrl',['AccessServices']).controller('AccessCtrl', AccessController);

},{"./core":2}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ('value' in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
})();

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError('Cannot call a class as a function');
    }
}

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

},{}]},{},[1]);
