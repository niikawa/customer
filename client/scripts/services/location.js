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

    return locationServices;

}]);