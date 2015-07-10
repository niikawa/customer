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
        template: 
                '指定した値' +
                '<select ng-model="mySlected" class="form-control" ng-options="item as item.name for item in selectItems" ng-required="true"></select>'+
                'ものを条件とする'+
                '<div ng-if="isOneInput"><input type="text" class="form-control" ng-model="conditionAppend.condition.value1" ng-keyup="check()" ng-required="true">'+

                '<div><p ng-if="conditionAppend.error" class="item-error">{{conditionAppend.message}}</p></div>'+

                '</div>'+
                '<div ng-if="isTextArea"><textarea class="form-control" ng-model="conditionAppend.condition.value1" ng-required="true"></textarea></div>'+
                '<div ng-if="isTwoInput"><input type="text" class="form-control" ng-model="conditionAppend.condition.value1" ng-required="true">～<input type="text" class="form-control" ng-model="conditionAppend.condition.value2" ng-required="true"></div>'
                  ,
        link: function (scope, element, attrs) 
        {
            scope.conditionAppend.selectedCondition = {name: '', value: '', symbol: ''};
            scope.conditionAppend.condition = {value1: '', value2: '', where: 'AND'};

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
            element.find('select').on('change', function()
            {
                scope.conditionAppend.selectedCondition.name = scope.mySlected.name;
                scope.conditionAppend.selectedCondition.value = scope.mySlected.value;
                scope.conditionAppend.selectedCondition.symbol = scope.mySlected.symbol;
                console.log(scope.conditionAppend);
                scope.$apply(function()
                {
                    scope.mySlected.execute();
                });
            });
            
            scope.check = function(event)
            {
                console.log(scope.conditionAppend);
                var type = scope.conditionAppend.column.inputType;
                var val = scope.conditionAppend.condition.value1;
                console.log(type);
                if ('number' === type)
                {
                    if ('' === val)
                    {
                        scope.conditionAppend.error = false;
                        scope.conditionAppend.message = '';
                    }
                    
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
                else if ('date' === type)
                {
                    
                }
            };
        }
    };
});