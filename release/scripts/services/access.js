var accessServices = angular.module("AccessServices", ["ngResource"]);
accessServices.factory("Access", ['$resource','Utility',
    function($resource, Utility) 
    {
        var accessServices = {};
        
        accessServices.resource = $resource('/access/', {}, 
        {
            day: 
            {
                method:"POST",
                url: "/access"
            },
            dayByUser: 
            {
                method:"POST",
                url: "/access/user"
            }
        });
        return accessServices;
    }
]);