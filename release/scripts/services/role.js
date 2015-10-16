var roleServices = angular.module("RoleServices", ["ngResource"]);
roleServices.factory("Role", ['$resource','Utility',
    function($resource, Utility) 
    {
        var roleServices = {};
        
        roleServices.resource = $resource('/role/:id', {id: '@id'}, {});

        return roleServices;
    }
]);