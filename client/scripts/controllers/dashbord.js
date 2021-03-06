var mainCtrl = angular.module('dashbordCtrl',['ScenarioServices']);
mainCtrl.controller('DashbordCtrl',['$scope', 'Shared', 'Scenario', 'Utility', 'Modal',
function ($scope, Shared, Scenario, Utility, Modal)
{
    function setInitializeScope()
    {
        $scope.scenario = [];
        $scope.executePlanScenario = [];
    }
    
    function getInitializeData()
    {
        Scenario.resource.typeCount().$promise.then(function(response)
        {
            $scope.scenarioInfo = response.data;
            Scenario.resource.executeplan().$promise.then(function(response)
            {
                $scope.isShowExecutePlanScenario = (response.data.length > 0);
                $scope.executePlanNum = response.data.length;
                $scope.exemptPlanNum = $scope.scenarioInfo.regist_num - $scope.executePlanNum;
                $scope.executePlanScenario = response.data;
            });
        });
    }
    
    $scope.initialize = function()
    {
        $scope.$emit('requestStart');
        
        $scope._construct();
        setInitializeScope();
        getInitializeData();
        Shared.setRoot('dashbord');
        
        $scope.$emit('requestEnd');
    };
    
    $scope.bulkInvalid = function()
    {
        $scope.modalParam = 
        {
            title: 'シナリオの一括無効について',
            message: '実行予定のシナリオをすべて無効にしますがよろしいですか？<br>再度有効にする場合はアプローチ管理画面から有効にできます。',
            isExecute: true,
            executeLabel: '一括で無効にする',
            execute: function()
            {
                Scenario.resource.bulkInvalid().$promise.then(function(response)
                {
                    setInitializeScope();
                    getInitializeData();
                    $scope.modalInstance.close();
                    Utility.info('実行予定のシナリオを一括無効しました。');
                });
            }
        };
        $scope.modalInstance = Modal.open($scope, "partials/modal/message.html");
    };
}]);
