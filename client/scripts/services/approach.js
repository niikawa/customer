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

        approachServices.getInfomation = function(id)
        {
            var info = {};
            if (1 === id)
            {
                info.title = '1日の制限回数について';
                info.message = '対象の顧客に対して1日に抽出対象とする回数';
            }
            else if (2 === id)
            {
                info.title = '1週間の制限回数について';
                info.message = '対象の顧客に対して1週間に抽出対象とする回数';
            }
            return info;
        };
        
        return approachServices;
    }
]);