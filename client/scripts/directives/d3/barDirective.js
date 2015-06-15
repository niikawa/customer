var myApp = angular.module('myApp');
myApp.directive('d3Bar', ['d3Service', '$parse', function (d3Service, $parse) {
  var d3 = d3Service.d3;
  return{
    restrict: 'EAC',
    scope:{
      data: '=', // APLのController側とデータをやり取り.
      key: '@',
      valueProp: '@',
      label: '@'
    },
    link: function(scope, element){
      // 初期化時に可視化領域の確保.a
      var svg = d3.select(element[0]).append('svg').style('width', '100%');
      var colorScale = d3.scale.category20();

      var watched = {}; // $watchリスナの登録解除関数格納用.

      // (Angular) $parseでCollection要素へのアクセサを確保しておく.
      var getId = $parse(scope.key || 'id');
      var getValue = $parse(scope.valueProp || 'value');
      var getLabel = $parse(scope.label || 'name');

      // (Angular) Collectionの要素変動を監視.
      scope.$watchCollection('data', function(){
        if(!scope.data){
          return;
        }

        // (D3 , Angular) data関数にて, $scopeとd3のデータを紐付ける.
        var dataSet = svg.selectAll('g.data-group').data(scope.data, getId);

        // (D3) enter()はCollection要素の追加に対応.
        var createdGroup = dataSet.enter()
        .append('g').classed('data-group', true)
        .each(function(d){
          // (Angular) Collection要素毎の値に対する変更は、$watchで仕込んでいく.
          var self = d3.select(this);
          watched[getId(d)] = scope.$watch(function(){
            return getValue(d);
          }, function(v){
            self.select('rect').attr('width', v);
          });
        });
        createdGroup.append('rect')
        .attr('x', 130)
        .attr('height', 18)
        .attr('fill', function(d){
          return colorScale(d.name);
        });
        createdGroup.append('text').text(getLabel).attr('height', 15);

        // (D3) exit()はCollection要素の削除に対応.
        dataSet.exit().each(function(d){
          // (Angular) $watchに登録されたリスナを解除して、メモリリークを防ぐ.
          var id = getId(d);
          watched[id]();
          delete watched[id];
        }).remove();

        // (D3) Collection要素変動の度に再計算する箇所.
        dataSet.each(function(d, i){
          var self = d3.select(this);
          self.select('rect').attr('y', i * 25);
          self.select('text').attr('y', i * 25 + 15);
        });

      });

    }
  };
}]);