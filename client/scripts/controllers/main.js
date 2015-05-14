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
        $scope.approch = [];
        $scope.customer = [];
        
        //autocomplete用
        $scope.selectedCustomer = {};
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
        console.log($scope.selectedCustomer);
        Customer.resource.detail({id: $scope.selectedCustomer.Id}).$promise.then(function(response)
        {
            $scope.customer = response.customer;
            $scope.approch = response.approch;
            
            console.log(response);
        });
    };

}]);
