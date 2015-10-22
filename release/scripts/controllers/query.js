var queryListCtrl = angular.module('queryListCtrl',['QueryServices']);
queryListCtrl.controller('QueryListCtrl',['$scope', 'Shared', 'Query', 'Segment','Modal','Location', 'Utility',
function ($scope, Shared, Query, Segment, Modal, Location, Utility)
{
    function setInitializeScope()
    {
        $scope.queryList = [];
        Shared.setRoot('query list');
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
        var target = $scope.queryList[index];
        var params = {qId: target.id, count: target.useNum};
        Segment.resource.useSegment(params).$promise.then(function(response)
        {
            $scope.modalParam = 
            {
                title: $scope.queryList[index].query_name+"を利用しているセグメント",
                list: response.data,
                hrefBase: '#/segment/control',
                dynamicParamKey: 'id',
                close: function(id)
                {
                    $scope.modalInstance.close();
                    Location.segmentControl(id);
                }
            };
            $scope.modalInstance = Modal.open($scope, "partials/modal/list.html");
            
        });
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
    
    function setInitializeScope(isEdit)
    {
        Shared.destloyByName('queryName');
        Shared.destloyByName('updateQueryDocumentId');
        $scope.tableList = [];
        $scope.tableListRef = [];
        $scope.columnNum = 0;
        $scope.selectColumns = [];
        if (!isEdit)
        {
            var root = Shared.getRoot();
            if ( (void 0 !== root || 0 < root.length) && 'query set' === root[root.length-1])
            {
                $scope.selectColumns = Shared.get('queryColumns') || [];
            }
            else
            {
                Shared.destloyByName('queryColumns');
            }
        }
        $scope.showSelectedColumnsBox = $scope.selectColumns.length > 0;
        $scope.conditions = [];
        $scope.isShowEditMessage = false;
        $scope.returnUrl = Query.getReturnURL();
        Shared.setRoot('query');
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
        var isEdit = $routeParams.hasOwnProperty('id');
        $scope._construct();
        setInitializeScope(isEdit);
        
        if (isEdit)
        {
            Query.resource.getControlInit({id: $routeParams.id}).$promise.then(function(response)
            {
                $scope.queryName = response.data.query_name;
                $scope.tableList = response.table;
                $scope.tableListRef = Query.getRefTabels(response.table);
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
                $scope.tableListRef = Query.getRefTabels(response.table);
            });
        }
    };
    
    $scope.showColumns = function(table)
    {
        selectTable = table;
        var selectTableName = $scope.tableList[table].logicalname;
        //すでに選択しているテーブルとの関連が無い場合
        var num = $scope.selectColumns.length;
        var tableObje = {};
        tableObje[table] = selectTableName;
        for (var index = 0; index < num; index++)
        {
            var name = $scope.selectColumns[index].table.physicalname;
            if (!tableObje.hasOwnProperty(name))
            {
                tableObje[name] = $scope.selectColumns[index].table.logicalname;
            }
        }
        var hasRelation = (void 0 !== $scope.tableList[table].relation);
        var tableNum = Object.keys(tableObje).length;
        if (hasRelation)
        {
            var relationList = $scope.tableList[table].relation.split(" ");
            var relationListNum = relationList.length;
            for (var relationIndex = 0; relationIndex < relationListNum; relationIndex++)
            {
                //リレーション関係にあるテーブル以外が選択されていないかチェック
                if (!tableObje.hasOwnProperty(relationList[relationIndex]))
                {
                    Utility.warning(selectTableName+"は既に選択しているテーブルと関連がありません");
                    break;
                }
            }
        }
        else if (1 !== tableNum || !tableObje.hasOwnProperty(table))
        {
            //リレーションを持たないテーブルの場合、結合不可のため選択しているテーブルが
            //自分で無い場合は選択不可とする。
            Utility.warning(selectTableName+"は既に選択しているテーブルと関連がありません");
        }
        else
        {
            $scope.columnList = $scope.tableList[table].column;
            $scope.columnNum = $scope.columnList.length;
        }
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
            $scope.docIdUrl = '/control/'+docId;
            $scope.isShowEditMessage = true;
            $scope.queryName = Shared.get('updateQueryName');
        }
    }
    
    $scope.nextValidation = function()
    {
        Shared.setRoot('query set');
        $scope.selectColumns = Shared.get('queryColumns');
        if (void 0 === $scope.selectColumns) Location.query();
        $scope.columnsRows = [];
        var num = $scope.selectColumns.length;
        var workRow = [];
        for (var index = 0; index < num; index++)
        {
            if (0 !==index && 0 === index % 3)
            {
                $scope.columnsRows.push(workRow);
                workRow = [];
            }
            workRow.push($scope.selectColumns[index]);
        }
        if (0 < workRow.length) $scope.columnsRows.push(workRow);

        editSetInitializeScope();
    };
    
    $scope.removeItem = function(i, j)
    {
        var selectColumns = Shared.get('queryColumns');
        //削除用インデックスを算出
        var removeIndex = i*3 + j;
        selectColumns.splice(removeIndex, 1);
        if (0 === selectColumns.length) Location.query();
        
        var num = selectColumns.length;
        var workRow = [];
        $scope.columnsRows = [];
        for (var index = 0; index < num; index++)
        {
            if (0 !==index && 0 === index % 3)
            {
                $scope.columnsRows.push(workRow);
                workRow = [];
            }
            workRow.push(selectColumns[index]);
        }
        if (0 < workRow.length) $scope.columnsRows.push(workRow);
        Shared.set('queryColumns', selectColumns);
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
        Shared.setRoot('query save');
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
        $scope.showConditions[pIndex].splice(cIndex, 1);
        if (1 === $scope.showConditions[pIndex].length) $scope.showConditions[pIndex].isJoin = false;
        
        console.log('ぷっしゅ前：' +$scope.showConditions.length);
        console.log($scope.showConditions);
        $scope.showConditions.splice(pIndex+1, 0, target);
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