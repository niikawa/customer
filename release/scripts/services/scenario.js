var scenarioServices = angular.module("ScenarioServices", ["ngResource"]);
scenarioServices.factory("Scenario", ['$resource','$http','$q','Utility',
    function($resource, $http, $q, Utility) 
    {
        var scenarioServices = {};

        var pageProp = {
                schedule: {type: 1, mode: 0, title: 'スケジュール型', addTitle: '', template: 'views/scenario/schedule.html'}, 
                trigger: {type: 2, mode: 0, title: 'トリガー型', addTitle: '', template: 'views/scenario/trigger.html'}
        };
        scenarioServices.daysCondition = function()
        {
            var data = [];
            var num = 31;
            for (var index = 1; index <= num ; index++)
            {
                data.push({name: index, check:false});
            }
            data.push({name: '最終日', check:false});
            return data;
        };

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
            valid:
            {
                method: 'GET',
                url: 'scenario/valid',
            },
            priority:
            {
                method: 'POST',
                url: 'scenario/priority',
            },
            typeCount:
            {
                method: 'GET',
                url: 'scenario/typecount',
            },
            executeplan:
            {
                method: 'GET',
                url: 'scenario/execute/plan',
            },
            bulkInvalid:
            {
                method: 'GET',
                url: 'scenario/bulkInvalid',
            },
            bulkEnable:
            {
                method: 'GET',
                url: 'scenario/bulkEnable',
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
            isSameName : function(parameters)
            {
                return $http.post('scenario/name/', parameters
                ).then(function(response)
                {
                    if (response.data.result.count > 0)
                    {
                        return $q.reject('exists');
                    }
                    return false;
                });
            },
        };
        
        scenarioServices.setActivePushItem = function(items, propertie, bindObj, bindProp)
        {
            angular.forEach(items, function(item, key)
            {
                if (item.isPush)
                {
                    bindObj[bindProp] = item[propertie];
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
            var doc = [];
            angular.forEach(list, function(items, key)
            {
                var push = [];
                angular.forEach(items, function(item, key)
                {
                    push.push(
                    {
                        physicalname: item.physicalname,
                        condition: item.condition,
                        selectedCondition: item.selectedCondition
                    });
                });
                doc.push(push);
            });
            return doc;
        };
        
        return scenarioServices;
    }
]);