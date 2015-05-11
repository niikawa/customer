var projectServices = angular.module("ProjectServices", ["ngResource"]);
projectServices.factory("Project", ['$resource','Utility',
    function($resource, Utility) 
    {
        var projectServices = {};
        
        projectServices.resource = $resource('https://api-gozaru9.c9.io/V1/project/:siteid/:pid', {siteid: '@siteid', pid: '@pid'},
        {
            removeProject: {
                method: 'POST',
                url: 'https://api-gozaru9.c9.io/V1/project/:siteid/remove',
            }
        });

        return projectServices;
    }
]);