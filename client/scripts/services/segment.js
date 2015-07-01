var segmentServices = angular.module("SegmentServices", ["ngResource"]);
segmentServices.factory("Segment", ['$resource','Utility',
    function($resource, Utility) 
    {
        var segmentServices = {};
        
        segmentServices.resource = $resource('/segment/:id/', {id: '@id'},
        {
            getDoc:
            {
                method: 'GET',
                url: 'segment/getdoc',
            },
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
            remove:
            {
                method: 'DELETE',
                url: 'segment/remove/:id/:docId',
                cache: true,
            },
            executeQuery:
            {
                method: 'POST',
                url: 'segment/execute',
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
        
        segmentServices.setListData = function(queryList, queryIdList, conditionList)
        {
            angular.forEach(queryIdList, function(qid, k1)
            {
                angular.forEach(queryList, function(query, k2)
                {
                    if (qid == query.id)
                    {
                        conditionList.push(query);
                        queryList.splice(k2, 1);
                    }
                });
            });
            
            console.log(conditionList);
        };
        
        segmentServices.createExecuteInfo = function(list)
        {
            var sql = '';
            var tables = {};
            var last = list.length -1;
            angular.forEach(list, function(v, k)
            {
                sql += '(' + v.sql + ') ' ;
                if (last !== k) sql += v.where;
                Object.keys(v.tables).forEach(function(key)
                {
                    if (!tables.hasOwnProperty(key))
                    {
                        tables[key] = key;
                    }
                });
            });
            return {'condition': sql, tables: tables};
        };
        
        segmentServices.createSQL = function(list)
        {
            var sql = '';
            var last = list.length -1;
            angular.forEach(list, function(v, k)
            {
                sql += '(' + v.sql + ') ' ;
                if (last !== k) sql += v.where;
            });
            return sql;
        };
        
        segmentServices.getTables = function(list)
        {
            var tables = {};
            angular.forEach(list, function(v, k)
            {
                Object.keys(v.tables).forEach(function(key)
                {
                    if (!tables.hasOwnProperty(key))
                    {
                        tables[key] = key;
                    }
                });
            });
            
            return tables;
        };
        
        segmentServices.createDocData = function(list)
        {
            var sql = '';
            var last = list.length -1;
            var ids = [];
            angular.forEach(list, function(v, k)
            {
                sql += '(' + v.sql + ') ' ;
                if (last !== k) sql += v.where;
                ids.push(v.id);
            });
            
            return {sql: sql, qIds: ids};
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