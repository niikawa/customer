var myApp = angular.module('myApp');
myApp.directive('lineChart', ['d3Service', '$parse', function (d3Service, $parse)
{
    var d3 = d3Service.d3;
    return {
        restrict: 'EAC',
        scope:{
          data: '=', // APLのController側とデータをやり取り.
          key: '@',
          valueProp: '@',
          label: '@'
        },
        link: function(scope, element)
        {
            var parseDate = d3.time.format("%Y-%m-%d").parse;
            
            // 初期化時に可視化領域の確保
            var svg = d3.select(element[0]).append('svg').style('width', '100%');
            
            var x = d3.time.scale();
            var y = d3.scale.linear();

            // 軸の定義
            var xAxis = d3.svg.axis().scale(x).orient("bottom");
            var yAxis = d3.svg.axis().scale(y).orient("left");
            
            // 線の定義
            var line = d3.svg.line()
                .x(function(d) { return x(d.date); })
                .y(function(d) { return y(d.price); });
                

            // $watchリスナの登録解除関数格納用.
            var watched = {}; 

            // (Angular) $parseでCollection要素へのアクセサを確保しておく.
            var getId = $parse(scope.key || 'id');
            var getValue = $parse(scope.valueProp || 'value');
            var getLabel = $parse(scope.label || 'name');

                console.log(getId);
                console.log(getValue);
                console.log(getLabel);

            // (Angular) Collectionの要素変動を監視.
            scope.$watchCollection('data', function()
            {
                if(!scope.data)
                {
                  return;
                }

                // (D3 , Angular) data関数にて, $scopeとd3のデータを紐付ける.
                var dataSet = svg.selectAll('g.data-group').data(scope.data, getId);
                
                
                
                // データを入力ドメインとして設定
                // 同時にextentで目盛りの単位が適切になるようにする
                x.domain(d3.extent(scope.date, function(d) { return d.date; }));
                y.domain(d3.extent(scope.data, function(d) { return d.price; }));
                
                svg.append("g").attr("class", "x axis").call(xAxis);
                svg.append("g").attr("class", "y axis").call(yAxis).append("text").attr("y", 6).attr("dy", ".71em").style("text-anchor", "end").text(getLabel);
                
                // (D3) enter()はCollection要素の追加に対応.
                var createdGroup = dataSet.enter().append('g').classed('data-group', true).each(function(d)
                {
                    // (Angular) Collection要素毎の値に対する変更は、$watchで仕込んでいく.
                    var self = d3.select(this);
                    watched[getId(d)] = scope.$watch(function()
                    {
                        return getValue(d);
                    },
                    function(v)
                    {
                        self.select('rect').attr('width', v);
                    });
                });
                
                // createdGroup.append('rect').attr('x', 130).attr('height', 18).attr('fill', function(d)
                // {
                //     return colorScale(d.name);
                // });
                
                // createdGroup.append('text').text(getLabel).attr('height', 15);

                // (D3) exit()はCollection要素の削除に対応.
                dataSet.exit().each(function(d)
                {
                    // (Angular) $watchに登録されたリスナを解除して、メモリリークを防ぐ.
                    var id = getId(d);
                    watched[id]();
                    delete watched[id];
                }).remove();

                // (D3) Collection要素変動の度に再計算する箇所.
                scope.data.each(function(d, i)
                {
                    d.date = d.date;
                    d.price = +d.price;
//                    console.log(d.date);
                });
                
                
                // path要素をsvgに表示し、折れ線グラフを設定
                svg.append("path")
                    .datum(scope.data)
                    .attr("class", "line")
                    .attr("d", line);                
                    
            });
        }
    };
}]);