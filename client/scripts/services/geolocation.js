var geoServices = angular.module("GeoServices", ["ngResource"]);
geoServices.factory("GEO", ['$resource', '$http','Shared', 'Utility',
    function($resource, $http, Shared, Utility)
    {
        var geoServices = {};
        
        function initialize()
        {
            if (! navigator.geolocation)
            {
                //つかえないメッセージをどこにだそう？
                Utility.errorSticky('ご利用のブラウザでは位置情報を取得できません。');
                return false;
            }
            return true;
        }
        
        function createGoogleMap(latitude, longitude)
        {
            alert(latitude);
            alert(longitude);
            new GMaps({
                div: '#map',
                lat: latitude,
                lng: longitude,
                 markers: [
                    {lat: latitude, lng: longitude},
                    {lat: latitude, lng: longitude,
                      size: 'small'},
                    {lat: latitude, lng: longitude,
                      color: 'blue'}
                  ]                
            });            
        }
        
        geoServices.getMyposition = function()
        {
            initialize();
            navigator.geolocation.getCurrentPosition(
            function(position)
            {
                createGoogleMap(position.coords.latitude, position.coords.longitude);
            },
            function(error)
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
            });
        };
        
        // geoServices.resource = $resource('/customer/:id/', {id: '@id'},
        // {
        //     recomender:
        //     {
        //         method: 'GET',
        //         url: '/azure/recomender/:id',
        //     },
        // });

        return geoServices;
    }
]);