var myApp = angular.module('myApp');
myApp.directive('drawerMenuDirective', function()
{
    return {
        restrict: 'E',
        scope: {menuList: '='},
        template: '<div class="buble-drawer-menu"></div>',
        link: function (scope, element, attrs) 
        {
            if (void 0 === scope.menuList) return;
            
            
            

        }
    };
});