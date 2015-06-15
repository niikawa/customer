var socketServices = angular.module("myApp");
socketServices.service('Socket', function($rootScope)
{
    var socketServices = {};
    var socket = io.connect();
    
    socketServices.on = function(eventName, callback)
    {
        socket.on(eventName, function()
        {
            var args = arguments;
            $rootScope.$apply(function()
            {
                callback.apply(socket, args);
            });
        });
    };

    socketServices.emit = function(eventName, data,callback)
    {
        socket.emit(eventName, data, function()
        {
            var args = arguments;
            $rootScope.$apply(function()
            {
                callback.apply(socket, args);
            });
        });
    };
    
    return socketServices;
});