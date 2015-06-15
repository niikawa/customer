var mailServices = angular.module("myApp");
mailServices.service("Mail", ['$resource',
    function($resource) 
    {
        var mailServices = {};
        
        mailServices.resource = $resource('https://api-gozaru9.c9.io/V1/mail/:site/', {site: '@site'});

        return mailServices;
    }
]);