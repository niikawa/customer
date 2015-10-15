class QueryListController
{
    constructor($scope, Shared, Utility, Location, Modal, Query, Segment)
    {
        this._scope = $scope;
        this._sharedService = Shared;
        this._utilityService = Utility;
        this._modalService = Modal;
        this._locationService = Location;
        this._segmentService = Segment;
        this._queryService = Query;

        this._scope._construct();

        this.queryList = [];
        this._sharedService.setRoot('query list');
        this.querySearch = '';
        this._queryService.resource.getList().$promise.then(response =>
        {
            this.queryList = response.data;
            this.isQueryShow = this.queryList.length > 0;
        });
    }
    
    showSegment(index)
    {
        if (void 0 === this.queryList[index].id) return;
        let target = this.queryList[index];
        let params = {qId: target.id, count: target.useNum};
        this._segmentService.resource.useSegment(params).$promise.then(response =>
        {
            this._scope.modalParam = 
            {
                title: this.queryList[index].query_name+"を利用しているセグメント",
                list: response.data,
                hrefBase: '#/segment/control',
                dynamicParamKey: 'id',
                close: function(id)
                {
                    this._scope.modalInstance.close();
                    this._locationService.segmentControl(id);
                }
            };
            this._scope.modalInstance = this._modalService.open(this._scope, "partials/modal/list.html");
        });
    }
    
    deleteItem(index)
    {
        if (void 0 === this.queryList[index]) return;
        let name = this.queryList[index].query_name;
        this._queryService.resource.remove({id: this.queryList[index].id}).$promise.then(response =>
        {
            this._utilityService.info(name + '<br>を削除しました。');
            this._scope.queryList.splice(index, 1);
        });
    }
    
}
QueryListController.$inject = ['$scope', 'Shared','Utility','Location','Modal', 'Query', 'Segment'];
angular.module('queryListCtrl',['QueryServices']).controller('QueryListCtrl', QueryListController);

// var queryListCtrl = angular.module('queryListCtrl',['QueryServices']);
// queryListCtrl.controller('QueryListCtrl',['$scope', 'Shared', 'Query', 'Segment','Modal','Location', 'Utility',
// function ($scope, Shared, Query, Segment, Modal, Location, Utility)
// {
//     function setInitializeScope()
//     {
//         $scope.queryList = [];
//         Shared.setRoot('query list');
//     }
    
//     $scope.initialize = function()
//     {
//         $scope._construct();
//         setInitializeScope();

//         Query.resource.getList().$promise.then(function(response)
//         {
//             $scope.queryList = response.data;
//             $scope.isQueryShow = $scope.queryList.length > 0;
//         });
//     };
    
//     $scope.showSegment = function(index)
//     {
//         if (void 0 === $scope.queryList[index].id) return;
//         var target = $scope.queryList[index];
//         var params = {qId: target.id, count: target.useNum};
//         Segment.resource.useSegment(params).$promise.then(function(response)
//         {
//             $scope.modalParam = 
//             {
//                 title: $scope.queryList[index].query_name+"を利用しているセグメント",
//                 list: response.data,
//                 hrefBase: '#/segment/control',
//                 dynamicParamKey: 'id',
//                 close: function(id)
//                 {
//                     $scope.modalInstance.close();
//                     Location.segmentControl(id);
//                 }
//             };
//             $scope.modalInstance = Modal.open($scope, "partials/modal/list.html");
            
//         });
//     };
    
//     $scope.deleteItem = function(index)
//     {
//         if (void 0 === $scope.queryList[index]) return;
//         var name = $scope.queryList[index].query_name;
//         Query.resource.remove({id: $scope.queryList[index].id}).$promise.then(function(response)
//         {
//             Utility.info(name + '<br>を削除しました。');
//             $scope.queryList.splice(index,1);
//         });
//     };
// }]);
