var myApp = angular.module('myApp');
myApp.directive('drawerMenuDirective', function()
{
    return {
        restrict: 'E',
        scope: {menuList: '='},
        template: '<nav></nav>',
        link: function (scope, element, attrs) 
        {
            element.append('<label class="menu-open-button" for="menu-open"><span class="hamburger hamburger-1"></span><span class="hamburger hamburger-2"></span><span class="hamburger hamburger-3"></span></label>');
            
            element.on('click', function()
            {
                element.after('<div class="buble-drawer-menu" style="transform: translate3d(50px,20px,10px);"></div>');
            });
            if (void 0 === scope.menuList) return;
            
            for(var i = 0 ;scope.menuList.length; i++)
            {
            }
        }
    };
});