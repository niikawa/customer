/**
 * @ngdoc function
 * @name workspaceApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the workspaceApp
 */
var mainCtrl = angular.module('mainCtrl',['CustomerServices', 'AzureServices']);
mainCtrl.controller('MainCtrl',['$scope', 'Shared', 'Customer', 'Azure',
function ($scope, Shared, Customer, Azure)
{
    /**
     * scope初期化用
     */
    function setInitializeScope()
    {
        $scope.customerList = [];
        $scope.approch = [];
        $scope.customer = [];
        $scope.rank = '';
        //autocomplete用
        $scope.selectedCustomer = {};
//        $scope.orders = [{price:0, date:''}];
    }
    
    /**
     * 初期処理
     * @author niikawa
     */
    $scope.initialize = function()
    {
        $scope._construct();
        setInitializeScope();

        Customer.resource.get().$promise.then(function(response)
        {
            $scope.customerList = response.data;
        });
    };
    
    $scope.custmoerChangeExecute = function()
    {
        $scope.$emit('requestStart');
        Customer.resource.detail({id: $scope.selectedCustomer.Id}).$promise.then(function(response)
        {
            $scope.customer = response.customer;
            $scope.approch = response.approch;
            $scope.rank = $scope.approch[0].name; 
            console.log(response.orders);
            console.log(response.orders_avg);
            $scope.orders = [response.orders, response.orders_avg];
            $scope.$emit('requestEnd');
        });
    };

}]);
