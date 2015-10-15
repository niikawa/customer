class QueryController
{
    constructor($scope, $routeParams, Shared, Utility, Location, Query)
    {
        this._scope = $scope;
        this._routeParams = $routeParams;
        this._sharedService = Shared;
        this._utilityService = Utility;
        this._locationService = Location;
        this._queryService = Query;
        this._selectTable = '';
        this.tableSearch = '';

        this._scope._construct();

        let isEdit = this._routeParams.hasOwnProperty('id');
        this._setInitializeScope(isEdit);
        
        if (isEdit)
        {
            let paramId = this._routeParams.id;
            this._queryService.resource.getControlInit({id: paramId}).$promise.then(response =>
            {
                this.queryName = response.data.query_name;
                this.tableList = response.table;
                this.tableListRef = response.getRefTabels(response.table);
                if (0 === this.selectColumns.length)
                {
                    this._setEdtInitializeScope(response.data);
                }
                this.isShowEditMessage = true;
                this._sharedService.set('updateQueryDocumentId', paramId);
                this._sharedService.set('updateQueryName', response.data.query_name);
            });
        }
        else
        {
            this._queryService.resource.get().$promise.then(response =>
            {
                this.tableList = response.table;
                this.tableListRef = this._queryService.getRefTabels(response.table);
            });
        }
    }
    
    _setInitializeScope(isEdit)
    {
        this._sharedService.destloyByName('queryName');
        this._sharedService.destloyByName('updateQueryDocumentId');
        this.tableList = [];
        this.tableListRef = [];
        this.columnNum = 0;
        this.selectColumns = [];
        if (!isEdit)
        {
            this.selectColumns = this._sharedService.get('queryColumns') || [];
        }
        this.showSelectedColumnsBox = this.selectColumns.length > 0;
        this.conditions = [];
        this.isShowEditMessage = false;
        this.returnUrl = this._queryService.getReturnURL();
        this._sharedService.setRoot('query');
    }
    
    _setEdtInitializeScope(data)
    {
        angular.forEach(data.tables, function(columnList, tableName)
        {
            angular.forEach(columnList, function(columnInfo)
            {
                angular.forEach(this.tableList[tableName].column, function(columnData)
                {
                    if (columnInfo.column === columnData.physicalname)
                    {
                        this.selectColumns.push(
                        {
                            table: {logicalname: this.tableList[tableName].logicalname, physicalname:  this.tableList[tableName].physicalname}, 
                            column: columnData,
                            selectedCondition: {name: '', value: columnInfo.conditionType, symbol: ''},
                            condition: columnInfo.values
                        });
                        
                        return false;
                    }
                });
            });
        });
        this.showSelectedColumnsBox = this.selectColumns.length > 0;
        this._sharedService.set('queryColumns', this.selectColumns);
    }

    showColumns(table)
    {
        this._selectTable = table;
        this.columnList = this.tableList[table].column;
        this.columnNum = this.columnList.length;
    }
    
    setColumn(index)
    {
        let target = this.tableList[this._selectTable];
        let isSame = false;
        for (let item of this.selectColumns)
        {
            console.log("for of");
            if (item.table.physicalname === this._selectTable && item.column.physicalname === target.column[index].physicalname)
            {
                isSame = true;
            }
        }
        // angular.forEach(this.selectColumns, function(v, k)
        // {
        //     if (v.table.physicalname === this._selectTable && v.column.physicalname === target.column[index].physicalname)
        //     {
        //         isSame = true;
        //     }
        // });
        if (!isSame)
        {
            this.selectColumns.push(
            {
                table: {logicalname: target.logicalname, physicalname:  target.physicalname}, 
                column: target.column[index]
            });
        }
        this.showSelectedColumnsBox = true;
        this._sharedService.set('queryColumns', this.selectColumns);
    };
    
    removeColumn(index)
    {
        this.selectColumns.splice(index, 1);
        this.showSelectedColumnsBox = (this.selectColumns.length > 0);
        this._sharedService.set('queryColumns', this.selectColumns);
    };
}
QueryController.$inject = ['$scope', '$routeParams', 'Shared', 'Utility', 'Location', 'Query'];
angular.module('queryCtrl',['QueryServices']).controller('QueryCtrl', QueryController);
