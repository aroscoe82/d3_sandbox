'use strict';

angular
.module('charts')
.directive('d3Bars', function($window, $timeout, d3Service) {
  return {
    restrict: 'A',
    scope: {
      data: '=',
      label: '=',
      onClick: '&'
    },
    link: function(scope, ele, attrs) {
      d3Service.d3().then(function(d3) {

        var renderTimeout;
        var margin = parseInt(attrs.margin) || 20,
        barHeight = parseInt(attrs.barHeight) || 20,
        barPadding = parseInt(attrs.barPadding) || 5;

        var svg = d3.select(ele[0])
        .append('svg')
        .style('width', '100%');

        $window.onresize = function() {
          scope.$apply();
        };

        scope.$watch(function() {
          return angular.element($window)[0].innerWidth;
        }, function() {
          scope.render(scope.data);
        });

        scope.$watch('data', function(newData) {
          scope.render(newData);
        }, true);

        scope.render = function(data) {
          svg.selectAll('*').remove();

          if (!data) return;
          if (renderTimeout) clearTimeout(renderTimeout);

          renderTimeout = $timeout(function() {
            var width = d3.select(ele[0]).node().offsetWidth - margin;
            var height = scope.data.length * (barHeight + barPadding) + 50;
            var color = d3.scale.category20();
            var xScale = d3.scale.linear()
            .domain([0, d3.max(data, function(d) {
             return d.score;
           })])
            .range([0, width]);

            svg.attr('height', height);

            svg.selectAll('rect')
               .data(data)
               .enter()
               .append('rect')
               .on('click', function(d,i) {
                  return scope.onClick({item: d});
                })
               .attr('height', barHeight)
               .attr('width', 140)
               .attr('x', Math.round(margin/2))
               .attr('y', function(d,i) {
                  return i * (barHeight + barPadding);
               })
               .attr('fill', function(d) {
                  return color(d.score);
               })
               .on('click', function(d, i) {
                  return scope.onClick({item: d});
               })
               .transition()
               .duration(1000)
               .attr('width', function(d) {
                  return xScale(d.score);
               });

            svg.selectAll('text')
               .data(data)
               .enter()
               .append('text')
               .attr('fill', '#fff')
               .attr('y', function(d,i) {
                 return i * (barHeight + barPadding) + 15;
               })
               .attr('x', 15)
               .text(function(d) {
                 return d.name + " (" + d.score + ")";
               });

            svg.append("text")
               .attr("x", (width / 2))             
               .attr("y", height - 20)
               .attr("text-anchor", "middle")  
               .style("font-size", "16px") 
               .style("text-decoration", "underline")  
               .text(scope.label);

          }, 100);
        };
      });
    }}
  })
.directive('d3Arc', function($window, $timeout, d3Service) {
  return {
    restrict: 'A',
    scope: {
      data: '=',
      onClick: '&'
    },
    link: function(scope, ele, attrs) {
      d3Service.d3().then(function(d3) {

        var arc = d3.svg.arc()
                    .innerRadius(40)
                    .outerRadius(60)
                    .startAngle(0);
        var width = 150;
        var height = 150;
        var pi = 2 * Math.PI;

        var svg = d3.select(ele[0])
                    .append('svg')
                    .attr('width', width)
                    .attr('height', height)
                    .append('g')
                    .attr('transform', 
                      'translate('+width/2+','+height/2+')');

        scope.render = function(data) {
          console.log('data: ' + data)
          svg.selectAll('*').remove();

          var background = svg.append("path")
                              .datum({endAngle: pi})
                              .style("fill", "#ddd")
                              .attr("d", arc);

          var foreground = svg.append('path')
                              .datum({endAngle: 0 * pi})
                              .style('fill', 'orange')
                              .attr('d', arc);

          setTimeout(function() {
            var percentage = scope.data / 100;

            foreground.transition()
                      .duration(1500)
                      .call(arcTween, percentage * pi)
          }, 1500);

          function arcTween(transition, angle) {
            transition.attrTween('d', function(d) {
              var interpolate = d3.interpolate(d.endAngle, angle);
              return function(t) {
                d.endAngle = interpolate(t);
                return arc(d);
              }
            });
          }
        };
        scope.render();
      });
    }}
  });