var myApp = angular.module('myApp');
myApp.directive('lineChart', ['d3Service', '$parse', function (d3Service, $parse)
{
    var d3 = d3Service.d3;
    return {
        restrict: 'EA',
        scope:{
          data: '=',
          key: '@',
          valueProp: '@',
          label: '@',
          type: '@'
        },
        link: function(scope, element)
        {
            var lineTypeList = [
              'linear','linear-closed', 'step', 'step-before', 'step-after',
              'basis', 'basis-open', 'basis-close', 'bundle', 'cardinal',
              'cardinal-open', 'cardinal-close', 'monotone'
              ];
              
            var margin = {
              top   : 40,
              right : 40,
              bottom: 40,
              left  : 90
            };
            
            var size = {
              width : 1000,
              height: 400
            };
            
            //TODO 
            var parseDate = d3.time.format("%Y/%m").parse;
            
            //Xのメモリを日付にする
            var x = d3.time.scale()
              .range([0, size.width - margin.left - margin.right]); //実際の出力のサイズ
            
            var y = d3.scale.linear()
              .range([size.height - margin.top - margin.bottom, 0]);
            
            var xAxis = d3.svg.axis()
              .scale(x)
              .orient("bottom").tickFormat(d3.time.format("%Y/%m"));

            var yAxis = d3.svg.axis()
              .scale(y)
              .orient("left");


            // // $watchリスナの登録解除関数格納用.
            var watched = {}; 

            // (Angular) $parseでCollection要素へのアクセサを確保しておく.
            var getId = $parse(scope.key || 'Id');
            var getValue = $parse(scope.valueProp || 'value');
            var getLabel = $parse(scope.label || 'name');
            
            //(Angular) Collectionの要素変動を監視.
            scope.$watchCollection('data', function()
            {
                d3.select(element[0]).remove();
                if(!scope.data)
                {
                  return;
                }
                
                //描画エリアを生成
                var svg = d3.select(element[0])
                                  .append('svg')
                                  .attr("width", "100%")
                                  .attr("height", size.height)
                                  .append("g")
                                  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
                
                
                var lineType = getType(scope.type);
                
                //d3.svg.line()で座標値を計算して線の種類を設定
                var line = d3.svg.line()
                  .x(
                    function(d, i)
                    {
                      return x(d.date); 
                    }
                  )
                  .y(
                    function(d, i)
                    { 
                      return y(d.price);
                    }
                  )
                  .interpolate(lineType);

                //TODO
                scope.data.forEach(function(d)
                {
                    d.date = parseDate(d.date);
                    d.price = +d.price;
                });
                
                //表X軸、Y軸のメモリを設定する
                x.domain(d3.extent(scope.data, function(d){ return d.date; }));
                y.domain(d3.extent(scope.data, function(d){ return d.price; }));

                // 描画
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
                    .style("text-anchor", "end");

                svg.append("path")
                  .datum(scope.data)
                  .attr("class", "line-main")
                  .attr("d", line);
                
            });
            
            function getType(type)
            {
                if (-1 === lineTypeList.indexOf(type))
                {
                    return lineTypeList[0];
                }
                return type;
            }
        }
    };
}]);