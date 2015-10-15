class SegmentController
{
    constructor($scope, Shared, Utility, Segment)
    {
        console.log("SegmentController constructor");
        this._scope = $scope;
        this._sharedService = Shared;
        this._utilityService = Utility;
        this._segmentService = Segment;
        
        this._scope._construct();
        this._sharedService.setRoot('segment');
        this.segmentList = [];
        this.segmentSearch = '';
        
        this._segmentService.resource.get().$promise.then(response =>
        {
            this.segmentList = response.data;
            this.showInfo = this.segmentList.length > 0 ? true : false; 
        });
    }
    
    download(id)
    {
        this._segmentService.download(id);
    };
    
    remove(index)
    {
        var target = this.segmentList[index];
        this._segmentService.resource.remove(
            {id: target.segment_id, segment_document_id: target.segment_document_id}).$promise.then(response =>
        {
            this._utilityService.info('削除しました');
            this.segmentList.splice(index, 1);
        });
    };
}
SegmentController.$inject = ['$scope', 'Shared', 'Utility', 'Segment'];
angular.module('segmentCtrl',['SegmentServices']).controller('SegmentCtrl', SegmentController);

//
// ↓↓↓↓↓↓↓ anguler + ES5 ↓↓↓↓↓
//
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
