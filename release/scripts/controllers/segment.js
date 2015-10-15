'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var SegmentController = (function () {
    function SegmentController($scope, Shared, Utility, Segment) {
        var _this = this;

        _classCallCheck(this, SegmentController);

        console.log("SegmentController constructor");
        this._scope = $scope;
        this._sharedService = Shared;
        this._utilityService = Utility;
        this._segmentService = Segment;

        $scope._construct();
        this._sharedService.setRoot('segment');
        this.segmentList = [];

        this._segmentService.resource.get().$promise.then(function (response) {
            _this.segmentList = response.data;
            _this.showInfo = _this.segmentList.length > 0 ? true : false;
        });
    }

    _createClass(SegmentController, [{
        key: 'download',
        value: function download(id) {
            this._segmentService.download(id);
        }
    }, {
        key: 'remove',
        value: function remove(index) {
            var _this2 = this;

            var target = this.segmentList[index];
            this._segmentService.resource.remove({ id: target.segment_id, segment_document_id: target.segment_document_id }).$promise.then(function (response) {
                _this2._utilityService.info('削除しました');
                _this2.segmentList.splice(index, 1);
            });
        }
    }]);

    return SegmentController;
})();

SegmentController.$inject = ['$scope', 'Shared', 'Utility', 'Segment'];
angular.module('segmentCtrl', ['SegmentServices']).controller('SegmentCtrl', SegmentController);

/**
 * @ngdoc function
 * @name workspaceApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the workspaceApp
 */
// var segmentCtrl = angular.module('segmentCtrl',['SegmentServices']);
// segmentCtrl.controller('SegmentCtrl',['$scope', 'Shared', 'Segment', 'Utility',
// function ($scope, Shared, Segment, Utility)
// {
//     /**
//      * scope初期化用
//      */
//     function setInitializeScope()
//     {
//         Shared.setRoot('segment');
//         $scope.segmentList = [];
//     }

//     /**
//      * 初期処理
//      * @author niikawa
//      */
//     $scope.initialize = function()
//     {
//         $scope._construct();
//         setInitializeScope();

//         Segment.resource.get().$promise.then(function(response)
//         {
//             $scope.segmentList = response.data;
//             $scope.showInfo = $scope.segmentList.length > 0 ? true : false;
//         });
//     };

//     $scope.download = function(id)
//     {
//         Segment.download(id);
//     };

//     $scope.remove = function(index)
//     {
//         var target = $scope.segmentList[index];
//         console.log(target);
//         Segment.resource.remove(
//             {id: target.segment_id, segment_document_id: target.segment_document_id}).$promise.then(function(response)
//         {
//             Utility.info('削除しました');
//             $scope.segmentList.splice(index, 1);
//         });
//     };
// }]);
