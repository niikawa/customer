var segmentServices = angular.module("SegmentServices", ["ngResource"]);
segmentServices.factory("Segment", ['$resource','Utility',
    function($resource, Utility) 
    {
        var segmentServices = {};
        
        segmentServices.resource = $resource('/segment/:id/', {id: '@id'},
        {
            createDoc:
            {
                method: 'POST',
                url: 'segment/createdoc',
            },
            create:
            {
                method: 'POST',
                url: 'segment/create',
            },
            refresh:
            {
                method: 'GET',
                url: 'segment/refresh/:id',
                cache: true,
            },
            download:
            {
                method: 'GET',
                url: 'segment/download/:id',
                cache: true,
            },
        });
        
        segmentServices.pageProp = function(id)
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
        
        segmentServices.setWhereProp = function(list)
        {
            angular.forEach(list, function(v, k)
            {
                v.where = 'AND';
            });
        };
        
        segmentServices.createSQL = function(list)
        {
            var sql = 'WHERE ';
            var last = list.length -1;
            angular.forEach(list, function(v, k)
            {
                sql += '(' + list.sql + ') ' ;
                if (last !== k) sql += list.where;
            });
            return sql;
        };
        
        segmentServices.mock = function()
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

        return segmentServices;
    }
]);