/**
 * @ngdoc function
 * @name workspaceApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the workspaceApp
 */
var queryCtrl = angular.module('queryCtrl',['QueryServices']);
queryCtrl.controller('QueryCtrl',['$scope', 'Shared', 'Query', 'Location', 'Utility',
function ($scope, Shared, Query, Location, Utility)
{
    var selectTable = '';
    /**
     * scope初期化用
     */
    function setInitializeScope()
    {
        $scope.tableList = [];
        $scope.columnNum = 0;
        $scope.selectColumns = Shared.get('queryColumns') || [];
        $scope.showSelectedColumnsBox = $scope.selectColumns.length > 0;
        $scope.conditions = [];
    }
    
    /**
     * 初期処理
     * @author niikawa
     */
    $scope.initialize = function()
    {
        $scope._construct();
        setInitializeScope();

        Query.resource.get().$promise.then(function(response)
        {
            $scope.tableList = response.data;
        });
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
            $scope.selectColumns.push({
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
    $scope.nextValidation = function()
    {
        $scope.selectColumns = Shared.get('queryColumns');
        if (void 0 === $scope.selectColumns)
        {
            Location.query();
        }
        
        angular.forEach($scope.selectColumns, function(v, k)
        {
            v.column.inputType = Query.getContentsByColumsType(v.column.type);
        });
    };
    
    $scope.removeItem = function(index)
    {
        $scope.selectColumns.splice(index, 1);
    };
    
    $scope.next = function()
    {
        console.log($scope.selectColumns);
        if (Query.validation.require($scope.selectColumns)) Location.querySave();
//        if (isNext) Location.querySave();
    };
    
    /*****************************************/
    /*                  save                 */
    /*****************************************/
    $scope.saveInitialize = function()
    {
        $scope.query = {query_name: ''};
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
            $scope.showConditions.push(array);
        });
    };
    
    $scope.isJoin = function(items)
    {
        if (items.hasOwnProperty('isJoin'))
        {
            return items.isJoin;
        }
        
        return false;
    };

    $scope.release = function(pIndex, cIndex)
    {
        
        //該当オブジェクトを特定
        var target = [];
        target.push($scope.showConditions[pIndex][cIndex]);
        //配列から除去
        $scope.showConditions[pIndex].splice(cIndex, 1);
        //新しい親要素に追加
        console.log(pIndex);
        console.log(cIndex);
        console.log(target);
        $scope.showConditions.push(pIndex, 0, target);
    };

    $scope.save = function()
    {
        var sql = Query.createSQL($scope.showConditions);
        var c = Shared.get('queryColumns');
        var tables = Query.getTables(c);
        var data =  {query_name: $scope.query.query_name, sql: sql, tables: tables};
        Query.resource.create({data: data}).$promise.then(function(response, err)
        {
            Shared.destloyByName('queryColumns');
            Utility.info('クエリを保存しました');
            Location.query();
        });
    };
    
    $scope.execute = function()
    {
//        Utility.info('現状のSQLを実行して対象数を出すよ');
        var data = Shared.get('queryColumns');
        var tables = Query.getTables(c);
        Query.resource.executeQuery({data: data, tables: tables}).$promise.then(function(response, err)
        {
            console.log(response);
        });
    };
}]);