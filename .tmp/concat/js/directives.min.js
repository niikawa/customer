var myApp = angular.module('myApp');
myApp.controller('HeadCtrl',['$scope', 'Auth', 'Modal', 'Shared', 'Mail', function ($scope, Auth, Modal, Shared, Mail)
{
    $scope.initialize = function()
    {
        if (1 == Shared.get("role"))
        {
            $scope.isShowUser = true;
        }
        else
        {
            $scope.isShowUser = false;
        }
    };
    
    $scope.addMenber = function()
    {
        $scope.modalParam = 
        {
            mailaddress:'',
            execute: sendMail,
        };
        $scope.modalInstance = Modal.open($scope, "partials/memberAdd.html");
    };
    
    $scope.logout = function()
    {
        Shared.destloy();
        Auth.logout().then(function()
        {
            $('#view').addClass('view-animate-container-wide');
            $('#view').removeClass('view-animate-container');
            $scope.$emit('logoutConplete');
        });
    };
    
    var sendMail = function()
    {
        Mail.resource.save({site: 'niikawa'}).$promise.then(function()
        {
            $scope.modalInstance.close();
        });
    };
}]);

myApp.directive('myHeader', function(){
    return {
        restrict: 'E',
        replace: true,
        controller: 'HeadCtrl',
        templateUrl: 'partials/common/header.html',
        link: function (scope, element, attrs, ctrl) 
        {
            scope.isOpenMenu = true;
            $('#view').removeClass('view-animate-container-wide');
            $('#view').addClass('view-animate-container');

            scope.openClose = function()
            {
                scope.isOpenMenu = !scope.isOpenMenu;
                if (scope.isOpenMenu)
                {
                    $('#view').removeClass('view-animate-container-wide');
                    $('#view').addClass('view-animate-container');
                }
                else
                {
                    $('#view').removeClass('view-animate-container');
                    $('#view').addClass('view-animate-container-wide');
                }
            };
            
        }
    };
});


/**
 * オートコンプリートディレクティブ
 * 
 * [属性]
 * selectedItem : コントローラー側と選択した値のバインド用
 * itemList     : リスト表示用のデータ
 * 
 * [使用方法]
 * <auto-complete-directive item-list="trackerList" selected-item="ticketModel.tracker" ></auto-complete-directive>
 * 
 * @module autoCompleteDirective
 * @author niikawa
 */
