var customerServices = angular.module("CustomerServices", ["ngResource"]);
customerServices.factory("Customer", ['$resource','Utility',
    function($resource, Utility) 
    {
        var customerServices = {};
        
        customerServices.resource = $resource('/customer/:id/', {id: '@id'});

        return customerServices;
    }
]);