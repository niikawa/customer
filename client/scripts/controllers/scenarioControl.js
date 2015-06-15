var scenarioControlCtrl = angular.module('scenarioControlCtrl',['ScenarioServices','SegmentServices']);
scenarioControlCtrl.controller('ScenarioControlCtrl',['$scope', '$routeParams', 'Modal','Shared', 'Scenario', 'Segment',
function ($scope, $routeParams, Modal, Shared, Scenario, Segment)
{
    var pageProp = Scenario.getPageProp($routeParams.scenario, $routeParams.id);
    var id = $routeParams.id;
    var logId = 0;
    
    /**
     * scope初期化用
     */
    function setInitializeScope()
    {
        $scope.isBaseCollapse = false; //基本設定Collapse制御
        $scope.isOriginCollapse = false; //個別設定Collapse制御
        $scope.isShowExtraction = false; //抽出条件表示制御
        
        $scope.scenario = {};
        $scope.pageTitle = pageProp.title+pageProp.addTitle;
        
        $scope.type = $routeParams.scenario;
        $scope.template = pageProp.template;

        $scope.approach;
        $scope.status;

        $scope.roop;
        $scope.interval;
        $scope.intervalCondition;
        $scope.intervalConditionList = Scenario.intervalConditionList;
        
    }
    
    function getInitializeData()
    {
        // Scenario.resource.initializeData().$promise.then(function(response)
        // {
                $scope.queryList = Segment.mock().queryData;
                $scope.ifList = Scenario.mock().getIf();
                $scope.logList =  Scenario.mock().getLog();
        //     $scope.segmentList = response.data;
        // });
        
        if (2 === pageProp.mode)
        {
            /* サーバーサイド実装後に開放
            Scenario.resource.get({id: id}).$promise.then(function(response)
            {
                $scope.segmentList = response.data;
            });
            */
        }
    }
    function setEvntListeners()
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
        setEvntListeners();
        getInitializeData();
    };
    
    $scope.clear = function()
    {
        setInitializeScope();
        getInitializeData();
    };
    
    $scope.save = function()
    {
        
    };
    
    $scope.show = function(selectLogId)
    {
        if (logId == selectLogId)
        {
            $scope.isShowExtraction = !$scope.isShowExtraction;
        }
        else
        {
            logId = selectLogId;
            $scope.isShowExtraction = true;
        }
    };

    $scope.removeItem = function()
    {
        
    };
    
    //スケジュール型
    
    
}]);
