/**
 * @ngdoc function
 * @name workspaceApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the workspaceApp
 */
var crudCtrl = angular.module('crudCtrl',['CustomerServices']);
crudCtrl.controller('CrudCtrl',['$scope', 'Shared', 'Customer', 
function ($scope, Shared, Customer)
{
    /**
     * scope初期化用
     */
    function setInitializeScope()
    {
        $scope.customerList = [];
        $scope.selectedCustomer = '';
    }
    
    function addSocketOnEventListener()
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
        addSocketOnEventListener();

    };
    

}]);
