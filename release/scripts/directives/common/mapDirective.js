/**
 * マップを生成する
 * 
 * 
 */
var myApp = angular.module('myApp');
myApp.directive('mapDirective', [
  'Utility',
  function (Utility) {
    return {
      restrict: 'AE',
      scope: {
        mapClass: '@',
        overlayClass: '@'
      },
      link: function (scope, element, attrs) {
        if (void 0 === attrs.id)
          return false;
        if (!navigator.geolocation) {
          Utility.errorSticky('\u3054\u5229\u7528\u306e\u30d6\u30e9\u30a6\u30b6\u3067\u306f\u4f4d\u7f6e\u60c5\u5831\u3092\u53d6\u5f97\u3067\u304d\u307e\u305b\u3093\u3002');
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
            click: function (lat, lng) {
              var geocoder = new google.maps.Geocoder();
              var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
              geocoder.geocode({ 'latLng': latlng }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                  if (results[1]) {
                    Utility.info(results[1].formatted_address);
                    map.setZoom(17);
                  } else {
                    Utility.warning('\u5bfe\u8c61\u306e\u4f4f\u6240\u306f\u5b58\u5728\u3057\u307e\u305b\u3093');
                  }
                } else {
                  Utility.warning('\u5bfe\u8c61\u306e\u4f4f\u6240\u306f\u5b58\u5728\u3057\u307e\u305b\u3093');
                }
              });
            }
          });
        }
        function error(error) {
          var message = '';
          switch (error.code) {
          // 位置情報が取得できない場合
          case error.POSITION_UNAVAILABLE:
            message = '\u4f4d\u7f6e\u60c5\u5831\u306e\u53d6\u5f97\u304c\u3067\u304d\u307e\u305b\u3093\u3067\u3057\u305f\u3002';
            break;
          // Geolocationの使用が許可されない場合
          case error.PERMISSION_DENIED:
            message = '\u4f4d\u7f6e\u60c5\u5831\u53d6\u5f97\u306e\u4f7f\u7528\u8a31\u53ef\u304c\u3055\u308c\u307e\u305b\u3093\u3067\u3057\u305f\u3002';
            break;
          // タイムアウトした場合
          case error.PERMISSION_DENIED_TIMEOUT:
            message = '\u4f4d\u7f6e\u60c5\u5831\u53d6\u5f97\u4e2d\u306b\u30bf\u30a4\u30e0\u30a2\u30a6\u30c8\u3057\u307e\u3057\u305f\u3002';
            break;
          }
          Utility.errorSticky(message);
        }
      }
    };
  }
]);