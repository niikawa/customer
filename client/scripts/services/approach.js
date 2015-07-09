var approachServices = angular.module("ApproachServices", ["ngResource"]);
approachServices.factory("Approach", ['$resource','Utility',
    function($resource, Utility) 
    {
        var approachServices = {};
        
        approachServices.resource = $resource('/approach/');
        
        approachServices.pageProp = function(id)
        {
            
            if (void 0 === id)
            {
                return {
                    viewMode: 1,
                    pageTitle: '登録'
                };
            }
            else
            {
                return {
                    viewMode: 2,
                    pageTitle: '更新'
                };
            }
        };

        return approachServices;
    }
]);