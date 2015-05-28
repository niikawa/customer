var azureServices = angular.module("AzureServices", ["ngResource"]);
azureServices.factory("Azure", ['$resource', '$http','Shared',
    function($resource, $http, Shared)
    {
        var azureServices = {};
        
        azureServices.resource = $resource('/customer/:id/', {id: '@id'},
        {
            recomender:
            {
                method: 'POST',
                url: 'azure/recomender/',
                cache: true,
            },
        });

        return azureServices;
    }
]);