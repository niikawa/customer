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
        
        alert('main controller initialize');
        
        Customer.resource.get({id: 2}).$promise.then(function(response)
        {
            alert('get response');
            console.log(response);
        });
    };
    

}]);
