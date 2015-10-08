/**
 * 
 */
var myApp = angular.module('myApp');
myApp.directive('conditionDirective', [
  'Utility',
  function (Utility) {
    return {
      restrict: 'EA',
      scope: {
        conditionAppend: '=',
        screenType: '@'
      },
      template: '\u6307\u5b9a\u3057\u305f\u5024' + '<select ng-model="mySlected" class="form-control"' + ' ng-options="item as item.name for item in selectItems" ng-required="true"></select>' + '\u3082\u306e\u3092\u6761\u4ef6\u3068\u3059\u308b' + '<div ng-if="isOneInput"><input type="text" name="{{conditionAppend.column.physicalname}}" class="form-control" ng-model="conditionAppend.condition.value1" ng-keyup="check()" ng-required="true">' + '<div ng-if="conditionAppend.error" class="item-error-box"><p class="item-error">{{conditionAppend.message}}</p></div>' + '</div>' + '<div ng-if="isTextArea"><textarea class="form-control" ng-model="conditionAppend.condition.value1" ng-required="true"></textarea></div>' + '<div ng-if="isTwoInput"><input type="text" class="form-control" ng-model="conditionAppend.condition.value1" ng-keyup="check()" ng-required="true">\uff5e<input type="text" class="form-control" ng-model="conditionAppend.condition.value2" ng-keyup="check()" ng-required="true"></div>',
      link: function (scope, element, attrs) {
        var showOneInput = function () {
          scope.isOneInput = true;
          scope.isTextArea = false;
          scope.isTwoInput = false;
        };
        var showTextArea = function () {
          scope.isOneInput = false;
          scope.isTextArea = true;
          scope.isTwoInput = false;
        };
        var showTwoInput = function () {
          scope.isOneInput = false;
          scope.isTextArea = false;
          scope.isTwoInput = true;
        };
        if (1 == scope.screenType) {
          scope.selectItems = [
            {
              name: '\u306b\u7b49\u3057\u3044',
              value: 1,
              execute: showOneInput,
              'symbol': '='
            },
            {
              name: '\u4ee5\u4e0a',
              value: 2,
              execute: showOneInput,
              'symbol': '>='
            },
            {
              name: '\u4ee5\u4e0b',
              value: 3,
              execute: showOneInput,
              'symbol': '<='
            },
            {
              name: '\u3092\u8d85\u3048\u308b',
              value: 4,
              execute: showOneInput,
              'symbol': '>'
            },
            {
              name: '\u672a\u6e80',
              value: 5,
              execute: showOneInput,
              'symbol': '<'
            },
            {
              name: '\u306e\u9593',
              value: 6,
              execute: showTwoInput,
              'symbol': 'BETWEEN'
            }
          ];
        } else {
          scope.selectItems = [
            {
              name: '\u306b\u7b49\u3057\u3044',
              value: 1,
              execute: showOneInput,
              'symbol': '='
            },
            {
              name: '\u4ee5\u4e0a',
              value: 2,
              execute: showOneInput,
              'symbol': '>='
            },
            {
              name: '\u4ee5\u4e0b',
              value: 3,
              execute: showOneInput,
              'symbol': '<='
            },
            {
              name: '\u3092\u8d85\u3048\u308b',
              value: 4,
              execute: showOneInput,
              'symbol': '>'
            },
            {
              name: '\u672a\u6e80',
              value: 5,
              execute: showOneInput,
              'symbol': '<'
            },
            {
              name: '\u306e\u9593',
              value: 6,
              execute: showTwoInput,
              'symbol': 'BETWEEN'
            },
            {
              name: '\u3092\u542b\u3080',
              value: 7,
              execute: showTextArea,
              'symbol': 'IN'
            },
            {
              name: '\u3092\u542b\u307e\u306a\u3044',
              value: 8,
              execute: showTextArea,
              'symbol': 'NOT IN'
            },
            {
              name: '\u304b\u3089\u59cb\u307e\u308b',
              value: 9,
              execute: showOneInput,
              'symbol': 'LIKE'
            },
            {
              name: '\u3067\u7d42\u308f\u308b',
              value: 10,
              execute: showOneInput,
              'symbol': 'LIKE'
            },
            {
              name: '\u3092\u4e00\u90e8\u306b\u6301\u3064',
              value: 11,
              execute: showOneInput,
              'symbol': 'LIKE'
            }
          ];
        }
        scope.isOneInput = false;
        scope.isTextArea = false;
        scope.isTwoInput = false;
        if (void 0 === scope.conditionAppend.selectedCondition) {
          scope.conditionAppend.selectedCondition = {
            name: '',
            value: '',
            symbol: ''
          };
          scope.conditionAppend.condition = {
            value1: '',
            value2: '',
            where: 'AND'
          };
        } else {
          angular.forEach(scope.selectItems, function (item) {
            if (item.value === scope.conditionAppend.selectedCondition.value) {
              scope.mySlected = item;
              scope.conditionAppend.selectedCondition.name = scope.mySlected.name;
              scope.conditionAppend.selectedCondition.value = scope.mySlected.value;
              scope.conditionAppend.selectedCondition.symbol = scope.mySlected.symbol;
              item.execute();
              return false;
            }
          });
        }
        element.find('select').on('change', function () {
          scope.conditionAppend.selectedCondition.name = scope.mySlected.name;
          scope.conditionAppend.selectedCondition.value = scope.mySlected.value;
          scope.conditionAppend.selectedCondition.symbol = scope.mySlected.symbol;
          scope.$apply(function () {
            scope.mySlected.execute();
          });
        });
        scope.check = function (event) {
          var type = '';
          if (void 0 === scope.conditionAppend.column) {
            type = scope.conditionAppend.type;
          } else {
            type = scope.conditionAppend.column.type;
          }
          var val = scope.conditionAppend.condition.value1;
          if ('bigint' === type || 'int' === type || 'number' === type) {
            if (void 0 === val) {
              scope.conditionAppend.error = false;
              scope.conditionAppend.message = '';
            } else {
              if (!isFinite(parseInt(val, 10))) {
                scope.conditionAppend.error = true;
                scope.conditionAppend.message = '\u6570\u5024\u3067\u5165\u529b\u3057\u3066\u304f\u3060\u3055\u3044';
              } else {
                scope.conditionAppend.error = false;
                scope.conditionAppend.message = '';
              }
            }
          } else if ('datetime' === type || 'smalldatetime' === type) {
            if (void 0 === val) {
              scope.conditionAppend.error = false;
              scope.conditionAppend.message = '';
            } else {
              var valL = val.split('-');
              if (3 !== valL.length) {
                scope.conditionAppend.error = true;
                scope.conditionAppend.message = '\u65e5\u4ed8\u306fYYYY-MM-DD\u3067\u5165\u529b\u3057\u3066\u304f\u3060\u3055\u3044';
              } else {
                var m = Utility.moment(val);
                if (!m.isValid()) {
                  scope.conditionAppend.error = true;
                  scope.conditionAppend.message = '\u6709\u52b9\u306a\u65e5\u4ed8\u3067\u306f\u3042\u308a\u307e\u305b\u3093';
                } else {
                  scope.conditionAppend.error = false;
                  scope.conditionAppend.message = '';
                }
              }
            }
          }
        };
      }
    };
  }
]);