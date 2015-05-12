/**
 * @ngdoc function
 * @name workspaceApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the workspaceApp
 */
var mainCtrl = angular.module('mainCtrl',[]);
mainCtrl.controller('MainCtrl',['$scope', 'Shared', 'Main', 
function ($scope, Shared, Main)
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
        
        // Project.resource.get({siteid:'niikawa' ,pid: Shared.get('id')}).$promise.then(function(response)
        // {
        //     $scope.$emit('getProjectComplete', response.list);
        // });
    };
    

}]);
