/**
 * 
 */
var myApp = angular.module('myApp');
myApp.directive('conditionDirective', function(){
    return {
        restrict: 'A',
        template: '指定した値' +
                '<select ng-model="selectedCondition" ng-options="item as item.name for item in items">'+
                'ものを条件とする'+
                '<div ng-if="isOneInput"></div>'+
                '<div ng-if="isTwoInput"></div>'
                  ,
        scope:{
            
        },
        link: function (scope, element, attrs) 
        {
            var items = [
                {name: 'に等しい', value: 1},
                {name: '以上', value: 2},
                {name: '以下', value: 3},
                {name: 'を超える', value: 4},
                {name: '未満', value: 5},
                {name: 'の間', value: 6},
                {name: 'を含む', value: 7},
                {name: 'を含まない', value: 8},
                {name: 'から始まる', value: 9},
                {name: 'で終わる', value: 10},
                {name: 'を一部に持つ', value: 11},
            ];
            scope.isOneInput = false;
            scope.isTwoInput = false;
            
            element.find('select').on('change', function()
            {
                console.log('chage event');
                console.log(scope.selectedCondition);
                
            });
        }
    };
});