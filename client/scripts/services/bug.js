var bugServices = angular.module("BugServices", ["ngResource"]);
bugServices.factory("Bug", ['$resource','Utility',
    function($resource, Utility) 
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
            save: 
            {
                method:"POST",
                url: "/bug"
            },
        });

        return bugServices;
    }
]);