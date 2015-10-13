//
//アプローチコントローラークラス
//
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var ApproachController = (function () {
    function ApproachController($scope, Shared, Utility, Approach, Scenario, Modal) {
        _classCallCheck(this, ApproachController);

        this._scope = $scope;
        this._sharedService = Shared;
        this._utilityService = Utility;
        this._approachService = Approach;
        this._scenarioService = Scenario;
        this._modalService = Modal;

        this._scope._construct();
        this._sharedService.setRoot('approach');
        this._clear();
    }

    _createClass(ApproachController, [{
        key: 'initialize',
        value: function initialize() {
            this._clear();
            this._getInitializeData();
        }
    }, {
        key: '_clear',
        value: function _clear() {
            this.approach = [];
            this.scenarioList = [];
            this.showScenarioList = false;
        }
    }, {
        key: '_getInitializeData',
        value: function _getInitializeData() {
            var _this = this;

            this._approach.resource.get().$promise.then(function (approachResponse) {
                _this.approach = approachResponse.data;

                _this._approachService.resource.valid().$promise.then(function (scenarioResponse) {
                    _this.scenarioList = scenarioResponse.data;
                    _this.showScenarioList = 0 < _this._scope.scenarioList.length;
                });
            });
        }
    }, {
        key: '_setEventListeners',
        value: function _setEventListeners() {
            this._scope.$on('dropItemComplete', function (event, data) {
                this.scenarioList = data.to;
                this._scope.$apply();
            });
        }
    }, {
        key: 'save',
        value: function save() {
            var _this2 = this;

            this._approachService.resource.save(this.approach).$promise.then(function (response) {
                _this2._utilityService.info('設定を更新しました');
            });
        }
    }, {
        key: 'savePriority',
        value: function savePriority() {
            var _this3 = this;

            this._scenarioService.resource.priority({ data: this.scenarioList }).$promise.then(function (response) {
                _this3._utilityService.info('優先順位を更新しました');
            });
        }
    }, {
        key: 'showDiscription',
        value: function showDiscription(id) {
            var info = this._approachService.getInfomation(id);

            this._scope.modalParam = {
                title: info.title,
                message: info.message,
                isExecute: false
            };
            this._scope.modalInstance = this._modalService.open(this._scope, "partials/modal/message.html");
        }
    }, {
        key: 'bulkInvalid',
        value: function bulkInvalid() {
            var params = {
                title: 'シナリオの一括無効について',
                text: '有効なシナリオをすべて無効にしますがよろしいですか？<br>実行した場合、実行予定シナリオはなくなります。',
                confirmButtonText: '一括で無効にする',
                execute: function execute() {
                    var _this4 = this;

                    this._scenarioService.resource.bulkInvalid().$promise.then(function (response) {
                        _this4._utilityService.info('アプローチ対象シナリオをすべて無効しました。');
                        _this4.initialize();
                    });
                }
            };
            this._utilityService.infoAlert(params);
        }
    }, {
        key: 'bulkEnable',
        value: function bulkEnable() {
            var params = {
                title: 'シナリオの一括有効について',
                text: '無効なシナリオをすべて有効にしますがよろしいですか？<br>実行した場合、実行予定シナリオとしてダッシュボード画面に表示されます。',
                isExecute: true,
                confirmButtonText: '一括で有効にする',
                execute: function execute() {
                    var _this5 = this;

                    this._scenarioService.resource.bulkEnable().$promise.then(function (response) {
                        _this5._utilityService.info('アプローチ対象シナリオをすべて有効しました。');
                        _this5.initialize();
                    });
                }
            };
            this._utilityService.infoAlert(params);
        }
    }]);

    return ApproachController;
})();

ApproachController.$inject = ['$scope', 'Shared', 'Utility', 'Approach', 'Scenario', 'Modal'];
angular.module('approachCtrl', ['ApproachServices', 'ScenarioServices']).controller('ApproachCtrl', ApproachController);
//approachCtrl.controller('ApproachCtrl',['$scope', '$routeParams','Shared', 'Utility', 'Approach', 'Scenario', 'Modal',
// function ($scope, $routeParams, Shared, Utility, Approach, Scenario, Modal)
// {
//     function setInitializeScope()
//     {
//         $scope.approach = [];
//         $scope.scenarioList = [];
//         $scope.showScenarioList = false;
//     }

//     function getInitializeData()
//     {
//         Approach.resource.get().$promise.then(function(approachResponse)
//         {
//             $scope.approach = approachResponse.data;

//             Scenario.resource.valid().$promise.then(function(scenarioResponse)
//             {
//                 $scope.scenarioList = scenarioResponse.data;
//                 $scope.showScenarioList = (0 < $scope.scenarioList.length);
//             });
//         });
//     }

//     function setEventListeners()
//     {
//         $scope.$on('dropItemComplete', function(event, data)
//         {
//             $scope.scenarioList = data.to;
//             $scope.$apply();
//         });
//     }

//     $scope.initialize = function()
//     {
//         $scope._construct();
//         setInitializeScope();
//         getInitializeData();
//         setEventListeners();
//         Shared.setRoot('approach');
//     };

//     $scope.save = function()
//     {
//         console.log($scope.approach);
//         Approach.resource.save($scope.approach).$promise.then(function(response)
//         {
//             Utility.info('設定を更新しました');
//         });
//     };

//     $scope.savePriority = function()
//     {
//         console.log($scope.scenarioList);
//         Scenario.resource.priority({data: $scope.scenarioList}).$promise.then(function(response)
//         {
//             Utility.info('優先順位を更新しました');
//         });
//     };

//     $scope.showDiscription = function(id)
//     {
//         var info = Approach.getInfomation(id);

//         $scope.modalParam =
//         {
//             title: info.title,
//             message: info.message,
//             isExecute: false,
//         };
//         $scope.modalInstance = Modal.open($scope, "partials/modal/message.html");
//     };

//     $scope.bulkInvalid = function()
//     {
//         var params =
//         {
//             title: 'シナリオの一括無効について',
//             text: '有効なシナリオをすべて無効にしますがよろしいですか？<br>実行した場合、実行予定シナリオはなくなります。',
//             confirmButtonText: '一括で無効にする',
//             execute: function()
//             {
//                 Scenario.resource.bulkInvalid().$promise.then(function(response)
//                 {
//                     Utility.info('アプローチ対象シナリオをすべて無効しました。');
//                     $scope.initialize();
//                 });
//             }
//         };
//         Utility.infoAlert(params);
//     };

//     $scope.bulkEnable = function()
//     {
//         var params =
//         {
//             title: 'シナリオの一括有効について',
//             text: '無効なシナリオをすべて有効にしますがよろしいですか？<br>実行した場合、実行予定シナリオとしてダッシュボード画面に表示されます。',
//             isExecute: true,
//             confirmButtonText: '一括で有効にする',
//             execute: function()
//             {
//                 Scenario.resource.bulkEnable().$promise.then(function(response)
//                 {
//                     Utility.info('アプローチ対象シナリオをすべて有効しました。');
//                     $scope.initialize();
//                 });
//             }
//         };
//         Utility.infoAlert(params);
//     };

// }]);
