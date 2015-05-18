var azureServices = angular.module("AzureServices", ["ngResource"]);
azureServices.factory("Azure", ['$resource', '$http','Shared',
    function($resource, $http, Shared)
    {
        var azureServices = {};
        
        azureServices.test = function(data1,data2,data3)
        {
            var key = '4iPyBGgZC9sXPL9Dvk8eynKhQWsBPwZ/mJ3/eKCxIj5gZs+VIDHtQbVlEO7Ery2wuLZh/Mq4qJjCnHuPW7Xogg==';
            var config = {headers: {Authorization: 'Bearer '+ key}};
            var param = {
                Inputs:{
                    input1:{
                        ColumnNames: [ "純広告","リスティング","CV_純広告","CV_リスティング"],
                        Values: [data1, data2, data3, 0]
                    }
                }
            };
            var url = 'https://ussouthcentral.services.azureml.net/workspaces/bb07a48a7dce4617b33d3a20dd4e2604/services/c43a39e8bf454632a00268bbae4c580f/execute?api-version=2.0&details=true';
            url += '&callback=JSON_CALLBACK';

            var promise = $http.jsonp(url, config).success(function(data, status, headers, config)
            {
                console.log('success');
                console.log(data);
            }
            ).error(function(data, status, headers, config)
            {
                console.log('err');
                console.log(data);
                console.log(status);
                console.log(headers);
                console.log(config);
            });
            return promise;
        };

        return azureServices;
    }
]);