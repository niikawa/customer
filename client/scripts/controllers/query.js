var queryListCtrl = angular.module('queryListCtrl',['QueryServices']);
queryListCtrl.controller('QueryListCtrl',['$scope', 'Shared', 'Query', 'Modal','Location', 'Utility',
function ($scope, Shared, Query, Modal, Location, Utility)
{
    function setInitializeScope()
    {
        $scope.queryList = [];
    }
    
    $scope.initialize = function()
    {
        $scope._construct();
        setInitializeScope();

        Query.resource.getList().$promise.then(function(response)
        {
            $scope.queryList = response.data;
            $scope.isQueryShow = $scope.queryList.length > 0;
        });
    };
    
    $scope.showSegment = function(index)
    {
        if (void 0 === $scope.queryList[index].id) return;
        
        $scope.modalParam = 
        {
            title: $scope.queryList[index].query_name+"を利用しているセグメント",
            list: $scope.queryList[index].useSegment,
            hrefBase: '#/segment/control',
            dynamicParamKey: 'id',
            close: function(id)
            {
                $scope.modalInstance.close();
                Location.segmentControl(id);
            }
        };
        $scope.modalInstance = Modal.open($scope, "partials/modal/list.html");
    };
    
    $scope.deleteItem = function(index)
    {
        if (void 0 === $scope.queryList[index]) return;
        var name = $scope.queryList[index].query_name;
        Query.resource.remove({id: $scope.queryList[index].id}).$promise.then(function(response)
        {
            Utility.info(name + '<br>を削除しました。');
            $scope.queryList.splice(index,1);
        });
    };
}]);

