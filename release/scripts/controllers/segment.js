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
        Shared.setRoot('segment');
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
    
    $scope.download = function(id)
    {
        Segment.download(id);
    };

    $scope.remove = function(index)
    {
        var target = $scope.segmentList[index];
        console.log(target);
        Segment.resource.remove(
            {id: target.segment_id, segment_document_id: target.segment_document_id}).$promise.then(function(response)
        {
            Utility.info('削除しました');
            $scope.segmentList.splice(index, 1);
        });
    };
}]);
