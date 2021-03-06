var segmentControlCtrl = angular.module('segmentControlCtrl',['SegmentServices', 'QueryServices']);
segmentControlCtrl.controller('SegmentControlCtrl',['$scope', '$routeParams', 'Modal','Shared', 'Segment', 'Query', 'Utility','Location',
function ($scope, $routeParams, Modal, Shared, Segment, Query, Utility, Location)
{
    function setInitializeScope()
    {
        $scope.pageTitle = Segment.pageProp($routeParams.id).pageTitle;
        $scope.viewMode = Segment.pageProp($routeParams.id).viewMode;

        $scope.segmenData = {};
        $scope.queryList = [];
        $scope.conditions = [];
        $scope.segmentSearch = '';
        $scope.segment = {};
        $scope.isExecte = false;
    }
    
    $scope.initialize = function()
    {
        $scope._construct();
        setInitializeScope();
        // setEvntListeners();
        Shared.setRoot('segment control');
        
        Query.resource.getQuery().$promise.then(function(doc)
        {
            if (2 === Segment.pageProp($routeParams.id).viewMode)
            {
                Segment.resource.get({id: $routeParams.id}).$promise.then(function(response)
                {
                    $scope.segment.segment_id = $routeParams.id;
                    $scope.segment.segment_name = response.segment_name;
                    $scope.segment.segment_document_id = response.segment_document_id;
                    Segment.setListData(doc.data, response.qIds, $scope.conditions);
                    $scope.queryList = doc.data;
                    Segment.setWhereProp($scope.queryList);
                    Segment.setWhereProp($scope.conditions, response.whereList);
                    $scope.isExecte = true;
                });
            }
            else
            {
                $scope.queryList = doc.data;
                Segment.setWhereProp($scope.queryList);
            }
        });
    };
    
    $scope.moveQuery = function(index)
    {
        $scope.conditions.push($scope.queryList[index]);
        $scope.queryList.splice(index,1);
        $scope.isExecte = true;
    };
    
    $scope.removeItem = function(index)
    {
        $scope.queryList.push($scope.conditions[index]);
        $scope.conditions.splice(index,1);
        if (0 === $scope.conditions.length) $scope.isExecte = false;
    };
    
    $scope.save = function()
    {
        var data = Segment.createExecuteInfo($scope.conditions);
        Segment.resource.executeQuery(data).$promise.then(function(response, err)
        {
            var doc = Segment.createDocData($scope.conditions);
            var docdata = {
                segment_name: $scope.segment.segment_name, 
                segment_document_id: $scope.segment.segment_document_id,
                whereList: doc.whereList, 
                qIds: doc.qIds
            };
            
            Segment.resource.saveDoc({data: docdata}).$promise.then(function(response)
            {
                var data = {
                    segment_id: $scope.segment.segment_id, 
                    segment_name: response.data.segment_name, 
                    segment_document_id:response.data.id
                };
                Segment.resource.save({data: data}).$promise.then(function(response)
                {
                    Utility.info('セグメントを保存しました');
                    Location.segment();
                });
            });
        });
    };

    $scope.execute = function()
    {
        var data = Segment.createExecuteInfo($scope.conditions);
        Segment.resource.executeQuery(data).$promise.then(function(response, err)
        {
            Utility.info('該当データは' + response.result + '件あります');
        });
    };
}]);
