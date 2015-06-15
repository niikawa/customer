var approachServices = angular.module("ApproachServices", ["ngResource"]);
approachServices.factory("Approach", ['$resource','Utility',
    function($resource, Utility) 
    {
        var approachServices = {};
        
        approachServices.resource = $resource('/scenario/:id/', {id: '@id'},
        {
            refresh:
            {
                method: 'GET',
                url: 'scenario/refresh/:id',
                cache: true,
            },
            download:
            {
                method: 'GET',
                url: 'scenario/download/:id',
                cache: true,
            },
        });
        
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
        
        approachServices.mock = function()
        {
            var download = function(id)
            {
                return id;
            };
            
            var refresh = function(id)
            {
                return id;
            };
            
            var queryData = [
                {query_id: 1, query_name: '会員ID'},
                {query_id: 2, query_name: '会員ランク'},
                {query_id: 3, query_name: 'ブラック会員'},
                {query_id: 4, query_name: '最終ログイン日からの経過日数'},
                {query_id: 5, query_name: '最終購買日からの経過日数'}
            ];

            var data = [
                    {segment_id: 1, segment_name:'メルマガ配信対象',update_date:'2015-06-10', status:"削除"},
                    {segment_id: 2, segment_name:'直近30日以内購入の男性',update_date:'2015-06-10', status:"削除"}];
                    
                    
            return {
                download: download,refresh: refresh,data : data, queryData: queryData
            };
        };

        return approachServices;
    }
]);