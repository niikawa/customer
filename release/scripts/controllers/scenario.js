//
// ScenarioController
//
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var ScenarioController = (function () {
    function ScenarioController($scope, $routeParams, Shared, Utility, Scenario) {
        _classCallCheck(this, ScenarioController);

        this._scope = $scope;
        this._routeParams = $routeParams;
        this._sharedService = Shared;
        this._utilityService = Utility;
        this._scenarioService = Scenario;

        this._sharedService.setRoot('scenario');
        this._scope._construct();

        var type = this._routeParams;
        this.addPageTitle = Scenario.getPageProp(type).title;
        this.type = type;
        this.scenarioList = [];
        this.scenarioSearch = '';
        this._initialize();
    }

    _createClass(ScenarioController, [{
        key: '_initialize',
        value: function _initialize() {
            var _this = this;

            this._scenarioService.resource.get({ type: this.type }).$promise.then(function (response) {
                _this.isScenarioShow = response.data.length > 0 ? true : false;
                if (_this.isScenarioShow) _this.scenarioList = response.data;
            });
        }
    }, {
        key: 'remove',
        value: function remove(index) {
            var _this2 = this;

            if (void 0 === index || isNaN(parseInt(index, 10))) return false;
            var params = {
                type: this.type,
                id: this.scenarioList[index].scenario_id
            };
            var name = this.scenarioList[index].scenario_name;

            this._scenarioService.resource.remove(params).$promise.then(function (response) {
                _this2._utilityService.info(name + '<br>' + 'を削除しました。');
                _this2.scenarioList.splice(index, 1);
                _this2.isScenarioShow = _this2.scenarioList.length > 0 ? true : false;
            });
        }
    }]);

    return ScenarioController;
})();

ScenarioController.$inject = ['$scope', '$routeParams', 'Shared', 'Utility', 'Scenario'];
angular.module('accessCtrl', ['ScenarioServices']).controller('ScenarioCtrl', ScenarioController);

/**
 * @ngdoc function
 * @name workspaceApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the workspaceApp
 */
// var scenarioCtrl = angular.module('scenarioCtrl',['ScenarioServices']);
// scenarioCtrl.controller('ScenarioCtrl',['$scope', '$routeParams','Shared', 'Utility', 'Scenario',
// function ($scope, $routeParams, Shared, Utility, Scenario)
// {
//     function setInitializeScope()
//     {
//         $scope.addPageTitle = Scenario.getPageProp($routeParams.scenario).title;
//         $scope.type = $routeParams.scenario;

//         $scope.scenarioList = [];
//     }

//     $scope.initialize = function()
//     {
//         Shared.setRoot('scenario');
//         $scope._construct();
//         setInitializeScope();

//         Scenario.resource.get({type: $routeParams.scenario}).$promise.then(function(response)
//         {
//             $scope.isScenarioShow = response.data.length > 0 ? true: false;
//             if ($scope.isScenarioShow)
//             {
//                 $scope.scenarioList = response.data;
//             }
//         });
//     };

//     $scope.remove = function(index)
//     {
//         if (void 0 === index || isNaN(parseInt(index, 10))) return false;
//         var id = $scope.scenarioList[index].scenario_id;
//         var name = $scope.scenarioList[index].scenario_name;
//         var params =
//         {
//             type: $routeParams.scenario,
//             id: id,
//         };

//         Scenario.resource.remove(params).$promise.then(function(response)
//         {
//             Utility.info(name+'<br>'+'を削除しました。');
//             $scope.scenarioList.splice(index, 1);
//             $scope.isScenarioShow = $scope.scenarioList.length > 0 ? true: false;
//         });
//     };

// }]);
