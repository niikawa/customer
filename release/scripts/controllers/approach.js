var approachCtrl = angular.module('approachCtrl',['ApproachServices','ScenarioServices']);
approachCtrl.controller('ApproachCtrl',['$scope', '$routeParams','Shared', 'Utility', 'Approach', 'Scenario', 'Modal',
function ($scope, $routeParams, Shared, Utility, Approach, Scenario, Modal)
{
    function getInitializeData()
    {
        Approach.resource.get().$promise.then(function(approachResponse)
        {
            $scope.approach = approachResponse.data;
            
            Scenario.resource.valid().$promise.then(function(scenarioResponse)
            {
                $scope.scenarioList = scenarioResponse.data;
                $scope.showScenarioList = (0 < $scope.scenarioList.length);
            });
        });
    }
    
    function setEventListeners()
    {
        $scope.$on('dropItemComplete', function(event, data)
        {
            $scope.scenarioList = data.to;
            $scope.$apply();
        });
    }
    
    $scope.initialize = function()
    {
        $scope._construct();
        $scope.approach = [];
        $scope.scenarioList = [];
        getInitializeData();
        setEventListeners();
        Shared.setRoot('approach');
    };
    
    $scope.save = function()
    {
        Approach.resource.save($scope.approach).$promise.then(function(response)
        {
            Utility.info('設定を更新しました');
        });
    };
    
    $scope.savePriority = function()
    {
        Scenario.resource.priority({data: $scope.scenarioList}).$promise.then(function(response)
        {
            Utility.info('優先順位を更新しました');
        });
    };
    
    $scope.showDiscription = function(id)
    {
        var info = Approach.getInfomation(id);
        
        $scope.modalParam = 
        {
            title: info.title,
            message: info.message,
            isExecute: false,
        };
        $scope.modalInstance = Modal.open($scope, "partials/modal/message.html");
    };

    $scope.bulkInvalid = function()
    {
        var params = 
        {
            title: 'シナリオの一括無効について',
            text: '有効なシナリオをすべて無効にしますがよろしいですか？<br>実行した場合、実行予定シナリオはなくなります。',
            confirmButtonText: '一括で無効にする',
            execute: function()
            {
                Scenario.resource.bulkInvalid().$promise.then(function(response)
                {
                    Utility.info('アプローチ対象シナリオをすべて無効しました。');
                    $scope.initialize();
                });
            }
        };
        Utility.infoAlert(params);
    };
    
    $scope.bulkEnable = function()
    {
        var params = 
        {
            title: 'シナリオの一括有効について',
            text: '無効なシナリオをすべて有効にしますがよろしいですか？<br>実行した場合、実行予定シナリオとしてダッシュボード画面に表示されます。',
            isExecute: true,
            confirmButtonText: '一括で有効にする',
            execute: function()
            {
                Scenario.resource.bulkEnable().$promise.then(function(response)
                {
                    Utility.info('アプローチ対象シナリオをすべて有効しました。');
                    $scope.initialize();
                });
            }
        };
        Utility.infoAlert(params);
    };
}]);
