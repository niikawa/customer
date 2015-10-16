/**
 * マップを生成する
 * 
 * 
 */
'use strict';

var myApp = angular.module('myApp');
myApp.directive('mapDirective', ['Utility', function (Utility) {
    return {
        restrict: 'AE',
        scope: {
            mapClass: '@',
            overlayClass: '@'
        },
        // compile: function(element, attrs) {

        //     //JS読み込みたいな
        //     // <script src="http://maps.google.com/maps/api/js?sensor=true&libraries=places"></script>
        //     // <script src="vendor/map/gmaps.js"></script>

        // },
        link: function link(scope, element, attrs) {
            if (void 0 === attrs.id) return false;

            if (!navigator.geolocation) {
                Utility.errorSticky('ご利用のブラウザでは位置情報を取得できません。');
                return false;
            }

            element.addClass(scope.mapClass);

            navigator.geolocation.getCurrentPosition(createGoogleMap, error);

            function createGoogleMap(position) {
                var map = new GMaps({
                    div: '#' + attrs.id,
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    zoom: 18
                });
                map.addMarker({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    animation: google.maps.Animation.BOUNCE,
                    click: function click(lat, lng) {
                        var geocoder = new google.maps.Geocoder();
                        var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

                        geocoder.geocode({ 'latLng': latlng }, function (results, status) {
                            if (status == google.maps.GeocoderStatus.OK) {
                                if (results[1]) {
                                    Utility.info(results[1].formatted_address);
                                    map.setZoom(17);
                                } else {
                                    Utility.warning('対象の住所は存在しません');
                                }
                            } else {
                                Utility.warning('対象の住所は存在しません');
                            }
                        });
                    }
                });
            }

            function error(error) {
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
