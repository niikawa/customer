var myApp = angular.module('myApp');
myApp.directive('lineChart', ['d3Service', '$parse', '$window', function (d3Service, $parse, $window)
{
    var d3 = d3Service.d3;
    return {
        restrict: 'EA',
        scope:{
          data: '=',
          type: '@'
        },
        link: function(scope, element)
        {
            //D3.jsで表現できる線のリスト
            var lineTypeList = [
              'linear','linear-closed', 'step', 'step-before', 'step-after',
              'basis', 'basis-open', 'basis-close', 'bundle', 'cardinal',
              'cardinal-open', 'cardinal-close', 'monotone'
              ];

            //
            function getType(type)
            {
                if (-1 === lineTypeList.indexOf(type))
                {
                    return lineTypeList[0];
                }
                return type;
            }

            //描画時のmargin  
            var margin = {
              top   : 40,
              right : 40,
              bottom: 40,
              left  : 90
            };
            
            var parseDate = d3.time.format("%Y/%m").parse;
            
            var w = angular.element($window);
            //描画サイズ  
            var size = {
              width : w.width(),
              height: w.height() / 1.5
            };
            
            //TODO 
            //Xのメモリを日付にする
            var x = d3.time.scale()
              .range([0, size.width - margin.left - margin.right - 50]); //実際の出力のサイズ
            
            var y = d3.scale.linear()
              .range([size.height - margin.top - margin.bottom, 0]);
            
            var xAxis = d3.svg.axis()
              .scale(x)
              .orient("bottom").tickFormat(d3.time.format("%Y/%m"));

            var yAxis = d3.svg.axis()
              .scale(y)
              .orient("left");

            //dataを監視して変更があったら実行する
            scope.$watchCollection('data', function()
            {
                if(!scope.data)
                {
                  return;
                }

                if (element.children('svg').length > 0)
                {
                    element.children('svg').remove();
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
                  
                angular.forEach(scope.data, function(dataset, i)
                {
                    //TODO
                    dataset.forEach(function(d)
                    {
                        d.date = parseDate(d.date);
                        d.price = +d.price;
                    });
                                      
                    //表X軸、Y軸のメモリを設定する
                    var lineClass = 'line-avg';
                    if (0 === i)
                    {
                        lineClass = 'line-main';
                        x.domain(d3.extent(dataset, function(d){ return d.date; }));
                        y.domain(d3.extent(dataset, function(d){ return d.price; }));
                    }
                    
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
                      .datum(dataset)
                      .attr("class", lineClass)
                      .attr("d", line);
                });
            });
            
            w.on('resize', function()
            {
                //描画サイズ  
                var size = {
                  width : w.width(),
                  height: w.height() / 1.5
                };
                
                //TODO 
                //Xのメモリを日付にする
                var x = d3.time.scale()
                  .range([0, size.width - margin.left - margin.right - 50]); //実際の出力のサイズ
                
                var y = d3.scale.linear()
                  .range([size.height - margin.top - margin.bottom, 0]);
                
                var xAxis = d3.svg.axis()
                  .scale(x)
                  .orient("bottom").tickFormat(d3.time.format("%Y/%m"));
    
                var yAxis = d3.svg.axis()
                  .scale(y)
                  .orient("left");
                  
                if(!scope.data)
                {
                  return;
                }

                if (element.children('svg').length > 0)
                {
                    element.children('svg').remove();
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
              
                angular.forEach(scope.data, function(dataset, i)
                {
                    //TODO
                    dataset.forEach(function(d)
                    {
                        d.date = d.date;
                        d.price = +d.price;
                    });
                                      
                    //表X軸、Y軸のメモリを設定する
                    var lineClass = 'line-avg';
                    if (0 === i)
                    {
                        lineClass = 'line-main';
                        x.domain(d3.extent(dataset, function(d){ return d.date; }));
                        y.domain(d3.extent(dataset, function(d){ return d.price; }));
                    }
                    
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
                      .datum(dataset)
                      .attr("class", lineClass)
                      .attr("d", line);
                });
              
              
            });
        }
    };
}]);