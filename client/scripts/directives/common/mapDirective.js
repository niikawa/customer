/**
 * マップを生成する
 * 
 * 
 */
var myApp = angular.module('myApp');
myApp.directive('mapDirective', [ 'Utility' ,function(Utility){
    return {
        restrict: 'AE',
        scope:{
            mapClass: '@',
        },
        link: function (scope, element, attrs) 
        {
            
            console.log(attrs.id);
            
            if (void 0 === attrs.id) return false;
            
            element.addClass(scope.mapClass); 
            
            if (!navigator.geolocation)
            {
                Utility.errorSticky('ご利用のブラウザでは位置情報を取得できません。');
                return false;
            }

            navigator.geolocation.getCurrentPosition(createGoogleMap, error);
            
            function createGoogleMap(position)
            {
                var map = new GMaps({
                    div: '#' + element.attrs('id'),
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
                map.addMarker(
                {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    title: '現在地',
                });
                map.drawOverlay({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    content: '<div class="overlay">現在地</div>'
                });            
            }
            
            function error(error)
            {
                var message = "";
                
                switch (error.code) {
                
                  // 位置情報が取得できない場合
                  case error.POSITION_UNAVAILABLE:
                    message = "位置情報の取得ができませんでした。";
                    break;
                
                  // Geolocationの使用が許可されない場合
                  case error.PERMISSION_DENIED:
                    message = "位置情報取得の使用許可がされませんでした。";
                    break;
                
                  // タイムアウトした場合
                  case error.PERMISSION_DENIED_TIMEOUT:
                    message = "位置情報取得中にタイムアウトしました。";
                    break;         
                }
                
                Utility.errorSticky(message);
            }
            
        }
    };
}]);