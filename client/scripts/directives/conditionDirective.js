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
                        isYMD();
                    }
                }
                else if('datetime2' === type)
                {
                    if (void 0 === val)
                    {
                        scope.conditionAppend.error = false;
                        scope.conditionAppend.message = '';
                    }
                    else
                    {
                        var valL2 = val.split('-');
                        if (3 !== valL2.length)
                        {
                            scope.conditionAppend.error = true;
                            scope.conditionAppend.message = 'YYYY-MM-DD hh:mm:ssで入力してください';
                        }
                        else
                        {
                            isHMS(valL2[2].split(' ')[1]);
                            if (!scope.conditionAppend.error)
                            {
                                var m2 = Utility.moment(val);
                                if (!m2.isValid())
                                {
                                    scope.conditionAppend.error = true;
                                    scope.conditionAppend.message = '有効な日時ではありません';
                                }
                                else
                                {
                                    scope.conditionAppend.error = false;
                                    scope.conditionAppend.message = '';
                                }
                            }
                        }
                    }
                }
                else if('time' === type)
                {
                    isHMS(val);
                }
            };
            
            function isYMD(value)
            {
                var valL = value.split('-');
                if (3 !== valL.length)
                {
                    scope.conditionAppend.error = true;
                    scope.conditionAppend.message = '日付はYYYY-MM-DDで入力してください';
                }
                else
                {
                    isValidDate(value);
                }
            }
            
            function isHMS(value)
            {
                var hms = value.trim().split(':');
                if (3 !== hms.length)
                {
                    scope.conditionAppend.error = true;
                    scope.conditionAppend.message = 'hh:mm:ssで入力してください';
                }
                else
                {
                    if (24 < hms[0] || 59 < hms[1] || 59 < hms[2])
                    {
                        scope.conditionAppend.error = true;
                        scope.conditionAppend.message = '24:59:59が最大になります';
                    }
                    else
                    {
                        scope.conditionAppend.error = false;
                        scope.conditionAppend.message = '';
                    }
                }
            }
            
            function isValidDate(value)
            {
                var m = Utility.moment(value);
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
    };
});