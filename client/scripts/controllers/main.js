/**
 * @ngdoc function
 * @name workspaceApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the workspaceApp
 */
var mainCtrl = angular.module('mainCtrl',['CustomerServices', 'AzureServices']);
mainCtrl.controller('MainCtrl',['$scope', 'Shared', 'Customer', 'Azure', 'Utility',
function ($scope, Shared, Customer, Azure, Utility)
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
        $scope.lineLabel = '';
        $scope.addStyle = "";
        $scope.dataLabel = [];
        $scope.isGetData = false;
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
            $scope.addStyle = 'two-row';
            var coefficient = Utility.diffMonth(
                                response.customer.last_purchasing_date, response.customer.start_purchasing_date);
            
            $scope.customer.frequency_avg = 
                Math.round(response.customer.frequency * 10 / coefficient) / 10;
            $scope.customer.monetary_avg = 
                Math.round(response.customer.monetary / coefficient);
            
            $scope.customer.last_purchasing_date = 
                Utility.formatString($scope.customer.last_purchasing_date, 'YYYY年MM月DD日');
            
            console.log($scope.selectedCustomer);
            
            //グラフ描画
            $scope.lineLabel = '直近1年の売上推移（月別サマリ）';
            $scope.dataLabel = [$scope.selectedCustomer.customer_id, 'ランク平均'];
            $scope.orders = [response.orders, response.orders_avg];
            $scope.$emit('requestEnd');
            $scope.isGetData = true;
        });
    };

}]);
