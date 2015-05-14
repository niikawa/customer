/**
 * @ngdoc function
 * @name workspaceApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the workspaceApp
 */
var mainCtrl = angular.module('mainCtrl',['CustomerServices']);
mainCtrl.controller('MainCtrl',['$scope', 'Shared', 'Customer', 
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

        Customer.resource.get().$promise.then(function(response)
        {
            $scope.customerList = response.data;
        });
    };
    
    $scope.custmoerChangeExecute = function()
    {
        Customer.resource.get({id: 1}).$promise.then(function(response)
        {
            console.log(response.data);
        });
    };

}]);
