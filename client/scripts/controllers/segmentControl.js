var segmentControlCtrl = angular.module('segmentControlCtrl',['SegmentServices']);
segmentControlCtrl.controller('SegmentControlCtrl',['$scope', '$routeParams', 'Modal','Shared', 'Segment', 
function ($scope, $routeParams, Modal, Shared, Segment)
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
//            $scope.queryList = data.from;
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
        
        $scope.queryList = Segment.mock().queryData;
        
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
