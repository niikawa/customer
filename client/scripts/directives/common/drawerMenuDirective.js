var myApp = angular.module('myApp');
myApp.directive('drawerMenuDirective', function()
{
    return {
        restrict: 'E',
        scope: {menuList: '='},
        template: '<nav></nav>',
        link: function (scope, element, attrs) 
        {
            element.append('<a class="buble-drawer-menu"><i class="fa fa-bar-chart"></i></a>');
            
            
            
            element.on('click', function()
            {
                
            });
            if (void 0 === scope.menuList) return;
            
            for(var i = 0 ;scope.menuList.length; i++)
            {
                
                element.after('<div class="buble-drawer-menu"></div>');
            }
        }
    };
});