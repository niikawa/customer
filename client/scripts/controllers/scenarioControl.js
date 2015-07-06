var scenarioControlCtrl = angular.module('scenarioControlCtrl',['ScenarioServices','SegmentServices']);
scenarioControlCtrl.controller('ScenarioControlCtrl',['$scope', '$routeParams', 'Modal','Shared', 'Scenario', 'Segment',
function ($scope, $routeParams, Modal, Shared, Scenario, Segment)
{
    var pageProp = Scenario.getPageProp($routeParams.scenario, $routeParams.id);
    var id = $routeParams.id;
    var actionName = '';
    
    /**
     * scope初期化用
     */
    function setInitializeScope()
    {
        $scope.isBaseCollapse = false; //基本設定Collapse制御
        $scope.isOriginCollapse = false; //個別設定Collapse制御
        $scope.isShowExtraction = false; //抽出条件表示制御

        $scope.pageTitle = pageProp.title+pageProp.addTitle;
        
        $scope.scenario = {};
        $scope.scenario.approach;
        $scope.scenario.status;
        
        $scope.type = $routeParams.scenario;
        $scope.template = pageProp.template;

        $scope.roop;
        $scope.interval;
        $scope.intervalCondition;
        $scope.intervalConditionList = Scenario.intervalConditionList;
    }
    
    function setValidation()
    {
        $scope.validators = 
        {
            segment:
            {
                isSelect: function (modelValue, viewValue)
                {
                    var segmentList = $scope.segmentList || {};
                    var isSelect = false;
                    angular.forEach(segmentList, function(item, key)
                    {
                        if (item.isPush) isSelect = true;
                    });
                    return isSelect;
                }
            },
            ifLayout:
            {
                isSelect: function (modelValue, viewValue)
                {
                    var ifList = $scope.ifList || {};
                    var isSelect = false;
                    angular.forEach(ifList, function(item, key)
                    {
                        if (item.isPush) isSelect = true;
                    });
                    return isSelect;
                }
            },
        };
        $scope.asyncValidators = 
        {
            scenario_name:
            {
                same: function (modelValue, viewValue)
                {
                    var val = modelValue || viewValue;
                    if (void 0 === val || val.length === 0) return true;
                    
                    return Scenario.validators.isSameName($scope.scenario.segment_name, val);
                }
            }
        };
    }
    
    function getInitializeData()
    {
        Scenario.resource.initializeData({type: $routeParams.scenario}).$promise.then(function(response)
        {
            $scope.segmentList = response.segment;
            $scope.ifList = response.ifLayout;
            if (1 === pageProp.type)
            {
                $scope.actionList =  response.specificInfo;
            }
            else if (2 === pageProp.type)
            {
                
            }
            
        });
        
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
    function setWatchItems()
    {
        $scope.$watch('scenario.scenario_name', function()
        {
            $scope.scenarioForm.scenario_name.$validate();
        });

        $scope.$watch('segmentList', function()
        {
            $scope.scenarioForm.segment.$validate();
        },true);
        
        $scope.$watch('ifList', function()
        {
            $scope.scenarioForm.ifLayout.$validate();
        },true);
        
    }
    
    /**
     * 初期処理
     * @author niikawa
     */
    $scope.initialize = function()
    {
        $scope._construct();
        setInitializeScope();
        getInitializeData();
        setValidation();
        setWatchItems();
    };
    
    $scope.clear = function()
    {
        setInitializeScope();
        getInitializeData();
    };
    
    $scope.save = function()
    {
        Scenario.getActivePushItem($scope.segmentList, 'segment_id', $scope.scenario);
        Scenario.getActivePushItem($scope.ifList, 'if_layout_id', $scope.scenario);

        console.log($scope.scenario);
    };
    
    $scope.show = function(targetName)
    {
        if (actionName == targetName)
        {
            $scope.isShowExtraction = !$scope.isShowExtraction;
        }
        else
        {
            Segment.resource.action({name: targetName}).$promise.then(function(response)
            {
                actionName = targetName;
                $scope.isShowExtraction = true;
                console.log(response.data);
            });
        }
    };

}]);
