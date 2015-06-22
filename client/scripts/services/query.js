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


        queryServices.createSQL = function(list)
        {
//            var sql = 'SELECT * FROM ';
            var where = ' ';
            var firstLooplast = list.length -1;
            angular.forEach(list, function(items, k1)
            {
                var secondLoopLast = items.length -1;
                if (items.length > 1) where += '(';
                
                angular.forEach(items, function(v, k2)
                {
                    
                    where += v.table.physicalname + '.' + v.column.physicalname + ' ' + v.selectedCondition.symbol + ' ';
                    
                    switch (v.selectedCondition.symbol)
                    {
                        case 'IN':
                        case 'NOT IN':
                            where += ' (' + v.condition.value1 + ')';
                            break;
                        case 'BETWEEN':
                            where += v.condition.value1 + ' AND ' + v.condition.value2;
                            break;
                        case 'LIKE':
                            break;
                        default:
                            where += v.condition.value1;
                    }
                    if (items.length > 1 && secondLoopLast === k2 ) where += ')';
                    
                    if (k1 !== firstLooplast || k2 !== secondLoopLast) where += ' ' +v.condition.where+ ' ';
                });
                
            });
            return where;
        };

        return queryServices;
    }
]);