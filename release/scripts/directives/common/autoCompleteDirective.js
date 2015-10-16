'use strict';

var myApp = angular.module('myApp');
myApp.directive('autoCompleteDirective', [function () {
    return {
        restrict: 'E',
        scope: { selectedItem: '=', itemList: '=', execute: '&', namePropertie: '@', appendString: '@', showLabel: '=', selectByList: '=', selectName: '=' },
        template: '<form class="navbar-form navbar-left"><input ng-show="!isLabel" class="form-control d-complete-input" ng-model="selectName">' + '<span ng-show="isLabel && selectName.length != 0" ng-click="changeElement()">{{appendString}}{{selectName}}</span>' + '<ul class="complete-list" ng-show="isFocus">' + '<li ng-repeat="item in itemList" ng-click="click($event, item)" >' + '{{item[namePropertie]}}' + '</li>' + '</ul></form>',
        replace: true,
        link: function link(scope, element, attrs) {
            scope.selectName = '';
            scope.isFocus = false;
            scope.isLabel = false;
            var originList = [];
            scope.$watch('itemList', function (newValue, oldValue) {
                if (void 0 !== newValue && void 0 !== oldValue) {
                    console.log('watch itemList');
                    if (newValue.length === oldValue.length) {
                        return false;
                    }
                    if (newValue.length > oldValue.length) {
                        originList = angular.copy(newValue);
                    } else if (newValue.length < oldValue.length) {
                        originList = angular.copy(oldValue);
                    }
                } else {
                    if (void 0 !== scope.itemList) {
                        console.log('set initialize data');
                        angular.copy(scope.itemList, originList);
                    }
                }
            });

            element.find('input').on('focus', function () {
                if (0 < scope.itemList.length) {
                    scope.$apply(function () {
                        scope.isFocus = true;
                    });
                }
            });

            element.find('input').on('blur', function () {
                var hide = setInterval(function (isExist) {
                    scope.$apply(function () {
                        if (scope.selectByList) {
                            var num = originList.length;
                            var isExist = scope.selectName.length === 0 ? true : false;
                            for (var i = 0; i < num; i++) {
                                if (scope.selectName === originList[i][scope.namePropertie]) {
                                    isExist = true;
                                    break;
                                }
                            }

                            if (isExist) {
                                element.find('input').removeClass('auto-complete-item-error');
                            } else {
                                element.find('input').addClass('auto-complete-item-error');
                            }
                            scope.isFocus = false;
                        }
                    });
                    clearInterval(hide);
                }, 300);
            });

            element.find('input').on('keyup', function () {
                if (0 === originList.length) {
                    angular.copy(scope.itemList, originList);
                }
                var createList = [];

                if (0 < scope.itemList.length) {
                    scope.isFocus = true;
                }
                if (scope.selectName.length === 0) {
                    angular.copy(originList, createList);
                } else {
                    var num = originList.length;
                    for (var i = 0; i < num; i++) {
                        if (originList[i][scope.namePropertie].indexOf(scope.selectName) !== -1) {
                            createList.push(angular.copy(originList[i]));
                        }
                    }
                }
                scope.$apply(function () {
                    angular.copy(createList, scope.itemList);
                });
            });

            scope.click = function ($event, item) {
                //イベントが伝搬しないように制御
                $event.preventDefault();
                $event.stopPropagation();

                angular.copy(item, scope.selectedItem);
                element.find('input').removeClass('auto-complete-item-error');
                scope.isFocus = false;
                if (void 0 !== scope.execute) {
                    scope.execute();
                }
                if (scope.showLabel) scope.isLabel = true;
                scope.selectName = item[scope.namePropertie];
            };

            scope.changeElement = function () {
                angular.copy(originList, scope.itemList);
                scope.isLabel = false;
                element.find('input').focus();
            };
        }
    };
}]);
