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
//        $scope.segmentList = Segment.mock().data;

        Segment.resource.get().$promise.then(function(response)
        {
            console.log(response);
            $scope.segmentList = response.data;
        });
    };
    
    $scope.refresh = function()
    {
        Utility.info('この機能は意味不明だよ');
    };
    
    $scope.download = function()
    {
        Utility.info('セグメントの抽出結果をダウンロードさせるよ');
    };

    $scope.remove = function(index)
    {
        Utility.info('実装中だよ');
    };
}]);