var queryCtrl = angular.module('queryCtrl',['QueryServices']);
queryCtrl.controller('QueryCtrl',['$scope', '$routeParams', 'Shared', 'Query', 'Location', 'Utility',
function ($scope, $routeParams, Shared, Query, Location, Utility)
{
    var selectTable = '';
    
    function setInitializeScope()
    {
        $scope.tableList = [];
        $scope.columnNum = 0;
        $scope.selectColumns = Shared.get('queryColumns') || [];
        $scope.showSelectedColumnsBox = $scope.selectColumns.length > 0;
        $scope.conditions = [];
        $scope.isShowEditMessage = false;
        Shared.destloyByName('queryName');
        Shared.destloyByName('updateQueryDocumentId');
    }
    
    function setEdtInitializeScope(data)
    {
        angular.forEach(data.tables, function(columnList, tableName)
        {
            angular.forEach(columnList, function(columnInfo)
            {
                angular.forEach($scope.tableList[tableName].column, function(columnData)
                {
                    if (columnInfo.column === columnData.physicalname)
                    {
                        $scope.selectColumns.push(
                        {
                            table: {logicalname: $scope.tableList[tableName].logicalname, physicalname:  $scope.tableList[tableName].physicalname}, 
                            column: columnData,
                            selectedCondition: {name: '', value: columnInfo.conditionType, symbol: ''},
                            condition: columnInfo.values
                        });
                        
                        return false;
                    }
                });
            });
        });
        $scope.showSelectedColumnsBox = $scope.selectColumns.length > 0;

        Shared.set('queryColumns', $scope.selectColumns);
    }
    
    $scope.initialize = function()
    {
        $scope._construct();
        setInitializeScope();
        
        if ($routeParams.hasOwnProperty('id'))
        {
            Query.resource.getControlInit({id: $routeParams.id}).$promise.then(function(response)
            {
                $scope.queryName = response.data.query_name;
                $scope.tableList = response.table;
                if (0 === $scope.selectColumns.length)
                {
                    setEdtInitializeScope(response.data);
                }
                $scope.isShowEditMessage = true;
                Shared.set('updateQueryDocumentId', $routeParams.id);
                Shared.set('updateQueryName', response.data.query_name);
            });
        }
        else
        {
            Query.resource.get().$promise.then(function(response)
            {
                $scope.tableList = response.table;
            });
        }
    };
    
    $scope.showColumns = function(table)
    {
        selectTable = table;
        $scope.columnList = $scope.tableList[table].column;
        $scope.columnNum = $scope.columnList.length;
    };
    
    $scope.setColumn = function(index)
    {
        var target = $scope.tableList[selectTable];
        var isSame = false;
        angular.forEach($scope.selectColumns, function(v, k)
        {
            if (v.table.physicalname === selectTable && v.column.physicalname === target.column[index].physicalname)
            {
                isSame = true;
            }
        });
        if (!isSame)
        {
            $scope.selectColumns.push(
            {
                table: {logicalname: target.logicalname, physicalname:  target.physicalname}, 
                column: target.column[index]
            });
        }
        $scope.showSelectedColumnsBox = true;
        Shared.set('queryColumns', $scope.selectColumns);
    };
    
    $scope.removeColumn = function(index)
    {
        $scope.selectColumns.splice(index, 1);
        $scope.showSelectedColumnsBox = ($scope.selectColumns.length > 0);
        Shared.set('queryColumns', $scope.selectColumns);
    };
    
    /****************************************/
    /*                  set                 */
    /****************************************/
    function editSetInitializeScope()
    {
        $scope.docIdUrl = '';
        var docId = Shared.get('updateQueryDocumentId');
        if (void 0 !== docId)
        {
            $scope.docIdUrl = '/'+docId;
            $scope.isShowEditMessage = true;
            $scope.queryName = Shared.get('updateQueryName');
        }
    }
    
    $scope.nextValidation = function()
    {
        $scope.selectColumns = Shared.get('queryColumns');
        if (void 0 === $scope.selectColumns) Location.query();

        angular.forEach($scope.selectColumns, function(v, k)
        {
            v.column.inputType = Query.getContentsByColumsType(v.column.type);
        });
        
        editSetInitializeScope();
    };
    
    $scope.removeItem = function(index)
    {
        $scope.selectColumns.splice(index, 1);
        if (0 === $scope.selectColumns.length) Location.query();
    };
    
    $scope.next = function()
    {
        var isNext = false;
        angular.forEach($scope.selectColumns, function(item)
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
        if (isNext) Location.querySave();
    };
    
    /*****************************************/
    /*                  save                 */
    /*****************************************/
    function setEventListeners()
    {
        $scope.$on('dropItemComplete', function(event, data)
        {
            event.stopPropagation();
            angular.forEach($scope.showConditions, function(v, k)
            {
                console.log(v.length);
                if (1 === v.length) v.isJoin = false;
            });
        });
    }

    $scope.saveInitialize = function()
    {
        setEventListeners();
        editSetInitializeScope();
        $scope.query = {query_name: Shared.get('updateQueryName')};
        $scope.conditions = [];
        var selectColumns = Shared.get('queryColumns');

        if (void 0 === selectColumns)
        {
            Location.query();
        }
        $scope.selectColumns = [];
        Query.createCondtionString(selectColumns);
        $scope.showConditions = [];
        angular.forEach(selectColumns, function(v, k)
        {
            var array = [];
            array.push(v);
            array.isJoin = false;
            $scope.showConditions.push(array);
        });
    };
    
    $scope.isJoin = function(items)
    {
        return items.isJoin;
    };

    $scope.release = function(pIndex, cIndex)
    {
        var target = [];
        target.push($scope.showConditions[pIndex][cIndex]);
        
        console.log('削除前：' + $scope.showConditions.length);
        
        $scope.showConditions[pIndex].splice(cIndex, 1);
        
        console.log('削除後：' +$scope.showConditions.length);
        console.log($scope.showConditions);

        if (1 === $scope.showConditions[pIndex].length) $scope.showConditions[pIndex].isJoin = false;
        $scope.showConditions.push(pIndex, 0, target);
        console.log('ぷっしゅ後：' +$scope.showConditions.length);

        console.log($scope.showConditions);
    };

    $scope.save = function()
    {
        var queryColumns = Shared.get('queryColumns');
        var tables = Query.getTables(queryColumns);

        var parameters = 
        {
            query_document_id: Shared.get('updateQueryDocumentId'),
            query_name: $scope.query.query_name, 
            conditionList: $scope.showConditions, 
            tables: tables
        };
        Query.resource.create(parameters).$promise.then(function(response, err)
        {
            Shared.destloyByName('queryColumns');
            Shared.destloyByName('updateQueryName');
            Shared.destloyByName('updateQueryDocumentId');
            Utility.info('クエリを保存しました');
            Location.query();
        });
    };
    
    $scope.execute = function()
    {
        var data = Shared.get('queryColumns');
        var tables = Query.getTables(data);
        var parameters = {tables: tables, conditionList: $scope.showConditions};
        Query.resource.executeQuery(parameters).$promise.then(function(response, err)
        {
            Utility.info('該当データは' + response.result + '件あります');
        });
    };
}]);