/**
 * @ngdoc function
 * @name workspaceApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the workspaceApp
 */
var queryCtrl = angular.module('queryCtrl',['QueryServices']);
queryCtrl.controller('QueryCtrl',['$scope', 'Shared', 'Query', 
function ($scope, Shared, Query)
{
    var selectTable = '';
    /**
     * scope初期化用
     */
    function setInitializeScope()
    {
        $scope.tableList = [];
        $scope.columnNum = 0;
        $scope.selectColumns = [];
        $scope.showSelectedColumnsBox = false;
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
        $scope.cshowSelectedColumnsBox = ($scope.selectColumns.length > 0);
    };
    
    $scope.removeColumn = function(index)
    {
        $scope.selectColumns.splice(index, 1);
    };

}]);
