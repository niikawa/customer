'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var DashbordController = (function () {
    function DashbordController($scope, Shared, Utility, Scenario, Modal) {
        _classCallCheck(this, DashbordController);

        this._scope = $scope;
        this._sharedService = Shared;
        this._utilityService = Utility;
        this._scenarioService = Scenario;
        this._modalService = Modal;

        this.scenario = [];
        this.scenarioList = [];
        this.isShowExecutePlanScenario = false;
        this.executePlanScenario = [];
        this._getInitializeData();
    }

    _createClass(DashbordController, [{
        key: 'initialize',
        value: function initialize() {}
    }, {
        key: '_getInitializeData',
        value: function _getInitializeData() {
            var _this = this;

            this._scenarioService.resource.typeCount().$promise.then(function (typeCountResponse) {
                _this.scenarioList = typeCountResponse.data;

                _this._scenarioService.resource.executeplan().$promise.then(function (scenarioResponse) {
                    _this.isShowExecutePlanScenario = scenarioResponse.data.length > 0;
                    _this.executePlanScenario = scenarioResponse.data;
                });
            });
        }
    }, {
        key: 'bulkInvalid',
        value: function bulkInvalid() {
            this._scope.modalParam = {
                title: 'シナリオの一括無効について',
                message: '実行予定のシナリオをすべて無効にしますがよろしいですか？<br>再度有効にする場合はアプローチ管理画面から有効にできます。',
                isExecute: true,
                executeLabel: '一括で無効にする',
                execute: function execute() {
                    this._scenarioService.resource.bulkInvalid().$promise.then(function (response) {
                        this._scope.modalInstance.close();
                        this._utilityService.info('実行予定のシナリオを一括無効しました。');
                        this._scope.initialize();
                    });
                }
            };
            this._scope.modalInstance = this._modalService.open(this._scope, "partials/modal/message.html");
        }
    }]);

    return DashbordController;
})();

DashbordController.$inject = ['$scope', 'Shared', 'Scenario', 'Utility', 'Modal'];
angular.module('dashbordCtrl', ['ScenarioServices']).controller('DashbordCtrl', DashbordController);

// var mainCtrl = angular.module('dashbordCtrl',['ScenarioServices']);
// mainCtrl.controller('DashbordCtrl',['$scope', 'Shared', 'Scenario', 'Utility', 'Modal',
// function ($scope, Shared, Scenario, Utility, Modal)
// {
//     function setInitializeScope()
//     {
//         $scope.scenario = [];
//         $scope.executePlanScenario = [];
//     }

//     function getInitializeData()
//     {
//         Scenario.resource.typeCount().$promise.then(function(response)
//         {
//             $scope.scenarioList = response.data;

//             Scenario.resource.executeplan().$promise.then(function(response)
//             {
//                 $scope.isShowExecutePlanScenario = (response.data.length > 0);
//                 $scope.executePlanScenario = response.data;
//             });
//         });
//     }

//     $scope.initialize = function()
//     {
//         $scope.$emit('requestStart');

//         $scope._construct();
//         setInitializeScope();
//         getInitializeData();
//         Shared.setRoot('dashbord');

//         $scope.$emit('requestEnd');
//     };

//     $scope.bulkInvalid = function()
//     {
//         $scope.modalParam =
//         {
//             title: 'シナリオの一括無効について',
//             message: '実行予定のシナリオをすべて無効にしますがよろしいですか？<br>再度有効にする場合はアプローチ管理画面から有効にできます。',
//             isExecute: true,
//             executeLabel: '一括で無効にする',
//             execute: function()
//             {
//                 Scenario.resource.bulkInvalid().$promise.then(function(response)
//                 {
//                     $scope.modalInstance.close();
//                     Utility.info('実行予定のシナリオを一括無効しました。');
//                     $scope.initialize();
//                 });
//             }
//         };
//         $scope.modalInstance = Modal.open($scope, "partials/modal/message.html");
//     };

// }]);
