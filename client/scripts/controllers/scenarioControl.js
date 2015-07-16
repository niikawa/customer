var scenarioControlCtrl = angular.module('scenarioControlCtrl',['ScenarioServices','SegmentServices']);
scenarioControlCtrl.controller('ScenarioControlCtrl',['$scope', '$routeParams', 'Modal','Shared', 'Utility', 'Location', 'Scenario',
function ($scope, $routeParams, Modal, Shared, Utility, Location, Scenario)
{
    var pageProp = Scenario.getPageProp($routeParams.scenario, $routeParams.id);
    var id = $routeParams.id;
    var actionName = '';
    var selectConditionList = [];
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

        Shared.setRoot($scope.type +' scenario');
        if (1 === pageProp.type)
        {
            
            $scope.specificInfo = 
            {
                repeat_flag: null,
                expiration_start_date: Utility.today('YYYY-MM-DD'),
                expiration_end_date: '',
                interval: 0, 
                intervalCondition: '', 
                daysCondition: Scenario.daysCondition(),
                weekCondition: {mon: false, tue: false, wed: false, thu: false, fri: false, sat: false, sun: false}
            };
        }
        else if (2 === pageProp.type)
        {
            $scope.conditions = [];
            $scope.specificInfo = {};
            $scope.decisionList = [];
        }
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
            expiration_start_date:
            {
                isDateValid: function(modelValue, viewValue)
                {
                    var val = modelValue || viewValue;
                    return Utility.isDateValid(val);
                }
            },
            expiration_end_date:
            {
                isDateValid: function(modelValue, viewValue)
                {
                    var val = modelValue || viewValue;
                    return Utility.isDateValid(val);
                },
                isAfter: function(modelValue, viewValue)
                {
                    var val = modelValue || viewValue;
                    return Utility.isAfter(val, $scope.scenario.expiration_start_date);
                }
            },
            interval:
            {
                isSelect: function (modelValue, viewValue)
                {
                    var val = modelValue || viewValue;
                    return 0 !== val;
                }
            },
            weekCondition:
            {
                isSelect: function (modelValue, viewValue)
                {
                    var weekCondition = $scope.specificInfo.weekCondition || {};
                    var isSelect = false;
                    angular.forEach(weekCondition, function(item, key)
                    {
                        if (item) isSelect = true;
                    });
                    return isSelect;
                }
            },
            daysCondition:
            {
                isSelect: function (modelValue, viewValue)
                {
                    var daysCondition = $scope.specificInfo.daysCondition || {};
                    var isSelect = false;
                    angular.forEach(daysCondition, function(item, key)
                    {
                        if (item.check) isSelect = true;
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
                    
                    return Scenario.validators.isSameName(id, val);
                }
            }
        };
    }
    
    function getInitializeData()
    {
        var params = {type: $routeParams.scenario};
        var isEdit = void 0 !== id;
        if (isEdit) params.id = id;

        Scenario.resource.initializeData(params).$promise.then(function(response)
        {
            $scope.segmentList = response.segment;
            $scope.ifList = response.ifLayout;
            $scope.scenario = response.target;
            if (1 === pageProp.type)
            {
                if (isEdit) editScheduleInitialize(response);
            }
            else if (2 === pageProp.type)
            {
                $scope.actionList =  response.specific;
                if (isEdit) editTriggerInitialize(response);
            }
        });
    }
    function editScheduleInitialize(initData)
    {
        $scope.specificInfo.repeat_flag = initData.specificInfo.specific.repeat_flag;
        $scope.specificInfo.expiration_start_date = Utility.formatString(initData.specificInfo.specific.expiration_start_date);
        $scope.specificInfo.expiration_end_date = Utility.formatString(initData.specificInfo.specific.expiration_end_date);
        
        if (null !== initData.specificInfo.doc)
        {
            $scope.specificInfo.interval = initData.specificInfo.doc.interval;
        
            if (2 === $scope.specificInfo.interval)
            {
               $scope.specificInfo.weekCondition = initData.specificInfo.doc.weekCondition;
            }
            else if (3 === $scope.specificInfo.interval)
            {
               $scope.specificInfo.daysCondition = initData.specificInfo.doc.daysCondition;
            }
        }
    }
    
    function editTriggerInitialize(initData)
    {
        $scope.specificInfo = initData.specificInfo.specific;
        Scenario.resource.action({name: initData.specificInfo.doc.actionName}).$promise.then(function(response)
        {
            actionName = $scope.activeName;
            $scope.isShowExtraction = true;
            $scope.columnList = response.data.column;
            $scope.activeName = initData.specificInfo.doc.actionName;
            
            angular.forEach(initData.specificInfo.doc.conditionList, function(conditionItems)
            {
                var restoration = [];
                angular.forEach(conditionItems, function(items)
                {
                    angular.forEach($scope.columnList, function(info)
                    {
                        if (items.physicalname == info.physicalname)
                        {
                            info.condition = items.condition;
                            info.selectedCondition = items.selectedCondition;
                            restoration.push(info);
                            //return false;
                        }
                    });
                });
                selectConditionList.push(restoration);
                var condtionString = Scenario.createCondtionString(restoration);
                $scope.decisionList.push(condtionString);
            });
        });
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
        
        if (1 === pageProp.type)
        {
            if (null !== $scope.specificInfo.repeat_flag)
            {
                $scope.$watch('specificInfo.expiration_start_date', function()
                {
                    $scope.scenarioForm.expiration_start_date.$validate();
                });
            }
            if (1 === $scope.specificInfo.repeat_flag)
            {
                $scope.$watch('specificInfo.expiration_end_date', function()
                {
                    $scope.scenarioForm.expiration_end_date.$validate();
                });
                $scope.$watch('specificInfo.interval', function()
                {
                    $scope.scenarioForm.interval.$validate();
                });
            }
        }
        
    }
    function setEventListeners()
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
        getInitializeData();
        setValidation();
        setWatchItems();
        setEventListeners();
    };
    
    $scope.showAction = function(targetName)
    {
        $scope.conditions = [];
        $scope.decisionList = [];
        if (actionName == targetName)
        {
            $scope.isShowExtraction = !$scope.isShowExtraction;
        }
        else
        {
            Scenario.resource.action({name: targetName}).$promise.then(function(response)
            {
                actionName = targetName;
                $scope.isShowExtraction = true;
                $scope.columnList = response.data.column;
            });
        }
    };
    //---------------------------------
    //trigger
    //---------------------------------
    $scope.moveCondition = function(item)
    {
        var push = {};
        angular.copy(item, push);
        $scope.conditions.push(push);
    };

    $scope.removeItem = function(index)
    {
        $scope.conditions.splice(index, 1);
    };
    
    $scope.decision = function()
    {
        selectConditionList.push($scope.conditions);
        var condtionString = Scenario.createCondtionString($scope.conditions);
        $scope.decisionList.push(condtionString);
        $scope.conditions = [];
    };
    
    $scope.removeDecisionList = function(index)
    {
        $scope.decisionList.splice(index, 1);
    };

    $scope.clear = function()
    {
        setInitializeScope();
        getInitializeData();
    };
    
    $scope.save = function()
    {
        var doc;
        if (1 === pageProp.type)
        {
            if (1 == $scope.specificInfo.repeat_flag)
            {
                doc = {interval: $scope.specificInfo.interval};
                if (2 === $scope.specificInfo.interval)
                {
                    doc.weekCondition = $scope.specificInfo.weekCondition;
                }
                else if (3 === $scope.specificInfo.interval)
                {
                    doc.daysCondition = $scope.specificInfo.daysCondition;
                }
            }
        }
        else if (2 === pageProp.type)
        {
            //ベータ版のための制御
            if (0 === selectConditionList.length) return false;
            
            doc = 
            {
                actionName: actionName,
                conditionList: Scenario.getConditionDoc(selectConditionList)
            };
        }
        else
        {
            return false;
        }

        $scope.scenario.scenario_type = pageProp.type;
        Scenario.setActivePushItem($scope.segmentList, 'segment_id', $scope.scenario);
        Scenario.setActivePushItem($scope.ifList, 'if_layout_id', $scope.scenario);

        var params = {scenario: $scope.scenario, specificInfo: $scope.specificInfo, doc: doc};

        Scenario.resource.save(params).$promise.then(function(response)
        {
            Utility.info('シナリオを保存しました。');
            if (1 === pageProp.type)
            {
                Location.schedule();
            }
            else if (2 === pageProp.type)
            {
                Location.trigger();
            }
        });
    };
    
    //---------------------------------
    //schedule
    //---------------------------------
    $scope.weekConditionValidation = function()
    {
        $scope.scenarioForm.weekCondition.$validate();
    };
    
    $scope.daysConditionValidation = function()
    {
        $scope.scenarioForm.daysCondition.$validate();
    };

}]);
