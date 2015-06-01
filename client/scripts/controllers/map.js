/**
 * @ngdoc function
 * @name workspaceApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the workspaceApp
 */
var mapCtrl = angular.module('mapCtrl',['geoServices', '']);
mapCtrl.controller('MapCtrl',['$scope', 'GEO', 'Shared', 'Utility',
function ($scope, GEO, Shared, Utility)
{
    /**
     * scope初期化用
     */
    function setInitializeScope()
    {
        
    }
    
    /**
     * 初期処理
     * @author niikawa
     */
    $scope.initialize = function()
    {
        $scope._construct();
        setInitializeScope();

        

    };
    
}]);
