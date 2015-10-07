var azureServices = angular.module("AzureServices", ["ngResource"]);
azureServices.factory("Azure", ['$resource', '$http','Shared',
    function($resource, $http, Shared)
    {
        var azureServices = {};
        
        azureServices.resource = $resource('/customer/:id/', {id: '@id'},
        {
            recomender:
            {
                method: 'GET',
                url: '/azure/recomender/:id',
            },
        });

        return azureServices;
    }
]);