/**
 * 
 */
var myApp = angular.module('myApp');
myApp.directive('conditionDirective', function(){
    return {
        restrict: 'E',
        template: '指定した値' +
                '<select ng-model="selectedCondition" ng-options="item as item.name for item in items">'+
                '<div ng-if="isOneInput"><input type="text"></div>'+
                '<div ng-if="isTwoInput"><input type="text">～<input type="text"></div>'+
                'ものを条件とする'
                  ,
        scope:{
            appendModel: '='
        },
        link: function (scope, element, attrs) 
        {
            var showOneInput = function()
            {
                scope.isOneInput = true;
                scope.isTwoInput = false;
            }
            
            var showTwoInput = function()
            {
                scope.isOneInput = false;
                scope.isTwoInput = true;
            }
            
            scope.items = [
                {name: 'に等しい', value: 1, execute: showOneInput},
                {name: '以上', value: 2, execute: showOneInput},
                {name: '以下', value: 3, execute: showOneInput},
                {name: 'を超える', value: 4, execute: showOneInput},
                {name: '未満', value: 5, execute: showOneInput},
                {name: 'の間', value: 6, execute: showTwoInput},
                {name: 'を含む', value: 7, execute: showOneInput},
                {name: 'を含まない', value: 8, execute: showOneInput},
                {name: 'から始まる', value: 9, execute: showOneInput},
                {name: 'で終わる', value: 10, execute: showOneInput},
                {name: 'を一部に持つ', value: 11, execute: showOneInput},
            ];
            scope.isOneInput = false;
            scope.isTwoInput = false;
            
            element.find('select').on('change', function()
            {
                console.log(scope.selectedCondition);
                scope.$apply(function()
                {
                    scope.selectedCondition.execute();
                });
            });
        }
    };
});