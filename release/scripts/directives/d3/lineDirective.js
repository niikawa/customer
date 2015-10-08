var myApp = angular.module('myApp');
myApp.directive('lineChart', [
  'd3Service',
  '$parse',
  '$window',
  function (d3Service, $parse, $window) {
    var d3 = d3Service.d3;
    return {
      restrict: 'EA',
      scope: {
        data: '=',
        type: '@',
        headerLabel: '=',
        legendLabel: '='
      },
      link: function (scope, element) {
        //画面
        var w = angular.element($window);
        var colorList = [
            '#FF8C00',
            '#A9A9A9'
          ];
        //D3.jsで表現できる線のリスト
        var lineTypeList = [
            'linear',
            'linear-closed',
            'step',
            'step-before',
            'step-after',
            'basis',
            'basis-open',
            'basis-close',
            'bundle',
            'cardinal',
            'cardinal-open',
            'cardinal-close',
            'monotone'
          ];
        //描画時のmargin  
        var margin = {
            top: 40,
            right: 40,
            bottom: 70,
            left: 90
          };
        //日付パース用
        var parseDate = d3.time.format('%Y/%m').parse;
        //dataを監視して変更があったら実行する
        scope.$watchCollection('data', function () {
          if (void 0 !== scope.headerLabel && '' !== scope.headerLabel) {
            if (element.children('p').length > 0) {
              element.children('p').remove();
            }
            var add = '<p class="line-title">' + scope.headerLabel + '</p>';
            element.append(add);
          }
          if (!scope.data)
            return;
          removeSVG();
          drowLegend(false);
          drowLine(false);
        });
        w.on('resize', function () {
          removeSVG();
          drowLegend(true);
          drowLine(true);
        });
        //---------------------
        //描画対象取得
        //---------------------
        function getType(type) {
          if (-1 === lineTypeList.indexOf(type)) {
            return lineTypeList[0];
          }
          return type;
        }
        //---------------------
        //凡例描画
        //---------------------
        function drowLegend(isResize) {
          if (void 0 === scope.legendLabel) {
            return;
          }
          var num = angular.isArray(scope.legendLabel) ? scope.legendLabel.length : 0;
          if (0 === num)
            return;
          var size = {
              width: '100%',
              height: num * 15
            };
          var svg = d3.select(element[0]).append('svg').attr('width', size.width).attr('height', size.height);
          //                var colorScale = d3.scale.category20();
          svg.selectAll('rect').data(scope.legendLabel).enter().append('rect').attr('class', 'pull-right').attr('width', 50).attr('height', 5).attr('x', w.width() - 150).attr('y', function (d, i) {
            return i * 20;
          }).attr('fill', function (d, i) {
            return colorList[i];
          });
          //ラベル生成
          svg.selectAll('text').data(scope.legendLabel).enter().append('text').text(function (d, i) {
            return d;
          }).attr('x', function (d, i) {
            return w.width() - 250;
          }).attr('y', function (d, i) {
            if (0 === i) {
              return 10;
            } else {
              return i * 5 + 20;
            }
          });
        }
        //---------------------
        //グラフ描画
        //---------------------
        function drowLine(isResize) {
          //描画サイズ  
          var size = {
              width: w.width(),
              height: w.height() / 2
            };
          var xrange = size.width - margin.left - margin.right - 50;
          var yrange = size.height - margin.top - margin.bottom;
          //Xメモリを日付にしてrangeで描画サイズを決定する
          var x = d3.time.scale().range([
              0,
              xrange
            ]);
          //yはscale
          var y = d3.scale.linear().range([
              yrange,
              0
            ]);
          //TODO 
          var xAxis = d3.svg.axis().scale(x).orient('bottom').innerTickSize(-yrange).outerTickSize(0).tickFormat(d3.time.format('%Y/%m'));
          var yAxis = d3.svg.axis().scale(y).orient('left').innerTickSize(-xrange).outerTickSize(0);
          //描画エリアを生成
          var svg = d3.select(element[0]).append('svg').attr('width', '100%').attr('height', size.height).append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
          var lineType = getType(scope.type);
          //d3.svg.line()で座標値を計算して線の種類を設定
          var line = d3.svg.line().x(function (d, i) {
              return x(d.date);
            }).y(function (d, i) {
              return y(d.price);
            }).interpolate(lineType);
          angular.forEach(scope.data, function (dataset, i) {
            //TODO
            if (isResize) {
              dataset.forEach(function (d) {
                d.date = d.date;
                d.price = +d.price;
              });
            } else {
              dataset.forEach(function (d) {
                d.date = parseDate(d.date);
                d.price = +d.price;
              });
            }
            //表X軸、Y軸のメモリを設定する
            var lineClass = 'line-avg';
            if (0 === i) {
              lineClass = 'line-main';
              x.domain(d3.extent(dataset, function (d) {
                return d.date;
              })).nice();
              y.domain(d3.extent(dataset, function (d) {
                return d.price;
              })).nice();
              // 描画
              svg.append('g').attr('class', 'x axis').attr('transform', 'translate(0, ' + (size.height - margin.top - margin.bottom) + ')').call(xAxis).selectAll('text').attr('transform', 'rotate (-70)').attr('dx', '-5em').attr('dy', '-0.1em').style('text-anchor', 'start');
              svg.append('g').attr('class', 'y axis').call(yAxis).append('text').attr('transform', 'rotate(-90)').attr('y', 6).attr('dy', '.7em').style('text-anchor', 'end');
            }
            svg.append('path').datum(dataset).attr('class', lineClass).attr('d', line);
          });
        }
        //---------------------
        //削除
        //---------------------
        function removeSVG() {
          if (element.children('svg').length > 0) {
            element.children('svg').remove();
          }
        }
      }
    };
  }
]);