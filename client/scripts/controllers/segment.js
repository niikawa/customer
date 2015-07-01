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
        Utility.info('実装中だよ');
        var target = $scope.segmentList[index];
        console.log(target);
        // Segment.resource.remove().$promise.then(function()
        // {
            
        // });
    };
}]);
