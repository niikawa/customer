/**
 * @ngdoc function
 * @name workspaceApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the workspaceApp
 */
var segmentCtrl = angular.module('segmentCtrl',['SegmentServices']);
segmentCtrl.controller('SegmentCtrl',['$scope', 'Shared', 'Segment', 'Utility',
function ($scope, Shared, Segment, Utility)
{
    /**
     * scope初期化用
     */
    function setInitializeScope()
    {
        $scope.segmentList = [];
    }
    
    /**
     * 初期処理
     * @author niikawa
     */
    $scope.initialize = function()
    {
        $scope._construct();
        setInitializeScope();

        Segment.resource.get().$promise.then(function(response)
        {
            $scope.segmentList = response.data;
            $scope.showInfo = $scope.segmentList.length > 0 ? true : false; 
        });
    };
    
    $scope.download = function()
    {
        Utility.info('〔ベータ版では未開放〕<br>セグメントの抽出結果をダウンロードさせるよ');
    };

    $scope.remove = function(index)
    {
        var target = $scope.segmentList[index];
        Segment.resource.remove({id: target.segment_id, segment_document_id: target.segment_document_id}).$promise.then(function()
        {
            Utility.info('削除しました');
            $scope.segmentList.splice(index, 1);
        });
    };
}]);
