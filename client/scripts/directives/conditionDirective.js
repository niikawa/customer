/**
 * 
 */
var myApp = angular.module('myApp');
myApp.directive('conditionDirective', function(){
    return {
        restrict: 'EA',
        scope:{
            conditionAppend: '=',
        },
        template: '指定した値' +
                '<select ng-model="mySlected" ng-options="item as item.name for item in selectItems"></select>'+
                'ものを条件とする'+
                '<div ng-if="isOneInput"><input type="text" ng-model="conditionAppend.condition.value1"></div>'+
                '<div ng-if="isTextArea"><input type="text" ng-model="conditionAppend.condition.value1"></div>'+
                '<div ng-if="isTwoInput"><input type="text" ng-model="conditionAppend.condition.value1">～<input type="text" ng-model="conditionAppend.condition.value2"></div>'
                  ,
        link: function (scope, element, attrs) 
        {
            scope.conditionAppend.selectedCondition = {name: '', value: ''};
            scope.conditionAppend.condition = {value1: '', value2: ''};

            scope.isOneInput = false;
            scope.isTextArea = false;
            scope.isTwoInput = false;
            
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
            
            scope.selectItems = [
                {name: 'に等しい', value: 1, execute: showOneInput},
                {name: '以上', value: 2, execute: showOneInput},
                {name: '以下', value: 3, execute: showOneInput},
                {name: 'を超える', value: 4, execute: showOneInput},
                {name: '未満', value: 5, execute: showOneInput},
                {name: 'の間', value: 6, execute: showTwoInput},
                {name: 'を含む', value: 7, execute: showTextArea},
                {name: 'を含まない', value: 8, execute: showTextArea},
                {name: 'から始まる', value: 9, execute: showOneInput},
                {name: 'で終わる', value: 10, execute: showOneInput},
                {name: 'を一部に持つ', value: 11, execute: showOneInput},
            ];
            element.find('select').on('change', function()
            {
                scope.conditionAppend.selectedCondition.name = scope.mySlected.name;
                scope.conditionAppend.selectedCondition.value = scope.mySlected.value;
                console.log(scope.conditionAppend);
                scope.$apply(function()
                {
                    scope.mySlected.execute();
                });
            });
        }
    };
});