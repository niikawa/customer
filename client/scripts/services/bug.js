var bugServices = angular.module("BugServices", ["ngResource"]);
bugServices.factory("Bug", ['$resource','Utility', 'Upload',
    function($resource, Utility, Upload) 
    {
        var bugServices = {};
        
        bugServices.categoryList = 
        [
            {name: 'ダッシュボード', type: 1},
            {name: 'トリガーシナリオ管理', type: 2},
            {name: 'スケジュールシナリオ管理', type: 3},
            {name: 'セグメント管理', type: 4},
            {name: 'クエリー管理', type: 5},
            {name: 'アプローチ管理', type: 6},
            {name: 'ユーザー管理', type: 7},
            {name: '操作履歴', type: 8},
            {name: 'その他', type: 99},
        ];

        bugServices.resource = $resource('/bug/', {}, 
        {
            getByConditon:
            {
                method:"POST",
                url: "/bug"
            },
            resolve:
            {
                method:"GET",
                url: "/bug/resolve/:id"
            },
            save: 
            {
                method:"POST",
                url: "/bug/save"
            },
            saveComment: 
            {
                method:"POST",
                url: "/bug/save/comment"
            },
            getComment: 
            {
                method:"GET",
                url: "/bug/comment/:id"
            },
            vote:
            {
                method:"GET",
                url: "/bug/vote/:id"
            },
            download:
            {
                method:"GET",
                url: "/bug/download/:id"
            },
        });
        
        bugServices.commentSaveAndUpload = function(file, parameter, callback)
        {
            Upload.upload(
            {
                "url":"/bug/save/comment/upload/",
                file: file,
                data: {data: parameter},
            }).success(function(result, status, headers, config)
            {
                callback(null);
                
            }).error(function()
            {
                callback("通信エラー");
            });
        };
        
        bugServices.saveAndUpload = function(file, parameter, callback)
        {
            Upload.upload(
            {
                "url":"/bug/save/upload/",
                file: file,
                data: {data: parameter},
            }).success(function(result, status, headers, config)
            {
                callback(null);
                
            }).error(function()
            {
                callback("通信エラー");
            });
        };
        
        bugServices.addViewInfo = function(list)
        {
            angular.forEach(list, function(item)
            {
                switch (item.category)
                {
                    case 1:
                        item.category_name = 'ダッシュボード';
                        break;
                    case 2:
                        item.category_name = 'トリガーシナリオ管理';
                        break;
                    case 3:
                        item.category_name = 'スケジュールシナリオ管理';
                        break;
                    case 4:
                        item.category_name = 'セグメント管理';
                        break;
                    case 5:
                        item.category_name = 'クエリー管理';
                        break;
                    case 6:
                        item.category_name = 'アプローチ管理';
                        break;
                    case 7:
                        item.category_name = 'ユーザー管理';
                        break;
                    case 8:
                        item.category_name = '操作履歴';
                        break;
                    default:
                        item.category_name = 'その他';
                }
                item.type_name = (1 === item.type) ? '要望' : 'バグ';
                item.resolve_name = (1 === item.resolve) ? '解決' : '未解決';
            });
        };

        return bugServices;
    }
]);