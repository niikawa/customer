var bugServices = angular.module("BugServices", ["ngResource"]);
bugServices.factory("Bug", ['$resource','Utility',
    function($resource, Utility) 
    {
        var bugServices = {};
        
        bugServices.resource = $resource('/bug/', {}, 
        {
            save: 
            {
                method:"POST",
                url: "/bug"
            },
        });
        return bugServices;
    }
]);