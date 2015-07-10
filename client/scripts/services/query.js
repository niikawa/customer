var queryServices = angular.module("QueryServices", ["ngResource"]);
queryServices.factory("Query", ['$resource', '$http','Shared',
    function($resource, $http, Shared)
    {
        var queryServices = {};
        
        queryServices.sql = '';
        
        queryServices.resource = $resource('/query',{},
        {
            getQuery:
            {
                method: 'GET',
                url: '/query/get',
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
            executeQuery:
            {
                method: 'POST',
                url: '/query/execute',
            },
        });
        
        queryServices.validation = 
        {
            require: function(list)
            {
                var isNext = false;
                angular.forEach(list, function(v, k)
                {
                    var isValue1 = v.condition.hasOwnProperty('value1');
                    var isValue2 = v.condition.hasOwnProperty('value2');
                    if (!isValue1)
                    {
                        isNext = false;
                        return false;
                    }
                    
                    if (isValue1)
                    {
                        if (0 === v.condition.value1.trim.length)
                        {
                            isNext = false;
                            return false;
                        }
                    }
                    
                    if (isValue2)
                    {
                        if (0 === v.condition.value2.trim.length)
                        {
                            isNext = false;
                            return false;
                        }
                    }
                });
                return isNext;
            }
        };
        
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
                    tables[v.table.physicalname] = v.table.logicalname;
                }
            });
            return tables;
        };

        return queryServices;
    }
]);