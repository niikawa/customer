var scenarioServices = angular.module("ScenarioServices", ["ngResource"]);
scenarioServices.factory("Scenario", ['$resource','$http','$q','Utility',
    function($resource, $http, $q, Utility) 
    {
        var scenarioServices = {};

        var pageProp = {
                schedule: {type: 1, mode: 0, title: 'スケジュール型', addTitle: '', template: 'views/scenario/schedule.html'}, 
                trigger: {type: 2, mode: 0, title: 'トリガー型', addTitle: '', template: 'views/scenario/trigger.html'}
        };
        
        scenarioServices.intervalConditionList = [
            1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,
            21,22,23,24,25,26,27,28,28,30,31
            ];

        scenarioServices.resource = $resource('/scenario/:type/:id/', {id: '@id'},
        {
            list:
            {
                method: 'GET',
                url: 'scenario/list/:id',
                cache: true,
            },
            initializeData:
            {
                method: 'GET',
                url: 'scenario/initialize/:type/:id',
            },
            action:
            {
                method: 'GET',
                url: 'action/:name',
                cache: true,
            },
            save:
            {
                method: 'POST',
                url: 'scenario/save',
            },
            remove:
            {
                method: 'DELETE',
                url: 'scenario/:type/remove/:id',
            },
        });
        
        scenarioServices.getPageProp = function(type, id)
        {
            var target = pageProp[type];
            target.addTitle = (void 0 === id) ? '登録' : '更新';
            target.mode = (void 0 === id) ? 1 : 2;
            
            return target;
        };
        
        scenarioServices.validators =
        {
            isSameName : function(id, scenario_name)
            {
                return $http.post('scenario/name/',{id: id, scenario_name: scenario_name}
                ).then(function(response)
                {
                    if (response.data.result.count > 0)
                    {
                        return $q.reject('exists');
                    }
                    return false;
                });
            }
        };
        
        scenarioServices.setActivePushItem = function(items, propertie, bindObj)
        {
            angular.forEach(items, function(item, key)
            {
                console.log(item[propertie]);
                if (item.isPush)
                {
                    bindObj[propertie] = item[propertie];
                    return false;
                }
            });
        };
        
        scenarioServices.createCondtionString = function(list)
        {
            var condition = '';
            var last = list.length - 1;
            angular.forEach(list, function(item, key)
            {
                condition += item.logicalname + 'が[' + item.condition.value1;
                if ('' !== item.condition.value2)
                {
                    condition += ',' + item.condition.value2;
                }
                condition += ']' + item.selectedCondition.name;
                
                if (key !== last)
                {
                    condition += ('AND' === item.condition.where) ? ' かつ ' : ' または ';
                }
            });
            return condition;
        };
        
        scenarioServices.getConditionDoc = function(list)
        {
            console.log(list);
            var doc = [];
            angular.forEach(list, function(item, key)
            {
                doc.push(
                {
                    physicalname: item.physicalname,
                    condition: item.condition,
                    selectedCondition: item.selectedCondition
                });
            });
            return doc;
        };
        
        scenarioServices.mock = function()
        {
            var getList = function(type)
            {
                if (1 === type)
                {
                    return [
                        {scenario_id: 1, scenario_name:'スケジュール型シナリオ1', update_date: '2015-06-10', status: '利用中'}
                    ];
                }
                else if (2 === type)
                {
                    return [
                        {scenario_id: 2, scenario_name:'トリガー型シナリオ1', update_date: '2015-06-10', status: '利用中'}
                    ];
                }
            };
            
            var data = {
                scenario : [
                    {scenario_type: 'schedule', scenario_name:'スケジュール型シナリオ', regist_num: 1, regist_max: 99},
                    {scenario_type: 'trigger', scenario_name:'トリガー型シナリオ', regist_num: 1, regist_max: 99}
                ],
            
                executePlanScenario : [
                    {scenario_id: 1, scenario_name:'スケジュール型シナリオ1', update_date: '2015-06-10', status: '利用中'},
                    {scenario_id: 2, scenario_name:'トリガー型シナリオ1', update_date: '2015-06-11', status: '利用中'},
                    {scenario_id: 3, scenario_name:'トリガー型シナリオ2', update_date: '2015-06-12', status: '停止中'},
                    {scenario_id: 4, scenario_name:'スケジュール型シナリオ2', update_date: '2015-06-13', status: '利用中'}
                ],
                
                priorities: [
                    {priorities:1, scenario_id: 1, scenario_name:'スケジュール型シナリオ1', scenario_type:'schedule', update_date: '2015-06-10', status: '利用中'},
                    {priorities:2, scenario_id: 2, scenario_name:'トリガー型シナリオ1', scenario_type:'trigger', update_date: '2015-06-11', status: '利用中'},
                    {priorities:3, scenario_id: 3, scenario_name:'トリガー型シナリオ2', scenario_type:'trigger', update_date: '2015-06-12', status: '停止中'},
                    {priorities:4, scenario_id: 4, scenario_name:'スケジュール型シナリオ2', scenario_type:'schedule', update_date: '2015-06-13', status: '利用中'}
                ],
                
                getList: getList,

            };
            return data;
        };

        return scenarioServices;
    }
]);