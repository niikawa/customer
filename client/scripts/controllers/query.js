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
        Location.querySave();
    };
    
    $scope.saveInitialize = function()
    {
        $scope.conditions = [];
        $scope.selectColumns = Shared.get('queryColumns');
        
        if (void 0 === $scope.selectColumns)
        {
            Location.query();
        }
        Query.createCondtionString($scope.selectColumns);
        console.log($scope.selectColumns);
    };
    
    $scope.createQuery = function(index, appned)
    {
        var target = $scope.selectColumns[index];
        $scope.sql += target.table.physicalname+target.column.physicalname+target.selectedCondition.symbol+appned;
    };
    
    $scope.save = function()
    {
        var sql = Query.createSQL($scope.selectColumns);
        console.log(sql);
        var data =  {title: $scope.query_name, sql: sql};
        Query.resource.create({data: data}).$promise.then(function(response, err)
        {
            Shared.destloyByName('queryColumns');
            Utility.info('クエリを保存しました');
            Location.query();
        });
    };
}]);