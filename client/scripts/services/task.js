var taskServices = angular.module("TaskServices", ["ngResource"]);
taskServices.factory("Task", ['$resource','Utility',
    function($resource, Utility) 
    {
        var taskServices = {};
        
        taskServices.id;
        taskServices.cid;
        taskServices.progress;
        taskServices.comment;
        
        taskServices.resource = $resource('https://api-gozaru9.c9.io/V1/tasks/:id/:tid', {id: '@id', tid:'@tid'}, 
        {
            commentList:
            {
                method: 'GET',
                url: 'https://api-gozaru9.c9.io/V1/tasks/:tid/comment',
                cache: true,
            },
            comment:
            {
                method: 'POST',
                url: 'https://api-gozaru9.c9.io/V1/tasks/:tid/comment/:cid/',
                cache: true,
            },
            progress:
            {
                method: 'POST',
                url: 'https://api-gozaru9.c9.io/V1/tasks/progress',
            },
            line:
            {
                method: 'POST',
                url: 'https://api-gozaru9.c9.io/V1/tasks/line',
            },
        });

        return taskServices;
    }
]);