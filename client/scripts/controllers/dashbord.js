var mainCtrl = angular.module('dashbordCtrl',['ScenarioServices']);
mainCtrl.controller('DashbordCtrl',['$scope', 'Shared', 'Scenario', 'Utility',
function ($scope, Shared, Scenario, Utility)
{
    /**
     * scope初期化用
     */
    function setInitializeScope()
    {
        $scope.scenario = [];
        $scope.executePlanScenario = [];
    }
    
    /**
     * 初期処理
     * @author niikawa
     */
    $scope.initialize = function()
    {
        $scope.$emit('requestStart');
        
        $scope._construct();
        setInitializeScope();

        var data= Scenario.mock();
        $scope.scenario = data.scenario;
        $scope.executePlanScenario = data.executePlanScenario;
        
        $scope.$emit('requestEnd');
        
        /* サーバーサイド実装後に開放
        Scenario.resource.get().$promise.then(function(response)
        {
            $scope.scenario = response.data.scenario;
            $scope.executePlanScenario = response.data.executePlanScenario;
        });
        */
        
    };
}]);
