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
        var table = {logicalname: target.logicalname, physicalname:  target.physicalname};
        var selectItem = {table: table, column: target.column[index]};
        var isSame = false;
        angular.forEach($scope.selectColumns, function(v, k)
        {
            if (v === selectItem)
            {
                isSame = true;
                console.log('same object!');
            }
        });
        if (!isSame) $scope.selectColumns.push(selectItem);
        
    };
    
    $scope.removeColumn = function(index)
    {
        $scope.selectColumns.splice(index, 1);
    };

}]);
