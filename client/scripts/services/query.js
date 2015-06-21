var queryServices = angular.module("QueryServices", ["ngResource"]);
queryServices.factory("Query", ['$resource', '$http','Shared',
    function($resource, $http, Shared)
    {
        var queryServices = {};
        
        queryServices.resource = $resource('/table');
        
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
            
            
        };

        return queryServices;
    }
]);