/**
 * @ngdoc function
 * @name workspaceApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the workspaceApp
 */
var segmentCtrl = angular.module('segmentCtrl',['SegmentServices']);
segmentCtrl.controller('SegmentCtrl',['$scope', 'Shared', 'Segment', 
function ($scope, Shared, Segment)
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
        $scope.segmentList = Segment.mock().data;

        /* サーバーサイド実装後に開放
        Segment.resource.get().$promise.then(function(response)
        {
            $scope.segmentList = response.data;
        });
        */
    };
    
    $scope.refresh = function()
    {
        
    };
    
    $scope.download = function()
    {
        
    };

}]);
