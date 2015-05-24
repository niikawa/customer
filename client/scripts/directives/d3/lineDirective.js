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
            
var margin = {
  top   : 40,
  right : 40,
  bottom: 40,
  left  : 40
};

var size = {
  width : 800,
  height: 400
};
var parseDate = d3.time.format("%Y-%m-%d").parse;
            
            // 初期化時に可視化領域の確保
            var svg = d3.select(element[0]).append('svg').style('width', '100%').attr("heigth", '100%').attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            
            var x = d3.scale.linear().range([0, size.width - margin.left - margin.right]);
            var y = d3.scale.linear().range([size.height - margin.top - margin.bottom, 0]);

            // 軸の定義
            var xAxis = d3.svg.axis().scale(x).orient("bottom").tickFormat(d3.time.format("%m"));
            var yAxis = d3.svg.axis().scale(y).orient("left");
            
            var data = [
              {date: "2015-01-01", value:20},
              {date: "2015-02-01", value:70},
              {date: "2015-03-01", value:100},
              {date: "2015-04-01", value:10},
              {date: "2015-05-01", value:69},
              {date: "2015-06-01", value:5},
              {date: "2015-07-01", value:75},
              {date: "2015-08-01", value:80},
              {date: "2015-09-01", value:55},
              {date: "2015-10-01", value:50},
              {date: "2015-11-01", value:32},
              {date: "2015-12-01", value:90}
            ];            

            // 線の定義
            var line = d3.svg.line()
                .x(function(d) { return x(d.date); })
                .y(function(d) { return y(d.value); });
            
            data.forEach(function(d){
              d.date = parseDate(d.date);
              d.value = +d.value;
            });
            
            x.domain(d3.extent(scope.data, function(d) { return d.date; }));
            y.domain(d3.extent(scope.data, function(d) { return d.value; }));
            
            
svg.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0, " + ( size.height - margin.top - margin.bottom ) + ")")
  .call(xAxis);

svg.append("g")
  .attr("class", "y axis")
  .call(yAxis)
  .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".7em")
    .style("text-anchor", "end")
    .text("値の単位");

svg.append("path")
  .datum(data)
  .attr("class", "line")
  .attr("d", line);            
            
            // // $watchリスナの登録解除関数格納用.
            // var watched = {}; 

            // // (Angular) $parseでCollection要素へのアクセサを確保しておく.
            // var getId = $parse(scope.key || 'Id');
            // var getValue = $parse(scope.valueProp || 'value');
            // var getLabel = $parse(scope.label || 'name');

            // (Angular) Collectionの要素変動を監視.
//             scope.$watchCollection('data', function()
//             {
//                 if(!scope.data)
//                 {
//                   return;
//                 }

//                 // (D3 , Angular) data関数にて, $scopeとd3のデータを紐付ける.
// //                var dataSet = svg.selectAll('g.data-group').data(scope.data, getId);

// //                var dataSet = svg.selectAll('g').data(scope.data, getId);
//                 x.domain(d3.extent(scope.data, function(d) { return d.date; }));
//                 y.domain(d3.extent(scope.data, function(d) { return d.price; }));
                
//                 // 線の定義
//                 var line = d3.svg.line()
//                     .x(function(d) { return x(d.date); })
//                     .y(function(d) { return y(d.price); });
                    
//                 // データを入力ドメインとして設定
//                 // 同時にextentで目盛りの単位が適切になるようにする
                
//                 // (D3) enter()はCollection要素の追加に対応.
//                 // var createdGroup = scope.data.enter().append('g').each(function(d)
//                 // {
//                 //     // (Angular) Collection要素毎の値に対する変更は、$watchで仕込んでいく.
//                 //     var self = d3.select(this);
//                 //     watched[getId(d)] = scope.$watch(function()
//                 //     {
//                 //         return getValue(d);
//                 //     },
//                 //     function(v)
//                 //     {
//                 //         self.select('rect').attr('width', v);
//                 //     });
//                 // });
                
//                 // (D3) exit()はCollection要素の削除に対応.
//                 // scope.data.exit().each(function(d)
//                 // {
//                 //     // (Angular) $watchに登録されたリスナを解除して、メモリリークを防ぐ.
//                 //     // var id = getId(d);
//                 //     // watched[id]();
//                 //     // delete watched[id];
//                 // }).remove();

//                 // (D3) Collection要素変動の度に再計算する箇所.
//                 scope.data.forEach(function(d)
//                 {
//                     d.date = parseDate(d.date);
//                     d.price = +d.price;
//                     console.log(d.date);
//                 });
                
//                 svg.append("g").attr("class", "x axis").call(xAxis).attr("transform", "translate(0, " + ( size.height - margin.top - margin.bottom ) + ")");
//                 svg.append("g").attr("class", "y axis").call(yAxis).append("text").attr("y", 6).attr("dy", ".71em").style("text-anchor", "end").text(getLabel);
                
//                 // path要素をsvgに表示し、折れ線グラフを設定
//                 svg.append("path")
//                     .datum(scope.data)
//                     .attr("class", "line")
//                     .attr("stroke", "black")    // 線の色を指定
//                     .attr("fill", "none")
//                     .attr("d", line);            
//             });
        }
    };
}]);