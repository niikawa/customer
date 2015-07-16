var sharedServices = angular.module("myApp");
sharedServices.service('Shared', function()
{
    var sharedServices = {};
    var data = {};
    
    sharedServices.set = function(name, value)
    {
        data[name] = value;
    };
    
    sharedServices.setRoot = function(value)
    {
        if (!data.hasOwnProperty('applicationAccsessRoot'))
        {
            data['applicationAccsessRoot'] = [];
        }
        data['applicationAccsessRoot'].push(value);
    };
    sharedServices.getRoot = function(value)
    {
        return data['applicationAccsessRoot'];
    };
    
    sharedServices.get = function(name) {
        return data[name];
    };
    
    sharedServices.destloyByName = function(name)
    {
        delete data[name];
    };

    sharedServices.destloy = function()
    {
        data = [];
    };

    return sharedServices;
});
