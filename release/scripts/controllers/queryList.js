'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var QueryListController = (function () {
    function QueryListController($scope, Shared, Utility, Location, Modal, Query, Segment) {
        var _this = this;

        _classCallCheck(this, QueryListController);

        this._scope = $scope;
        this._sharedService = Shared;
        this._utilityService = Utility;
        this._modalService = Modal;
        this._locationService = Location;
        this._segmentService = Segment;
        this._queryService = Query;

        this._scope._construct();

        this.queryList = [];
        this._sharedService.setRoot('query list');
        this.querySearch = '';
        this._queryService.resource.getList().$promise.then(function (response) {
            _this.queryList = response.data;
            _this.isQueryShow = _this.queryList.length > 0;
        });
    }

    _createClass(QueryListController, [{
        key: 'showSegment',
        value: function showSegment(index) {
            var _this2 = this;

            if (void 0 === this.queryList[index].id) return;
            var target = this.queryList[index];
            var params = { qId: target.id, count: target.useNum };
            this._segmentService.resource.useSegment(params).$promise.then(function (response) {
                _this2._scope.modalParam = {
                    title: _this2.queryList[index].query_name + "を利用しているセグメント",
                    list: response.data,
                    hrefBase: '#/segment/control',
                    dynamicParamKey: 'id',
                    close: function close(id) {
                        this._scope.modalInstance.close();
                        this._locationService.segmentControl(id);
                    }
                };
                _this2._scope.modalInstance = _this2._modalService.open(_this2._scope, "partials/modal/list.html");
            });
        }
    }, {
        key: 'deleteItem',
        value: function deleteItem(index) {
            var _this3 = this;

            if (void 0 === this.queryList[index]) return;
            var name = this.queryList[index].query_name;
            this._queryService.resource.remove({ id: this.queryList[index].id }).$promise.then(function (response) {
                _this3._utilityService.info(name + '<br>を削除しました。');
                _this3._scope.queryList.splice(index, 1);
            });
        }
    }]);

    return QueryListController;
})();

QueryListController.$inject = ['$scope', 'Shared', 'Utility', 'Location', 'Modal', 'Query', 'Segment'];
angular.module('queryListCtrl', ['QueryServices']).controller('QueryListCtrl', QueryListController);

// var queryListCtrl = angular.module('queryListCtrl',['QueryServices']);
// queryListCtrl.controller('QueryListCtrl',['$scope', 'Shared', 'Query', 'Segment','Modal','Location', 'Utility',
// function ($scope, Shared, Query, Segment, Modal, Location, Utility)
// {
//     function setInitializeScope()
//     {
//         $scope.queryList = [];
//         Shared.setRoot('query list');
//     }

//     $scope.initialize = function()
//     {
//         $scope._construct();
//         setInitializeScope();

//         Query.resource.getList().$promise.then(function(response)
//         {
//             $scope.queryList = response.data;
//             $scope.isQueryShow = $scope.queryList.length > 0;
//         });
//     };

//     $scope.showSegment = function(index)
//     {
//         if (void 0 === $scope.queryList[index].id) return;
//         var target = $scope.queryList[index];
//         var params = {qId: target.id, count: target.useNum};
//         Segment.resource.useSegment(params).$promise.then(function(response)
//         {
//             $scope.modalParam =
//             {
//                 title: $scope.queryList[index].query_name+"を利用しているセグメント",
//                 list: response.data,
//                 hrefBase: '#/segment/control',
//                 dynamicParamKey: 'id',
//                 close: function(id)
//                 {
//                     $scope.modalInstance.close();
//                     Location.segmentControl(id);
//                 }
//             };
//             $scope.modalInstance = Modal.open($scope, "partials/modal/list.html");

//         });
//     };

//     $scope.deleteItem = function(index)
//     {
//         if (void 0 === $scope.queryList[index]) return;
//         var name = $scope.queryList[index].query_name;
//         Query.resource.remove({id: $scope.queryList[index].id}).$promise.then(function(response)
//         {
//             Utility.info(name + '<br>を削除しました。');
//             $scope.queryList.splice(index,1);
//         });
//     };
// }]);
