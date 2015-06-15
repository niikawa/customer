/**
 * 絞込みディレクティブ
 * 
 * [属性]
 * selectedItem : コントローラー側と選択した値のバインド用
 * itemList     : リスト表示用のデータ
 * 
 * [使用方法]
 * <refine-directive item-list="trackerList" selected-item="ticketModel.tracker" ></refine-directive>
 * 
 * @module refineDirective
 * @author niikawa
 */
var myApp = angular.module('myApp');
myApp.directive('refineDirective', function()
{
    return {
        restrict: 'A',
        scope: {refineItem: '=', namePropertie: '@', keyword: '=', execute: '&', },
        replace: true,
        link: function (scope, element, attrs) 
        {
            var originList = [];

            /**
             * 入力文字に合致した選択肢を表示する
             * 
             * @author niikawa
             */
            element.on('keyup', function()
            {
                console.log(scope.keyword);
                
                if (0 === originList.length)
                {
                    angular.copy(scope.refineItem, originList);
                }
                var createList = [];

                if (void 0 === scope.keyword || scope.keyword.length === 0)
                {
                    angular.copy(originList, createList);
                }
                else
                {
                    var num = originList.length;
                    var nameList = scope.namePropertie.split('|');
                    var pushList = [];
                    var primeKey = Object.keys(originList[0]);

                    for (var i = 0; i < num ; i++)
                    {
                        angular.forEach(nameList, function(name, key)
                        {
                            if (originList[i][name].indexOf(scope.keyword) !== -1)
                            {
                                if (void 0 === pushList[originList[i][primeKey[0]]])
                                {
                                    createList.push(angular.copy(originList[i]));
                                    pushList[originList[i][primeKey[0]]] = true;
                                }
                            }
                        });
                    }
                }
                scope.$apply(function ()
                {
                    angular.copy(createList, scope.refineItem);
                });
            });
        }
    };
});