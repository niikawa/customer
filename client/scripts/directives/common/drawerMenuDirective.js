var myApp = angular.module('myApp');
myApp.directive('drawerMenuDirective', function()
{
    return {
        restrict: 'E',
        scope: {menuList: '=', position: '@'},
        template: '<nav class="hi-icon-effect-8 drawer-menu">'
                    +'<a ng-repeat="item in itemList" style="{{item.style}}" class="drawer-menu-item" href={{item.link}}><i class="fa {{item.fa}} fa-3x"></i></a>'
                 +'</nav>',
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
                        
                        var linkList = ['#/', '/#/segment', '/#/scenario', '/#/approach', '/#/user'];

                        if (1 === type)
                        {
                            for (var i = 1; i <= menuItemsNum; i++)
                            {
                                var angle = ((pi - openingAngle)/2)+((openingAngle/(menuItemsNum - 1))*(i - 1));
        
                                x = Math.cos(angle) * 75;
                                y = Math.sin(angle) * 75 - ((i-1) * targetWidth) - targetWidth/2;
                                var dur = durbase+(400*i);
                                var translate = 'transition-timing-function:cubic-bezier(0.935, 0.000, 0.340, 1.330);transition-duration: '+dur+'ms;transform: translate3d(' + x +'px,' + y + 'px, 0);';
                                var add = {fa: 'fa-dashcube', link: linkList[i-1],style: translate};
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