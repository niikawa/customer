class QuerySaveController
{
    constructor($scope, Shared, Utility, Location, Query)
    {
        this._scope = $scope;
        this._sharedService = Shared;
        this._utilityService = Utility;
        this._locationService = Location;
        this._queryService = Query;
        
        this._sharedService.setRoot('query save');
        this._setEventListeners();
        this._editSetInitializeScope();
        this.query = {query_name: this._sharedService.get('updateQueryName')};
        this.conditions = [];
        
        let selectColumns = this._sharedService.get('queryColumns');
        if (void 0 === selectColumns) Location.query();
        
        this.docIdUrl = '';
        var docId = this._sharedService.get('updateQueryDocumentId');
        if (void 0 !== docId)
        {
            this.docIdUrl = '/control/'+docId;
            this.isShowEditMessage = true;
            this.queryName = this._sharedService.get('updateQueryName');
        }
        
        this.selectColumns = [];
        this._queryService.createCondtionString(selectColumns);
        this.showConditions = [];
        angular.forEach(selectColumns, function(v, k)
        {
            var array = [];
            array.push(v);
            array.isJoin = false;
            this.showConditions.push(array);
        });
    }
    _setEventListeners()
    {
        this._scope.$on('dropItemComplete', function(event, data)
        {
            event.stopPropagation();
            angular.forEach(this.showConditions, function(v, k)
            {
                console.log(v.length);
                if (1 === v.length) v.isJoin = false;
            });
        });
    }
    
    isJoin(items)
    {
        return items.isJoin;
    };

    release(pIndex, cIndex)
    {
        let target = [];
        target.push(this.showConditions[pIndex][cIndex]);
        
        console.log('削除前：' + this.showConditions.length);
        
        this.showConditions[pIndex].splice(cIndex, 1);
        
        console.log('削除後：' + this.showConditions.length);
        console.log(this.showConditions);

        if (1 === this.showConditions[pIndex].length) this.showConditions[pIndex].isJoin = false;
        this.showConditions.push(pIndex, 0, target);
        console.log('ぷっしゅ後：' +this.showConditions.length);

        console.log(this.showConditions);
    };

    save()
    {
        let queryColumns = this._sharedService.get('queryColumns');
        let tables = this._queryService.getTables(queryColumns);

        let parameters = 
        {
            query_document_id: this._sharedService.get('updateQueryDocumentId'),
            query_name: this.query.query_name, 
            conditionList: this.showConditions, 
            tables: tables
        };
        this._queryService.resource.create(parameters).$promise.then(response =>
        {
            this._sharedService.destloyByName('queryColumns');
            this._sharedService.destloyByName('updateQueryName');
            this._sharedService.destloyByName('updateQueryDocumentId');
            this._utilityService.info('クエリを保存しました');
            this._locationService.query();
        });
    };
    
    execute()
    {
        let data = this._sharedService.get('queryColumns');
        let tables = this._queryService.getTables(data);
        let parameters = {tables: tables, conditionList: this.showConditions};
        this._queryService.resource.executeQuery(parameters).$promise.then(response =>
        {
            this._utilityService.info('該当データは' + response.result + '件あります');
        });
    };
    
    
}
QuerySaveController.$inject = ['$scope', 'Shared', 'Utility', 'Location', 'Query'];
angular.module('querySaveCtrl',['QueryServices']).controller('QuerySaveCtrl', QuerySaveController);