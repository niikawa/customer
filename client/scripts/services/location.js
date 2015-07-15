/**
 * 共通サービス
 * 
 * @author niikawa
 */
var locationServices = angular.module("myApp");
locationServices.service("Location", ['$location',function($location)
{
    var locationServices = {};
    
    locationServices.home = function()
    {
        $location.path('/');
    };
    
    locationServices.user = function()
    {
        $location.path('/user');
    };

    locationServices.query = function()
    {
        $location.path('/query');
    };

    locationServices.querySet = function()
    {
        $location.path('/query/set');
    };

    locationServices.querySave = function()
    {
        $location.path('/query/save');
    };

    locationServices.segment = function()
    {
        $location.path('/segment');
    };

    locationServices.segmentControl = function(id)
    {
        $location.path('/segment/control/'+id);
    };

    locationServices.trigger = function()
    {
        $location.path('/scenario/trigger');
    };

    locationServices.schedule = function()
    {
        $location.path('/scenario/schedule');
    };

    return locationServices;

}]);