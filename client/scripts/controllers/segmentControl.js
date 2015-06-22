var segmentControlCtrl = angular.module('segmentControlCtrl',['SegmentServices', 'QueryServices']);
segmentControlCtrl.controller('SegmentControlCtrl',['$scope', '$routeParams', 'Modal','Shared', 'Segment', 'Query', 'Utility',
function ($scope, $routeParams, Modal, Shared, Segment, Query, Utility)
{
    /**
     * scope初期化用
     */
    function setInitializeScope()
    {
        $scope.pageTitle = Segment.pageProp($routeParams.id).pageTitle;

        $scope.segmenData = {};
        $scope.queryList = [];
        $scope.conditions = [];
        $scope.segmentSearch = '';
        $scope.segment = {segment_name: ''};
    }
    
    function setEvntListeners()
    {
        $scope.$on('dropItemComplete', function(event, data)
        {
            event.stopPropagation();
        });
    }

    /**
     * 初期処理
     * @author niikawa
     */
    $scope.initialize = function()
    {
        $scope._construct();
        setInitializeScope();
        setEvntListeners();
        Shared.destloyByName('queryColumns');
        
        Query.resource.getQuery().$promise.then(function(response)
        {
            $scope.queryList = response.data;
            Segment.setWhereProp($scope.queryList);
        });
        
        if (2 === Segment.pageProp($routeParams.id).pageTitle)
        {
            /* サーバーサイド実装後に開放
            Segment.resource.get(id: ).$promise.then(function(response)
            {
                $scope.segmentList = response.data;
            });
            */
        }
    };
    
    $scope.removeItem = function(index)
    {
        $scope.queryList.push($scope.conditions[index]);
        $scope.conditions.splice(index,1);
    };
    
    $scope.save = function()
    {
        var sql = Segment.createSQL($scope.conditions);
        var data =  {segment_name: $scope.segment.segment_name, sql: sql};
        
        Segment.resource.create({data: data}).$promise.then(function(response)
        {
            Utility.info('セグメントを作成しました');
            console.log(response);
        });
    };

}]);
