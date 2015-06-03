var myApp = angular.module('myApp');
myApp.directive('drawerMenuDirective', function()
{
    return {
        restrict: 'E',
        scope: {menuList: '='},
        template: '<div class="buble-drawer-menu"></div>',
        link: function (scope, element, attrs) 
        {
            element.on('click', function()
            {
                element.after('<div class="buble-drawer-menu"></div>');
            });
            if (void 0 === scope.menuList) return;
            
            for(var i = 0 ;scope.menuList.length; i++)
            {
                var add = '';
            }
        }
    };
});