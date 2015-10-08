/**
 * レート表示ディレクティブ
 * デフォルトの画像を使用する場合、表示される画像をimages/icon/に配置する必要がある
 * 
 * 
 * [パラメータ]
 * execute  : 押下時に実行するfunction
 * max      : 最大数
 * value    : 初期値
 * bind     : 親スコープでバインドしたい値
 * onimage  : ON時の画像パス
 * offimage : OFF時の画像パス
 * [使用方法]
 * <rate-directive execute="function()" bind='コントローラーでバインドした値' max=10 value="rate"><rate-directive>
 * 
 * @author gozaru
 */
var myApp = angular.module('myApp');
myApp.directive('rateDirective', function () {
  return {
    restrict: 'E',
    scope: {
      bind: '=',
      execute: '&'
    },
    template: '<div style="display: inline-block"></div>',
    transclude: true,
    link: function (scope, element, attrs) {
      var on = 'images/icon/Star6.png';
      var off = 'images/icon/Star7.png';
      if (attrs.onimage !== void 0) {
        on = attrs.onimage;
      }
      if (attrs.offimage !== void 0) {
        off = attrs.offimage;
      }
      var max = getMax();
      var value = getValue();
      withRate(value, max);
      /**
             * 最大数と数からrateとなる星の要素を生成する
             * 
             * @param {int} num ONにする数
             * @param {int} max 最大数
             */
      function withRate(num, max) {
        element.children().empty();
        for (var i = 1; i <= max; i++) {
          var star = i <= num ? on : off;
          var img = '<img class="rate" value="' + i + '" src="' + star + '">';
          $(img).appendTo(element.children());
        }
        var rateview = '<span class="label label-success">' + getRate(num, max) + '%</span>';
        $(rateview).appendTo(element.children());
      }
      /**
             * 要素に指定されたmaxを取得する
             * 
             * @return {int} maxが数値または数字ではなかった場合は5を返却する
             */
      function getMax() {
        var max = attrs.max;
        if (typeof max != 'number' && typeof max != 'string') {
          //デフォルトのMAXは5
          return 5;
        } else {
          if (max == parseFloat(max) && isFinite(max)) {
            return Math.ceil(max);
          } else {
            return 5;
          }
        }
      }
      /**
             * 要素に指定されたvalueを取得する
             * 
             * @return {int} 指定なしまたは数値または数字ではない場合は0
             */
      function getValue() {
        var value = attrs.value;
        if (typeof value != 'number' && typeof value != 'string') {
          return 0;
        } else {
          return Math.ceil(value);
        }
      }
      /**
             * パラメータから%を算出し返却する
             *
             * @param {int} rank 選択値
             * @param {int} max 最大値
             * @return {int | flote}
             */
      function getRate(rank, max) {
        if (rank == max)
          return 100;
        return (100 * (rank / max)).toFixed(1);
      }
      /**
             * 双方バインディングしているbindを監視し、コントローラー側で
             * 値が変更された場合でもディレクティブの処理を実行する
             */
      scope.$watch('bind', function (newVal, oldVal) {
        var max = getMax();
        var value = Math.ceil((newVal / (100 / max)).toFixed(1));
        withRate(value, max);
      });
      element.on('click', 'img', function (event) {
        var max = getMax();
        var value = $(this).attr('value');
        element.attr('value', value);
        withRate(value, max);
        scope.$apply(function () {
          scope.bind = getRate(value, max);
        });
        if (scope.execute !== void 0) {
          scope.$apply(scope.execute);
        }
      });
    }
  };
});