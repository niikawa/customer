var queryServices = angular.module("QueryServices", ["ngResource"]);
queryServices.factory("Query", ['$resource', '$http','Shared',
    function($resource, $http, Shared)
    {
        var queryServices = {};
        
        queryServices.sql = '';
        
        queryServices.resource = $resource('/query', {id: '@id'},
        {
            getQuery:
            {
                method: 'GET',
                url: '/query/get',
            },
            getList:
            {
                method: 'GET',
                url: '/query/list',
            },
            getControlInit:
            {
                method: 'GET',
                url: '/query/control/:id',
            },
            create:
            {
                method: 'POST',
                url: '/query/create',
            },
            remove:
            {
                method: 'DELETE',
                url: '/query/:id',
            },
            getUseSegment:
            {
                method: 'GET',
                url: '/query/use/segment/:id',
            },
            executeQuery:
            {
                method: 'POST',
                url: '/query/execute',
            },
        });

        queryServices.getContentsByColumsType = function(type)
        {
            var countents = {inputType:'', };
            if ('INT' === type)
            {
                countents.inputType = 'number';
            }
            else if ('VARCHAR' === type)
            {
                countents.inputType = 'text';
            }
            else if ('DATETIME' === type)
            {
                countents.inputType = 'date';
            }
            return countents.inputType;
        };
        
        queryServices.createCondtionString = function(list)
        {
            angular.forEach(list, function(v, k)
            {
                if (void 0 === v.condition.value2 || '' === v.condition.value2)
                {
                    v.selectedCondition.condtionString = 
                        v.condition.value1 +''+ v.selectedCondition.name;
                }
                else
                {
                    v.selectedCondition.condtionString = 
                        v.condition.value1 +'から'+ v.condition.value2 + v.selectedCondition.name;
                }
            });
        };

        queryServices.getTables = function(list)
        {
            var tables = {};
            angular.forEach(list, function(v, k)
            {
                if (void 0 === tables[v.table.physicalname])
                {
                    tables[v.table.physicalname] = [];
                }
                var info = 
                {
                    column: v.column.physicalname,
                    conditionType: v.selectedCondition.value,
                    values: v.condition
                };
                tables[v.table.physicalname].push(info);
            });
            return tables;
        };
        
        queryServices.getReturnURL = function()
        {
            var root = Shared.getRoot();
            var num = root.length;
            var before = root[root.length-1];
            var url = '';
            if ('query list' === before)
            {
                url = '/query/list';
            }
            else if ('query list' === before)
            {
                url = '/segment/control';
            }
            else
            {
                for (num; 0 < num; num--)
                {
                    if ('query list' === root[num])
                    {
                        url = '/query/list';
                        break;
                    }
                    else if ('segment control' === root[num])
                    {
                        url = '/segment/control';
                        break;
                    }
                }
            }
            return url;
        };

        return queryServices;
    }
]);