class QuerySetController
{
    constructor($scope, Shared, Location, Query)
    {
        this._scope = $scope;
        this._sharedService = Shared;
        this._locationService = Location;
        this._queryService = Query;
        
        this._sharedService.setRoot('query set');
        this.selectColumns = this._sharedService.get('queryColumns');
        if (void 0 === this.selectColumns) this._locationService.query();

        this.docIdUrl = '';
        let docId = this._sharedService.get('updateQueryDocumentId');
        if (void 0 !== docId)
        {
            this.docIdUrl = '/control/'+docId;
            this.isShowEditMessage = true;
            this.queryName = this._sharedService.get('updateQueryName');
        }
    }
    removeItem(index)
    {
        this.selectColumns.splice(index, 1);
        if (0 === this.selectColumns.length) this._locationService.query();
    };
    
    next()
    {
        let isNext = false;
        angular.forEach(this.selectColumns, function(item)
        {
            if (item.error)
            {
                return false;
            }
            else
            {
                isNext = true;
            }
        });
        if (isNext) this._locationService.querySave();
    };
}
QuerySetController.$inject = ['$scope', 'Shared','Location', 'Query'];
angular.module('querySetCtrl',['QueryServices']).controller('QuerySetCtrl', QuerySetController);