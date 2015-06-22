var segmentControlCtrl = angular.module('segmentControlCtrl',['SegmentServices', 'QueryServices']);
segmentControlCtrl.controller('SegmentControlCtrl',['$scope', '$routeParams', 'Modal','Shared', 'Segment', 'Query',
function ($scope, $routeParams, Modal, Shared, Segment, Query)
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
    }
    
    function setEvntListeners()
    {
        $scope.$on('dropItemComplete', function(event, data)
        {
            $scope.$$phase || $scope.$apply();

            event.stopPropagation();
        });
    }
    
    function createQuery()
    {
        
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
    
    $scope.showQueryModal = function()
    {
        $scope.modalParam = 
        {
            mailaddress:'',
            execute: createQuery,
        };
        $scope.modalInstance = Modal.open($scope, "partials/queryView.html");
    };
    
    
    $scope.createOrUpdate = function()
    {
        
        
    };

}]);