var myApp = angular.module('myApp');
myApp.directive('autoCompleteDirective', function()
{
    return {
        restrict: 'E',
        scope: {selectedItem: '=', itemList: '=', execute: '&', namePropertie: '@', appendString: '@', showLabel: '=', selectByList: '=', selectName: '='},
        template:   '<form class="navbar-form navbar-left"><input ng-show="!isLabel" class="form-control d-complete-input" ng-model="selectName">' +
                    '<span ng-show="isLabel && selectName.length != 0" ng-click="changeElement()">{{appendString}}{{selectName}}</span>' +
                    '<ul class="complete-list" ng-show="isFocus">' +
                    '<li ng-repeat="item in itemList" ng-click="click($event, item)" >' +
                    '{{item[namePropertie]}}' +
                    '</li>' +
                    '</ul></form>',
        replace: true,
        link: function (scope, element, attrs) 
        {
            scope.selectName = '';
            scope.isFocus = false;
            scope.isLabel = false;
            var originList = [];
            scope.$watch('itemList', function(newValue, oldValue)
            {
                if (void 0 !== newValue && void 0 !== oldValue)
                {
                    console.log('watch itemList');
                    if (newValue.length === oldValue.length)
                    {
                        return false;
                    }
                    if (newValue.length > oldValue.length)
                    {
                        originList = angular.copy(newValue);
                    }
                    else if (newValue.length < oldValue.length)
                    {
                        originList = angular.copy(oldValue);
                    }
                }
                else
                {
                    if (void 0 !== scope.itemList)
                    {
                        console.log('set initialize data');
                        angular.copy(scope.itemList, originList);
                    }
                }
            });

            /**
             * 要素のインプットにフォーカが合った場合にリストを表示する
             * 
             * @author niikawa
             */
            element.find('input').on('focus', function()
            {
                if (0 < scope.itemList.length)
                {
                    scope.$apply(function ()
                    {
                        scope.isFocus = true;
                    });
                }
            });
            
            /**
             * 要素のインプットからにフォーカが外れた場合にリストを非表示する
             * 
             * @author niikawa
             */
            element.find('input').on('blur', function()
            {
                var hide = setInterval(function(isExist)
                {
                    scope.$apply(function ()
                    {
                        if (scope.selectByList)
                        {
                            var num = originList.length;
                            var isExist = scope.selectName.length === 0 ? true : false;
                            for (var i = 0; i < num; i++)
                            {
                                if (scope.selectName === originList[i][scope.namePropertie])
                                {
                                    isExist = true;
                                    break;
                                }
                            }
                            
                            if (isExist)
                            {
                                element.find('input').removeClass('auto-complete-item-error');
                            }
                            else
                            {
                                element.find('input').addClass('auto-complete-item-error');
                            }
                            scope.isFocus = false;
                        }
                    });
                    clearInterval(hide);
                }, 300);
            });
            
            /**
             * 入力文字に合致した選択肢を表示する
             * 
             * @author niikawa
             */
            element.find('input').on('keyup', function()
            {
                if (0 === originList.length)
                {
                    angular.copy(scope.itemList, originList);
                }
                var createList = [];

                if (0 < scope.itemList.length)
                {
                    scope.isFocus = true;
                }
                if (scope.selectName.length === 0)
                {
                    angular.copy(originList, createList);
                }
                else
                {
                    var num = originList.length;
                    for (var i = 0; i < num ; i++)
                    {
                        if (originList[i][scope.namePropertie].indexOf(scope.selectName) !== -1)
                        {
                            createList.push(angular.copy(originList[i]));
                        }
                    }
                }
                scope.$apply(function ()
                {
                    angular.copy(createList, scope.itemList);
                });
            });
            
            /**
             * 選択肢がクリックされた時に実行され、選択したアイテムを
             * selectedItemに格納する
             * 
             * @event click
             * @author niikawa
             * @param {object} $event イベント
             * @param {string} item   選択したアイテム
             */
            scope.click = function ($event, item) 
            {
                //イベントが伝搬しないように制御
                $event.preventDefault();
                $event.stopPropagation();
                
                angular.copy(item, scope.selectedItem);
                element.find('input').removeClass('auto-complete-item-error');
                scope.isFocus = false;
                if (void 0 !== scope.execute)
                {
                    scope.execute();
                }
                if (scope.showLabel) scope.isLabel = true;
                scope.selectName = item[scope.namePropertie]; 
            };
            
            /**
             * spanからinputに変更する
             * 
             * @event click
             * @author niikawa
             */
            scope.changeElement = function()
            {
                angular.copy(originList, scope.itemList);
                scope.isLabel = false;
                element.find('input').focus();
            };
        }
    };
});
var myApp = angular.module('myApp');
myApp.directive('spinnerDirective', function()
{
    return {
        restrict: 'E',
        scope: {is: '=', src: '@'},
        template: '<div ng-show="is"><img ng-src="{{src}}"></div>',
        link: function (scope, element, attrs) 
        {
        }
    };
});
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
            overlayClass: '@',
        },
        // compile: function(element, attrs) {
            
        //     //JS読み込みたいな
        //     // <script src="http://maps.google.com/maps/api/js?sensor=true&libraries=places"></script>
        //     // <script src="vendor/map/gmaps.js"></script>
            
            
        // },
        link: function (scope, element, attrs) 
        {
            if (void 0 === attrs.id) return false;
            
            if (!navigator.geolocation)
            {
                Utility.errorSticky('ご利用のブラウザでは位置情報を取得できません。');
                return false;
            }

            element.addClass(scope.mapClass); 

            navigator.geolocation.getCurrentPosition(createGoogleMap, error);
            
            function createGoogleMap(position)
            {
                var map = new GMaps({
                    div: '#' + attrs.id,
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    zoom: 18,
                });
                map.addMarker(
                {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    animation: google.maps.Animation.BOUNCE,
                    click: function(lat, lng)
                    {
                        var geocoder = new google.maps.Geocoder();
                        var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

                        geocoder.geocode({'latLng': latlng}, function(results, status)
                        {
                            if (status == google.maps.GeocoderStatus.OK)
                            {
                                if (results[1])
                                {
                                    Utility.info(results[1].formatted_address);
                                    map.setZoom(17);
                                }
                                else
                                {
                                    Utility.warning('対象の住所は存在しません');
                                }
                            }
                            else
                            {
                                Utility.warning('対象の住所は存在しません');
                            }
                          });
                    }
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
var myApp = angular.module('myApp');
myApp.directive('drawerMenuDirective', function()
{
    return {
        restrict: 'E',
        scope: {menuList: '=', position: '@'},
        template: '<nav class="hi-icon-effect-8 drawer-menu">'
                    +'<a ng-repeat="item in itemList" style="{{item.style}}" class="drawer-menu-item" ng-href={{item.link}}>'+
                    '<i ng-if="item.fa" class="fa {{item.fa}} fa-3x"></i>'+
                    '<span ng-if="item.s">{{item.s}}</span>'+
                    '</a>'+
                    '</nav>',
        link: function (scope, element, attrs) 
        {
            if (void 0 === scope.menuList)
            {
                console.log(scope.menuList);
            }
            
            //config
            var pi = 3.14;
            var openingAngle = pi - .2;
            var menuItemsNum = 5;
            
            //実行タイプ
            var type = 1;
            
            //表示対象
            var targetWidth = 50;

            //cssクラス
            var openButtonClass = 'fa-bars';
            var closeButtonClass = 'fa-times';
            
            //座標
            var x = 0;
            var y = 0;
            
            //描画
            var durbase = 1000;

            scope.itemList = [];
            scope.isOpen = false;
            var openItem = {fa: openButtonClass, link: '', style: '#/'};
            scope.itemList.push(openItem);
            
            element.on('click', function()
            {
                scope.$apply(function()
                {
                    if (scope.isOpen)
                    {
                        scope.itemList[0].fa = openButtonClass;
                        scope.itemList.splice(1, scope.itemList.length-1);
                        
                        if (1 === type)
                        {
                            scope.itemList[0].style = 'transform: translate(0);';
                        }
                        element.children('nav').addClass('drawer-menu-right');
                        element.children('nav').removeClass('drawer-menu-center');
                    }
                    else
                    {
                        scope.itemList[0].fa = closeButtonClass;
                        element.children('nav').removeClass('drawer-menu-right');
                        element.children('nav').addClass('drawer-menu-center');
                        
                        //element.addClass('move');
                        
                        var linkList = ['', '/#/segment', '/#/scenario', '/#/approach', '/#/user'];
                        var sList = ['D', 'SE', 'SC', 'AP', 'US'];

                        if (1 === type)
                        {
                            for (var i = 1; i <= menuItemsNum; i++)
                            {
                                var angle = ((pi - openingAngle)/2)+((openingAngle/(menuItemsNum - 1))*(i - 1));
        
                                x = Math.cos(angle) * 75;
                                y = Math.sin(angle) * 75 - ((i-1) * targetWidth) - targetWidth/2;
                                var dur = durbase+(400*i);
                                var translate = 'transition-timing-function:cubic-bezier(0.935, 0.000, 0.340, 1.330);transition-duration: '+dur+'ms;transform: translate3d(' + x +'px,' + y + 'px, 0);';
                                var add = {s: sList [i-1], link: linkList[i-1],style: translate};
                                scope.itemList.push(add);
                            }
                        }
                        
                        // else if (2 === type)
                        // {
                        //     for (var i = 0; i < 5; i++)
                        //     {
                        //         x = -60;
                        //         y = -60;
                        //         var dur = 1000 +(400*i);
                        //         var translate = 'transition-timing-function:cubic-bezier(0.935, 0.000, 0.340, 1.330);transition-duration: '+dur+'ms;transform: translate3d(' + x +'px,' + y + 'px, 0);';
                        //         var add = {fa: 'fa-dashcube', link: '',style: translate};
                        //         scope.itemList.push(add);
                        //     }
                        // }
                    }
                    scope.isOpen = !scope.isOpen;
                });
            });

        }
    };
});
var dDSharedServices = angular.module("myApp");
dDSharedServices.service('DDShared', function()
{
    var dDSharedServices = {};
    var orverIndex = 0;
    var fromData = {};
    var deforePosistion = 0;
    var isMoveDown = false;

    dDSharedServices.setFrom = function(data)
    {
        fromData = data;
    };
    
    dDSharedServices.getFrom = function()
    {
        return fromData;
    };
    
    dDSharedServices.getFromCopyByIndex = function(index)
    {
        return angular.copy(fromData[index]);
    };

    dDSharedServices.getCopyFrom = function()
    {
        return angular.copy(fromData);
    };

    dDSharedServices.setOrverIndex = function(index)
    {
        orverIndex = index;
    };

    dDSharedServices.getOrverIndex = function()
    {
        return orverIndex;
    };

    dDSharedServices.getBeforePosition = function()
    {
        return deforePosistion;
    };

    dDSharedServices.setBeforePosition = function(num)
    {
        deforePosistion = num;
    };

    dDSharedServices.isMoveDown = function()
    {
        return isMoveDown;
    };

    dDSharedServices.setMove = function(num)
    {
        isMoveDown = (0 < num) ? true : false;
    };

    dDSharedServices.clear = function()
    {
        orverIndex = 0;
        fromData = {};
    };

    return dDSharedServices;
});

var myApp = angular.module('myApp');
myApp.directive('dragItemDirective', ['DDShared', function(DDShared)
{
    return {
        restrict: 'AE',
        transclude: false,
        require: '^ngModel',
        scope: {dragindex: '='},
        link: function (scope, element, attrs, ctrl) 
        {
            element.attr('draggable', true);
            element.attr('data-index', scope.dragindex);
            
            element.on('dragstart', function(event)
            {
                var index = event.target.dataset.index;
                var item = element.html();
                event.originalEvent.dataTransfer.setData('item', item);
                event.originalEvent.dataTransfer.setData('itemIndex', index);
                DDShared.setFrom(ctrl.$modelValue);
                DDShared.setBeforePosition(0);
            });
        }
    };
}]);
myApp.directive('dropDirective', ['DDShared', function(DDShared)
{
    return {
        restrict: 'A',
        scope: {dropLineName: '@'},
        require: '^ngModel',
        link: function (scope, element, attrs, ctrl) 
        {
            var lineName = (void 0 === scope.dropLineName || '' === scope.dropLineName)  ? 'line' : scope.dropLineName;
            
            element.on('dragenter', function(event)
            {
                element.addClass('ui-drop-target');
            });
            
            element.on('dragover', function(event)
            {
                event.preventDefault();
                if (void 0 !== event.target.dataset.index)
                {
                    DDShared.setOrverIndex(event.target.dataset.index);
                    var wholeheight = Math.max.apply(
                        null, 
                        [document.body.clientHeight , document.body.scrollHeight, document.documentElement.scrollHeight, document.documentElement.clientHeight]
                    );
                    var windowHeight = (window.innerHeight||document.body.clientHeight||0);
                    if (wholeheight > windowHeight)
                    {
                        var now = event.target.getBoundingClientRect().top + $(event.target).position().top + 50;
                        var move = 0;
                        if (0 != DDShared.getBeforePosition() && DDShared.getBeforePosition() != now)
                        {
                            var elementHeight = $(event.target).height() + 15;
                            // up : down
                            move =(DDShared.getBeforePosition() > now) ?  -elementHeight : elementHeight;
                            DDShared.setMove(move);
                            DDShared.setBeforePosition(now - (move));
                            $(window).scrollTop($(window).scrollTop()+move);
                            
                        }
                        else
                        {
                            DDShared.setBeforePosition(now);
                        }
                    }
                }
                event.originalEvent.dataTransfer.dropEffect = 'move';
            });
            
            element.on('dragleave', function(event)
            {
                element.removeClass('ui-drop-target');
            });
            
            element.on('drop', function(event)
            {
                event.stopPropagation();
                DDShared.setBeforePosition(0);
                var index = event.originalEvent.dataTransfer.getData('itemIndex');
                var pushItem = {};
                
                var orverIndex = (ctrl.$modelValue.length === 0) ? 0 : DDShared.getOrverIndex();
                if (index === orverIndex) return false;

                if (angular.isArray(DDShared.getFrom()))
                {
                    pushItem = DDShared.getFromCopyByIndex(index);
                    DDShared.getFrom().splice(index, 1);
                }
                else
                {
                    pushItem = DDShared.getCopyFrom();
                }
                
                if (void 0 !== pushItem)
                {
                    ctrl.$modelValue.splice(orverIndex, 0, pushItem);
                }
                
                var len = ctrl.$modelValue.length;

                for (var i=0; i < len; i++)
                {
                    ctrl.$modelValue[i][lineName] = i+1;
                }
                var emitObject = {
                    to:{}, 
                    from:{}, 
                    remove:{}, 
                    isSameContainer:false, 
                    areaKey: attrs.dropAreaKey, 
                    insertLine: orverIndex
                };
                emitObject.to = ctrl.$modelValue;
                emitObject.from = DDShared.getFrom();
                emitObject.remove = pushItem;
                emitObject.isSameContainer = (emitObject.to == emitObject.from);
                scope.$emit('dropItemComplete', emitObject);
                console.log(emitObject);
                scope.$$phase || scope.$apply();
            });
        }
    };
}]);

//完全に画面（データ依存）のため使い回しはできない
myApp.directive('dropJoinDirective', ['DDShared', function(DDShared)
{
    return {
        restrict: 'A',
        scope: {dropJoinIndex: '='},
        require: '^ngModel',
        link: function (scope, element, attrs, ctrl) 
        {
            element.on('dragenter', function(event)
            {
                element.addClass('ui-drop-target');
            });
            element.on('dragover', function(event)
            {
                event.preventDefault();
                if (void 0 !== event.target.dataset.index)
                {
                    DDShared.setOrverIndex(event.target.dataset.index);
                }
                event.originalEvent.dataTransfer.dropEffect = 'move';
            });
            
            element.on('dragleave', function(event)
            {
                element.removeClass('ui-drop-target');
            });
            
            element.on('drop', function(event)
            {
                event.stopPropagation();
                
                if (ctrl.$modelValue == DDShared.getFrom()) return false;

                var index = event.originalEvent.dataTransfer.getData('itemIndex');
                //自分自身へのjoinは禁止
                var pushItem = DDShared.getFromCopyByIndex(index);
                if (void 0 === pushItem) return false;
                
                //固有条件
                var isModelArray = false;
                console.log(ctrl.$modelValue);
                if (angular.isArray(ctrl.$modelValue))
                {
                    //画面別
                    if (ctrl.$modelValue[0].hasOwnProperty('table') 
                        && ctrl.$modelValue[0].hasOwnProperty('column') )
                    {
                        if (ctrl.$modelValue[0].table.physicalname == pushItem[0].table.physicalname 
                            && ctrl.$modelValue[0].column.physicalname == pushItem[0].column.physicalname) return false;
                    }
                    isModelArray = true;
                }
                
                if (angular.isArray(DDShared.getFrom()))
                {
                    DDShared.getFrom().splice(index, 1);
                }
                else
                {
                    pushItem = DDShared.getCopyFrom();
                }
                
                if (ctrl.$modelValue == DDShared.getFrom())
                {
                    console.log(index);
                    //順番を入れ替える
                    ctrl.$modelValue.splice(index, index+1, pushItem, ctrl.$modelValue[index+1]);
                    return false;
                }
                else
                {
                    if (!isModelArray)
                    {
                        var mergeItems = [];
                        mergeItems.push(ctrl.$modelValue);
                        mergeItems.push(pushItem);
                    }
                    else
                    {
                        if (angular.isArray(pushItem))
                        {
                            ctrl.$modelValue.push(pushItem[0]);
                        }
                        else
                        {
                            ctrl.$modelValue.push(pushItem);
                        }
                    }
                }

                if (ctrl.$modelValue.length > 1) 
                {
                    ctrl.$modelValue.isJoin = true;
                }
                else
                {
                    ctrl.$modelValue.isJoin = false;
                }
                console.log(ctrl.$modelValue);
                scope.$$phase || scope.$apply();
//                scope.$emit('dropJoinItemComplete', mergeItems);
                console.log('drop join complete');
            });
        }
    };
}]);

/**
 * 
 */
var myApp = angular.module('myApp');
myApp.directive('pushDirective', function(){
    return {
        restrict: 'A',
        scope:{
            list : '=',
            pushInfo: '=info',
            active: '=',
            activekey: '@',
            multiple: '='
        },
        link: function (scope, element, attrs) 
        {
            element.css({cursor: 'pointer'});
            
            if (void 0 !== scope.active)
            {
                var setActive = false;
                if ("boolean" === typeof(scope.active))
                {
                    scope.pushInfo.isPush = scope.active;
                    setActive = scope.active;
                }
                else if ("string" === typeof(scope.active) || "number" === typeof(scope.active))
                {
                    if (scope.pushInfo[scope.activekey] == scope.active)
                    {
                        scope.pushInfo.isPush = true;
                        setActive = true;
                    }
                }
                if (setActive) element.addClass('push-active');
            }
            else
            {
                scope.pushInfo.isPush = false;
            }

            element.on('click', function()
            {
                scope.$apply(function()
                {
                    if (element.hasClass('push-active'))
                    {
                        scope.pushInfo.isPush = false;
                        element.removeClass('push-active');
                    }
                    else
                    {
                        if (void 0 === scope.multiple || !scope.multiple)
                        {
                            element.parent().children().removeClass('push-active');
                            angular.forEach(scope.list, function(item, key){item.isPush = false;});
                        }
                        scope.pushInfo.isPush = true;
                        element.addClass('push-active');
                    }
                });
            });
        }
    };
});
/**
 * 絞込みディレクティブ
 * 
 * [属性]
 * selectedItem : コントローラー側と選択した値のバインド用
 * itemList     : リスト表示用のデータ
 * 
 * [使用方法]
 * <refine-directive item-list="trackerList" selected-item="ticketModel.tracker" ></refine-directive>
 * 
 * @module refineDirective
 * @author niikawa
 */
var myApp = angular.module('myApp');
myApp.directive('refineDirective', function()
{
    return {
        restrict: 'A',
        scope: {refineItem: '=', namePropertie: '@', keyword: '=', execute: '&', },
        replace: true,
        link: function (scope, element, attrs) 
        {
            var originList = [];

            /**
             * 入力文字に合致した選択肢を表示する
             * 
             * @author niikawa
             */
            element.on('keyup', function()
            {
                if (0 === originList.length)
                {
                    angular.copy(scope.refineItem, originList);
                }
                var createList = [];

                if (void 0 === scope.keyword || scope.keyword.length === 0)
                {
                    angular.copy(originList, createList);
                }
                else
                {
                    var num = originList.length;
                    var nameList = scope.namePropertie.split('|');
                    var pushList = [];
                    var primeKey = Object.keys(originList[0]);

                    for (var i = 0; i < num ; i++)
                    {
                        angular.forEach(nameList, function(name, key)
                        {
                            if (originList[i][name].indexOf(scope.keyword) !== -1)
                            {
                                if (void 0 === pushList[originList[i][primeKey[0]]])
                                {
                                    createList.push(angular.copy(originList[i]));
                                    pushList[originList[i][primeKey[0]]] = true;
                                }
                            }
                        });
                    }
                }
                scope.$apply(function ()
                {
                    angular.copy(createList, scope.refineItem);
                });
            });
        }
    };
});
var myApp = angular.module('myApp');
myApp.directive('closeButtonDirecitve', function(Shared, Utility)
{
    return {
        restrict: 'E',
        scope: {execute: '&'},
        template: '<button ng-if="isShowMine" class="close-button" ng-click="click()"><i class="fa fa-times"></i></button>',
        link: function (scope, element, attrs) 
        {
            if (3 != Shared.get("role"))
            {
                scope.isShowMine = true;
            }
            else
            {
                scope.isShowMine = false;
            }
            
            scope.click = function()
            {
                Utility.confirmAlert(scope.execute);
            };
        }
    };
});
var myApp = angular.module('myApp');
myApp.directive('saveButtonDirecitve', function(Shared)
{
    return {
        restrict: 'E',
        scope: {is:"=", execute: '&', name: "@"},
        template: '<button ng-if="is" class="close-button" ng-click="click()">{{name}}</button>',
        link: function (scope, element, attrs) 
        {
            if (3 != Shared.get("role"))
            {
                scope.isShowMine = true;
            }
            else
            {
                scope.isShowMine = false;
            }
            
            scope.click = function()
            {
                scope.execute();
            };
        }
    };
});
var myApp = angular.module('myApp');
myApp.directive('linkButtonDirecitve', function(Shared)
{
    return {
        restrict: 'E',
        scope: {href: '@', name: "@"},
        template: '<a ng-if="isShowMine" class="btn btn-default" ng-href="/#/{{href}}">{{name}}</a> ',
        link: function (scope, element, attrs) 
        {
            if (3 != Shared.get("role"))
            {
                scope.isShowMine = true;
            }
            else
            {
                scope.isShowMine = false;
            }
            
            scope.click = function()
            {
                scope.execute();
            };
        }
    };
});
/**
 * 
 */
var myApp = angular.module('myApp');
myApp.directive('conditionDirective', function(Utility){
    return {
        restrict: 'EA',
        scope:{
            conditionAppend: '=',
            screenType: '@',
        },
        template: 
                '指定した値' +
                '<select ng-model="mySlected" class="form-control"' +
                    ' ng-options="item as item.name for item in selectItems" ng-required="true"></select>'+
                'ものを条件とする'+
                '<div ng-if="isOneInput"><input type="text" name="{{conditionAppend.column.physicalname}}" class="form-control" ng-model="conditionAppend.condition.value1" ng-keyup="check()" ng-required="true">'+

                '<div ng-if="conditionAppend.error" class="item-error-box"><p class="item-error">{{conditionAppend.message}}</p></div>'+

                '</div>'+
                '<div ng-if="isTextArea"><textarea class="form-control" ng-model="conditionAppend.condition.value1" ng-required="true"></textarea></div>'+
                
                '<div ng-if="isTwoInput"><input type="text" class="form-control" ng-model="conditionAppend.condition.value1" ng-keyup="check()" ng-required="true">～<input type="text" class="form-control" ng-model="conditionAppend.condition.value2" ng-keyup="check()" ng-required="true"></div>'
                  ,
        link: function (scope, element, attrs) 
        {
            var showOneInput = function()
            {
                scope.isOneInput = true;
                scope.isTextArea = false;
                scope.isTwoInput = false;
            };
            
            var showTextArea = function()
            {
                scope.isOneInput = false;
                scope.isTextArea = true;
                scope.isTwoInput = false;
            };
            
            var showTwoInput = function()
            {
                scope.isOneInput = false;
                scope.isTextArea = false;
                scope.isTwoInput = true;
            };
            
            if (1 == scope.screenType)
            {
                scope.selectItems = [
                    {name: 'に等しい', value: 1, execute: showOneInput, 'symbol': '='},
                    {name: '以上', value: 2, execute: showOneInput, 'symbol': '>='},
                    {name: '以下', value: 3, execute: showOneInput, 'symbol': '<='},
                    {name: 'を超える', value: 4, execute: showOneInput, 'symbol': '>'},
                    {name: '未満', value: 5, execute: showOneInput, 'symbol': '<'},
                    {name: 'の間', value: 6, execute: showTwoInput, 'symbol': 'BETWEEN'},
                ];
            }
            else
            {
                scope.selectItems = [
                    {name: 'に等しい', value: 1, execute: showOneInput, 'symbol': '='},
                    {name: '以上', value: 2, execute: showOneInput, 'symbol': '>='},
                    {name: '以下', value: 3, execute: showOneInput, 'symbol': '<='},
                    {name: 'を超える', value: 4, execute: showOneInput, 'symbol': '>'},
                    {name: '未満', value: 5, execute: showOneInput, 'symbol': '<'},
                    {name: 'の間', value: 6, execute: showTwoInput, 'symbol': 'BETWEEN'},
                    {name: 'を含む', value: 7, execute: showTextArea, 'symbol': 'IN'},
                    {name: 'を含まない', value: 8, execute: showTextArea, 'symbol': 'NOT IN'},
                    {name: 'から始まる', value: 9, execute: showOneInput, 'symbol': 'LIKE'},
                    {name: 'で終わる', value: 10, execute: showOneInput, 'symbol': 'LIKE'},
                    {name: 'を一部に持つ', value: 11, execute: showOneInput, 'symbol': 'LIKE'},
                ];
            }
            

            scope.isOneInput = false;
            scope.isTextArea = false;
            scope.isTwoInput = false;

            if (void 0 === scope.conditionAppend.selectedCondition)
            {
                scope.conditionAppend.selectedCondition = {name: '', value: '', symbol: ''};
                scope.conditionAppend.condition = {value1: '', value2: '', where: 'AND'};
            }
            else
            {
                angular.forEach(scope.selectItems, function(item)
                {
                    if (item.value === scope.conditionAppend.selectedCondition.value)
                    {
                        scope.mySlected = item;
                        scope.conditionAppend.selectedCondition.name = scope.mySlected.name;
                        scope.conditionAppend.selectedCondition.value = scope.mySlected.value;
                        scope.conditionAppend.selectedCondition.symbol = scope.mySlected.symbol;
                        item.execute();
                        return false;
                    }
                });
            }
            
            element.find('select').on('change', function()
            {
                scope.conditionAppend.selectedCondition.name = scope.mySlected.name;
                scope.conditionAppend.selectedCondition.value = scope.mySlected.value;
                scope.conditionAppend.selectedCondition.symbol = scope.mySlected.symbol;
                scope.$apply(function()
                {
                    scope.mySlected.execute();
                });
            });
            
            scope.check = function(event)
            {
                var type = '';
                if (void 0 === scope.conditionAppend.column)
                {
                    type = scope.conditionAppend.type;
                }
                else
                {
                    type = scope.conditionAppend.column.type;
                }
                var val = scope.conditionAppend.condition.value1;
                if ('bigint' === type || 'int' === type || 'number' === type)
                {
                    if (void 0 === val)
                    {
                        scope.conditionAppend.error = false;
                        scope.conditionAppend.message = '';
                    }
                    else
                    {
                        if (!isFinite(parseInt(val, 10)))
                        {
                            scope.conditionAppend.error = true;
                            scope.conditionAppend.message = '数値で入力してください';
                        }
                        else
                        {
                            scope.conditionAppend.error = false;
                            scope.conditionAppend.message = '';
                        }
                    }
                }
                else if ('datetime' === type || 'smalldatetime' === type)
                {
                    if (void 0 === val)
                    {
                        scope.conditionAppend.error = false;
                        scope.conditionAppend.message = '';
                    }
                    else
                    {
                        var valL = val.split('-') ;
                        if (3 !== valL.length)
                        {
                            scope.conditionAppend.error = true;
                            scope.conditionAppend.message = '日付はYYYY-MM-DDで入力してください';
                        }
                        else
                        {
                            var m = Utility.moment(val);
                            if (!m.isValid())
                            {
                                scope.conditionAppend.error = true;
                                scope.conditionAppend.message = '有効な日付ではありません';
                            }
                            else
                            {
                                scope.conditionAppend.error = false;
                                scope.conditionAppend.message = '';
                            }
                        }
                    }
                }
            };
        }
    };
});
/**
 * オートコンプリートディレクティブ
 * 
 * [属性]
 * selectedItem : コントローラー側と選択した値のバインド用
 * itemList     : リスト表示用のデータ
 * 
 * [使用方法]
 * <auto-complete-directive item-list="trackerList" selected-item="ticketModel.tracker" ></auto-complete-directive>
 * 
 * @module autoCompleteDirective
 * @author niikawa
 */
var myApp = angular.module('myApp');
myApp.directive('autoCompleteFaDirective', function()
{
    return {
        restrict: 'E',
        scope: {selectedItem: '=', itemList: '=', execute: '&', clickExecute: '&', namePropertie: '@', appendString: '@', showLabel: '=', selectByList: '=', selectName: '=', addonString: '@'},
        template:   '<div class="input-group"><span class="input-group-addon">{{addonString}}</span>'+
                    '<input ng-show="!isLabel" class="form-control form-control-add-fa2 " ng-model="selectName">' +
                    '<span ng-show="isLabel && selectName.length != 0" ng-click="changeElement()">{{appendString}}{{selectName}}</span>' +
                    '<ul class="complete-list" ng-show="isFocus">' +
                    '<li ng-repeat="item in itemList" ng-click="click($event, item)" >' +
                    '{{item[namePropertie]}}' +
                    '</li>' +
                    '</ul>' +
                    '<span class="input-group-addon question"><i class="fa fa-plus fa-2x" ng-click="clickI()"></i></span>',
        replace: true,
        link: function (scope, element, attrs) 
        {
            scope.selectName = '';
            scope.isFocus = false;
            scope.isLabel = false;
            var originList = [];
            scope.$watch('itemList', function(newValue, oldValue)
            {
                if (void 0 !== newValue && void 0 !== oldValue)
                {
                    console.log('watch itemList');
                    if (newValue.length === oldValue.length)
                    {
                        return false;
                    }
                    if (newValue.length > oldValue.length)
                    {
                        originList = angular.copy(newValue);
                    }
                    else if (newValue.length < oldValue.length)
                    {
                        originList = angular.copy(oldValue);
                    }
                }
                else
                {
                    if (void 0 !== scope.itemList)
                    {
                        console.log('set initialize data');
                        angular.copy(scope.itemList, originList);
                    }
                }
            });

            /**
             * 要素のインプットにフォーカが合った場合にリストを表示する
             * 
             * @author niikawa
             */
            element.find('input').on('focus', function()
            {
                if (0 < scope.itemList.length)
                {
                    scope.$apply(function ()
                    {
                        scope.isFocus = true;
                    });
                }
            });
            
            /**
             * 要素のインプットからにフォーカが外れた場合にリストを非表示する
             * 
             * @author niikawa
             */
            element.find('input').on('blur', function()
            {
                var hide = setInterval(function(isExist)
                {
                    scope.$apply(function ()
                    {
                        if (scope.selectByList)
                        {
                            var num = originList.length;
                            var isExist = scope.selectName.length === 0 ? true : false;
                            for (var i = 0; i < num; i++)
                            {
                                if (scope.selectName === originList[i][scope.namePropertie])
                                {
                                    isExist = true;
                                    break;
                                }
                            }
                            
                            if (isExist)
                            {
                                element.find('input').removeClass('auto-complete-item-error');
                            }
                            else
                            {
                                element.find('input').addClass('auto-complete-item-error');
                            }
                            scope.isFocus = false;
                        }
                    });
                    clearInterval(hide);
                }, 300);
            });
            
            /**
             * 入力文字に合致した選択肢を表示する
             * 
             * @author niikawa
             */
            element.find('input').on('keyup', function()
            {
                if (0 === originList.length)
                {
                    angular.copy(scope.itemList, originList);
                }
                var createList = [];

                if (0 < scope.itemList.length)
                {
                    scope.isFocus = true;
                }
                if (scope.selectName.length === 0)
                {
                    angular.copy(originList, createList);
                }
                else
                {
                    var num = originList.length;
                    for (var i = 0; i < num ; i++)
                    {
                        if (originList[i][scope.namePropertie].indexOf(scope.selectName) !== -1)
                        {
                            createList.push(angular.copy(originList[i]));
                        }
                    }
                }
                scope.$apply(function ()
                {
                    angular.copy(createList, scope.itemList);
                });
            });
            
            /**
             * 選択肢がクリックされた時に実行され、選択したアイテムを
             * selectedItemに格納する
             * 
             * @event click
             * @author niikawa
             * @param {object} $event イベント
             * @param {string} item   選択したアイテム
             */
            scope.click = function ($event, item) 
            {
                //イベントが伝搬しないように制御
                $event.preventDefault();
                $event.stopPropagation();
                
                angular.copy(item, scope.selectedItem);
                element.find('input').removeClass('auto-complete-item-error');
                scope.isFocus = false;
                if (void 0 !== scope.execute)
                {
                    scope.execute();
                }
                if (scope.showLabel) scope.isLabel = true;
                scope.selectName = item[scope.namePropertie]; 
            };
            
            /**
             * spanからinputに変更する
             * 
             * @event click
             * @author niikawa
             */
            scope.changeElement = function()
            {
                angular.copy(originList, scope.itemList);
                scope.isLabel = false;
                element.find('input').focus();
            };
            
            scope.clickI = function()
            {
                angular.copy(originList, scope.itemList);
                scope.isFocus = false;
                scope.clickExecute();
            };
        }
    };
});
var myApp = angular.module('myApp');
myApp.controller('CalendarCtrl',['$scope','Calendar', 'Utility', function ($scope, Calendar, Utility)
{
    $scope.calendarList = [];
    $scope.calendarofMonthList = [];
    $scope.isWeek = false;
    $scope.isMonth = false;
    var isDisabled = false;
    $scope.initialize = function()
    {
        Calendar.resource.get().$promise.then(function(response)
        {
            $scope.isWeek = true;
            $scope.calendarList = response.data;
        });
    };
    
    $scope.nextDay = function()
    {
        if (isDisabled) return;
        isDisabled = true;
        var days = Object.keys($scope.calendarList);
        var last = Utility.moment(days[days.length-1]).format("YYYY-MM-DD");
        var next = Utility.addDay(last, 1).format("YYYY-MM-DD");
        
        Calendar.resource.oneDay({day: next}).$promise.then(function(response)
        {
            delete $scope.calendarList[Object.keys($scope.calendarList)[0]];
            var nextKey = Object.keys(response.data);
            $scope.calendarList[nextKey] = response.data[nextKey];
            isDisabled = false;
        });
    };
    
    $scope.deforeDay = function()
    {
        if (isDisabled) return;
        isDisabled = true;
        var last = Utility.moment(Object.keys($scope.calendarList)[0]).format("YYYY-MM-DD");
        var next = Utility.subtractDay(last, 1).format("YYYY-MM-DD");
        
        Calendar.resource.oneDay({day: next}).$promise.then(function(response)
        {
            var days = Object.keys($scope.calendarList);
            delete $scope.calendarList[days[days.length-1]];
            var minKey = Object.keys(response.data);
            var newList = {};
            newList[minKey] = response.data[minKey];
            Object.keys($scope.calendarList).forEach(function(key)
            {
                newList[key] = $scope.calendarList[key];
            });
            $scope.calendarList = newList;
            isDisabled = false;
        });
    };
    
    $scope.showWeek = function()
    {
        if (isDisabled) return;
        isDisabled = true;
        Calendar.resource.get().$promise.then(function(response)
        {
            isDisabled = false;
            $scope.isWeek = true;
            $scope.isMonth = false;
            $scope.calendarList = response.data;
        });
    };
    
    $scope.showMonth = function()
    {
        if (isDisabled) return;
        isDisabled = true;
        var days = Object.keys($scope.calendarList);
        var year = Utility.moment(days[days.length-1]).format("YYYY");
        var month = Utility.moment(days[days.length-1]).format("MM");
        Calendar.resource.month({year:year, month: month}).$promise.then(function(response)
        {
            isDisabled = false;
            $scope.isMonth = true;
            $scope.isWeek = false;
            $scope.calendarofMonthList = response.data;
            $scope.year = response.year;
            $scope.month = response.month;
        });
    };
    
    $scope.nextMonth = function()
    {
        if (isDisabled) return;
        isDisabled = true;
        var now = $scope.year + '/' + $scope.month + '/01';
        var yearMonth = Utility.addMonth(now, 1).format("YYYY-MM");
        var params = yearMonth.split("-");

        Calendar.resource.month({year:params[0], month: params[1]}).$promise.then(function(response)
        {
            isDisabled = false;
            $scope.isWeek = false;
            $scope.isMonth = true;
            $scope.calendarofMonthList = response.data;
            $scope.year = response.year;
            $scope.month = response.month;
        });
    };

    $scope.deforeMonth = function()
    {
        if (isDisabled) return;
        isDisabled = true;
        var now = $scope.year + '/' + $scope.month + '/01';
        var yearMonth = Utility.subtractMonth(now, 1).format("YYYY-MM");
        var params = yearMonth.split("-");
        Calendar.resource.month({year:params[0], month: params[1]}).$promise.then(function(response)
        {
            isDisabled = false;
            $scope.isWeek = false;
            $scope.isMonth = true;
            $scope.calendarofMonthList = response.data;
            $scope.year = response.year;
            $scope.month = response.month;
        });
    };

}]);
myApp.factory("Calendar", ['$resource','Utility', function($resource, Utility) 
{
    var calendarServices = {};
    
    calendarServices.resource = $resource('/calendar/', {}, 
    {
        oneDay:
        {
            method:"GET",
            url: "calendar/one/:day"
        },
        month:
        {
            method:"GET",
            url: "calendar/:year/:month"
        },
    });
    
    return calendarServices;
}]);

myApp.directive('calendarDirective', function(Utility)
{
    return {
        restrict: 'E',
        templateUrl: '../../partials/calendar.html',
        controller: 'CalendarCtrl',
        replace: true,
        link: function (scope, element, attrs, ctrl) 
        {
            scope.showCircle = false;

            scope.enterCircle = function()
            {
                scope.showCircle = true;
            };
            
            scope.leaveCircle = function()
            {
                scope.showCircle = false;
            };
            
            scope.isTrigger = function(type)
            {
                return 1 === type;
            };
            scope.isScSingle = function(type)
            {
                return 2 === type;
            };
            scope.isScPriod = function(type)
            {
                return 3 === type;
            };
            scope.isHoliday = function(dayMin)
            {
                return '0sun' == dayMin;
            };
            scope.isHolidayToWeek = function(day)
            {
                return 0 == Utility.moment(day).format("e");
            };
        }
    };
});

var myApp = angular.module('myApp');
myApp.directive('myValidators', function () {
    return {
        require: 'ngModel',
        scope: {
            myValidators: '=',
        },
        link: function (scope, elem, attrs, ctrl) {
            var validators = scope.myValidators || {};
            angular.forEach(validators, function (val, key) {
                ctrl.$validators[key] = val;
            });
        }
    };
});
myApp.directive('myAsyncValidators', function () {
    return {
        require: 'ngModel',
        scope: {
            myAsyncValidators: '='
        },
        link: function (scope, elem, attrs, ctrl) {
            var asyncValidators = scope.myAsyncValidators || {};
            angular.forEach(asyncValidators, function (val, key) {
                ctrl.$asyncValidators[key] = val;
            });
        }
    };
});
var myApp = angular.module('myApp');
myApp.directive('d3Bar', ['d3Service', '$parse', function (d3Service, $parse) {
  var d3 = d3Service.d3;
  return{
    restrict: 'EAC',
    scope:{
      data: '=', // APLのController側とデータをやり取り.
      key: '@',
      valueProp: '@',
      label: '@'
    },
    link: function(scope, element){
      // 初期化時に可視化領域の確保.a
      var svg = d3.select(element[0]).append('svg').style('width', '100%');
      var colorScale = d3.scale.category20();

      var watched = {}; // $watchリスナの登録解除関数格納用.

      // (Angular) $parseでCollection要素へのアクセサを確保しておく.
      var getId = $parse(scope.key || 'id');
      var getValue = $parse(scope.valueProp || 'value');
      var getLabel = $parse(scope.label || 'name');

      // (Angular) Collectionの要素変動を監視.
      scope.$watchCollection('data', function(){
        if(!scope.data){
          return;
        }

        // (D3 , Angular) data関数にて, $scopeとd3のデータを紐付ける.
        var dataSet = svg.selectAll('g.data-group').data(scope.data, getId);

        // (D3) enter()はCollection要素の追加に対応.
        var createdGroup = dataSet.enter()
        .append('g').classed('data-group', true)
        .each(function(d){
          // (Angular) Collection要素毎の値に対する変更は、$watchで仕込んでいく.
          var self = d3.select(this);
          watched[getId(d)] = scope.$watch(function(){
            return getValue(d);
          }, function(v){
            self.select('rect').attr('width', v);
          });
        });
        createdGroup.append('rect')
        .attr('x', 130)
        .attr('height', 18)
        .attr('fill', function(d){
          return colorScale(d.name);
        });
        createdGroup.append('text').text(getLabel).attr('height', 15);

        // (D3) exit()はCollection要素の削除に対応.
        dataSet.exit().each(function(d){
          // (Angular) $watchに登録されたリスナを解除して、メモリリークを防ぐ.
          var id = getId(d);
          watched[id]();
          delete watched[id];
        }).remove();

        // (D3) Collection要素変動の度に再計算する箇所.
        dataSet.each(function(d, i){
          var self = d3.select(this);
          self.select('rect').attr('y', i * 25);
          self.select('text').attr('y', i * 25 + 15);
        });

      });

    }
  };
}]);
var myApp = angular.module('myApp');
myApp.directive('lineChart', ['d3Service', '$parse', '$window', function (d3Service, $parse, $window)
{
    var d3 = d3Service.d3;
    return {
        restrict: 'EA',
        scope:{
          data: '=',
          type: '@',
          headerLabel: '=',
          legendLabel: '=',
        },
        link: function(scope, element)
        {
            //画面
            var w = angular.element($window);

            var colorList = ['#FF8C00', '#A9A9A9'];

            //D3.jsで表現できる線のリスト
            var lineTypeList = [
              'linear','linear-closed', 'step', 'step-before', 'step-after',
              'basis', 'basis-open', 'basis-close', 'bundle', 'cardinal',
              'cardinal-open', 'cardinal-close', 'monotone'
              ];

            //描画時のmargin  
            var margin = {top: 40, right: 40, bottom: 70, left: 90};
            
            //日付パース用
            var parseDate = d3.time.format("%Y/%m").parse;

            //dataを監視して変更があったら実行する
            scope.$watchCollection('data', function()
            {
                if (void 0 !== scope.headerLabel && '' !== scope.headerLabel)
                {
                    if (element.children('p').length > 0)
                    {
                        element.children('p').remove();
                    }
                    var add = '<p class="line-title">'+scope.headerLabel+'</p>';
                    element.append(add);
                }
                
                if(!scope.data) return;
                removeSVG();
                drowLegend(false);
                drowLine(false);
            });
            
            w.on('resize', function()
            {
                removeSVG();
                drowLegend(true);
                drowLine(true);
            });
            
            //---------------------
            //描画対象取得
            //---------------------
            function getType(type)
            {
                if (-1 === lineTypeList.indexOf(type))
                {
                    return lineTypeList[0];
                }
                return type;
            }
            
            //---------------------
            //凡例描画
            //---------------------
            function drowLegend(isResize)
            {
                if (void 0 === scope.legendLabel)
                {
                    return;
                }
                var num = angular.isArray(scope.legendLabel) ? scope.legendLabel.length : 0;
                if (0 === num) return;
                var size = {width : '100%', height: num * 15};
                var svg = d3.select(element[0])
                                  .append('svg')
                                  .attr("width", size.width)
                                  .attr("height", size.height);
//                var colorScale = d3.scale.category20();
                
                svg.selectAll('rect').data(scope.legendLabel)
                  .enter().append('rect')
                  .attr("class", "pull-right")
                  .attr("width", 50)
                  .attr('height', 5)
                  .attr('x', w.width() - 150)
                  .attr('y', function(d,i){return i * 20})
                  .attr('fill', function(d, i){return colorList[i];});
                
                //ラベル生成
                svg.selectAll('text').data(scope.legendLabel)
                  .enter().append('text')
                  .text(function(d, i){ return d }) 
                  .attr('x', function(d, i){ return w.width() - 250})
                  .attr('y', function(d, i){ 
                    if (0 === i)
                    {
                        return 10;
                    } 
                    else
                    {
                        return i * 5 + 20;
                    }
                  });
            }
            
            //---------------------
            //グラフ描画
            //---------------------
            function drowLine(isResize)
            {
                //描画サイズ  
                var size = {width : w.width(), height: w.height() / 2};
                var xrange = size.width - margin.left - margin.right - 50;
                var yrange = size.height - margin.top - margin.bottom;
                //Xメモリを日付にしてrangeで描画サイズを決定する
                var x = d3.time.scale()
                  .range([0, xrange]);
                //yはscale
                var y = d3.scale.linear()
                  .range([yrange, 0]);
            
                //TODO 
                var xAxis = 
                  d3.svg.axis().scale(x).orient("bottom").innerTickSize(-yrange)
                    .outerTickSize(0).tickFormat(d3.time.format("%Y/%m"));

                var yAxis = 
                  d3.svg.axis().scale(y).orient("left").innerTickSize(-xrange).outerTickSize(0);
                  
                //描画エリアを生成
                var svg = d3.select(element[0])
                                  .append('svg')
                                  .attr("width", "100%")
                                  .attr("height", size.height)
                                  .append("g")
                                  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                var lineType = getType(scope.type);
                
                //d3.svg.line()で座標値を計算して線の種類を設定
                var line = d3.svg.line()
                  .x(
                    function(d, i)
                    {
                      return x(d.date); 
                    }
                  )
                  .y(
                    function(d, i)
                    { 
                      return y(d.price);
                    }
                  )
                  .interpolate(lineType);

                angular.forEach(scope.data, function(dataset, i)
                {
                    //TODO
                    if (isResize)
                    {
                        dataset.forEach(function(d)
                        {
                            d.date = d.date;
                            d.price = +d.price;
                        });
                    }
                    else
                    {
                        dataset.forEach(function(d)
                        {
                            d.date = parseDate(d.date);
                            d.price = +d.price;
                        });
                    }
                                      
                    //表X軸、Y軸のメモリを設定する
                    var lineClass = 'line-avg';
                    if (0 === i)
                    {
                        lineClass = 'line-main';
                        x.domain(d3.extent(dataset, function(d){ return d.date; })).nice();
                        y.domain(d3.extent(dataset, function(d){ return d.price; })).nice();
                        
                        // 描画
                        svg.append("g")
                          .attr("class", "x axis")
                          .attr("transform", "translate(0, " + ( size.height - margin.top - margin.bottom ) + ")")
                          .call(xAxis)
                          .selectAll("text")
                            .attr("transform", "rotate (-70)")
                            .attr("dx", "-5em")
                            .attr("dy", "-0.1em")
                            .style("text-anchor", "start");

                        svg.append("g")
                          .attr("class", "y axis")
                          .call(yAxis)
                          .append("text")
                            .attr("transform", "rotate(-90)")
                            .attr("y", 6)
                            .attr("dy", ".7em")
                            .style("text-anchor", "end");
                    }
                    
                    svg.append("path")
                      .datum(dataset)
                      .attr("class", lineClass)
                      .attr("d", line);
                });
            }
            
            //---------------------
            //削除
            //---------------------
            function removeSVG()
            {
                if (element.children('svg').length > 0)
                {
                    element.children('svg').remove();
                }
            }
        }
    };
}]);