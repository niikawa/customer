var segmentServices = angular.module("SegmentServices", ["ngResource"]);
segmentServices.factory("Segment", ['$resource', '$http','Utility',
    function($resource, $http, Utility) 
    {
        var segmentServices = {};
        
        segmentServices.resource = $resource('/segment/:id/', {id: '@id'},
        {
            getDoc:
            {
                method: 'GET',
                url: 'segment/getdoc',
            },
            saveDoc:
            {
                method: 'POST',
                url: 'segment/savedoc',
            },
            save:
            {
                method: 'POST',
                url: 'segment/save',
            },
            download:
            {
                method: 'GET',
                url: 'segment/:id/download',
            },
            remove:
            {
                method: 'DELETE',
                url: 'segment/remove/:id/:segment_document_id',
            },
            executeQuery:
            {
                method: 'POST',
                url: 'segment/execute',
            },
            useSegment:
            {
                method: 'POST',
                url: '/segment/query/use',
            }
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
        
        segmentServices.setWhereProp = function(list, initializeData)
        {
            if (void 0 === initializeData)
            {
                angular.forEach(list, function(v, k)
                {
                    v.where = 'AND';
                });
            }
            else
            {
                angular.forEach(list, function(v, k)
                {
                    var value = (null === initializeData[k]) ? 'AND' : initializeData[k];
                    v.where = value;
                });
            }
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
        };
        
        segmentServices.createExecuteInfo = function(list)
        {
            var qIds = [];
            var where = {};
            var tables = {};
            
            angular.forEach(list, function(v, k)
            {
                qIds.push(v.id);
                where[v.id] = v.where;
                Object.keys(v.tables).forEach(function(key)
                {
                    if (!tables.hasOwnProperty(key))
                    {
                        tables[key] = key;
                    }
                });
            });
            return {qIds: qIds, tables: tables, conditionMap: where};
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
            var where = [];
            angular.forEach(list, function(v, k)
            {
                sql += '(' + v.sql + ') ' ;
                if (last !== k) sql += v.where;
                ids.push(v.id);
                where.push(v.where);
            });
            
            return {condition: sql, qIds: ids, whereList: where};
        };
   
        return segmentServices;
    }
]);