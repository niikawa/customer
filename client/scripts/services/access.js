var accessServices = angular.module("AccessServices", ["ngResource"]);
accessServices.factory("Access", ['$resource','Utility',
    function($resource, Utility) 
    {
        var accessServices = {};
        
        accessServices.resource = $resource('/access/');
        return accessServices;
    }
]);