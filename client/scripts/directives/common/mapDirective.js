/**
 * 
 */
var myApp = angular.module('myApp');
myApp.directive('mapDirective', [ 'Utility' ,function(Utility){
    return {
        restrict: 'E',
        scope:{
            mapClass: '@',
        },
        link: function (scope, element, attrs) 
        {
            element.addClass(scope.mapClass); 
            if (! navigator.geolocation)
            {
                //つかえないメッセージをどこにだそう？
                Utility.errorSticky('ご利用のブラウザでは位置情報を取得できません。');
                return false;
            }
            return true;
            
            
            
            
        }
    };
}]);