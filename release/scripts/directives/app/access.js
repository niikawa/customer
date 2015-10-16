'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var AccessController = (function () {
    function AccessController($scope, $sce, $routeParams, Shared, Utility, Access) {
        _classCallCheck(this, AccessController);

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
        this._initialize();
    }

    _createClass(AccessController, [{
        key: 'initialize',
        value: function initialize() {
            var _this = this;

            this._scope._construct();
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
})();

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
