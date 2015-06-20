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

    return locationServices;

}]);