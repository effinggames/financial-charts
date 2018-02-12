(function() {
  'use strict';
  const Highcharts = window.Highcharts;
  const angular = window.angular;

  angular.module('app').directive('allocationChart', function() {
    return {
      restrict: 'A',
      scope: {
        chartData: '&',
        chartTitle: '@',
        returnsAxisTitle: '@',
        allocationAxisTitle: '@',
        allocationPercentageMin: '&',
        allocationPercentageMax: '&'
      },
      link: function($scope, $elem) {
        const returnsData = $scope
          .chartData()
          .filter(i => i.return_10)
          .map(i => [new Date(i.date).getTime(), parseFloat((i.return_10 * 100).toFixed(2))]);
        const allocationData = $scope
          .chartData()
          .map(i => [new Date(i.date).getTime(), parseFloat((i.percentage * 100).toFixed(2))]);

        $elem.highcharts({
          chart: {
            alignTicks: false,
            type: 'spline'
          },
          title: {
            text: $scope.chartTitle
          },
          subtitle: {
            useHTML: true,
            text: `
              <a class="chartSubtitle"
                  href="http://www.philosophicaleconomics.com/2013/12/the-single-greatest-predictor-of-future-stock-market-returns/"
                  target="_blank">
                  Source: Philosophical Economics
              </a>
            `
          },
          yAxis: [
            {
              // Primary yAxis
              labels: {
                format: '{value}%',
                style: {
                  color: '#000'
                }
              },
              title: {
                text: $scope.allocationAxisTitle,
                style: {
                  color: '#000'
                }
              },
              tickInterval: 5,
              endOnTick: false,
              startOnTick: false,
              maxPadding: 0,
              minPadding: 0,
              max: $scope.allocationPercentageMax(),
              min: $scope.allocationPercentageMin()
            },
            {
              // Secondary yAxis
              title: {
                text: $scope.returnsAxisTitle,
                style: {
                  color: '#000'
                }
              },
              labels: {
                format: '{value}%',
                style: {
                  color: '#000'
                }
              },
              opposite: true,
              reversed: true,
              gridLineWidth: 0,
              tickInterval: 1,
              endOnTick: false,
              startOnTick: false,
              maxPadding: 0,
              minPadding: 0,
              max: 24,
              min: -7.5
            }
          ],
          xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: {
              year: '%Y'
            },
            title: {
              text: 'Date'
            },
            tickInterval: Date.UTC(2010, 1, 1) - Date.UTC(2010, 0, 1)
          },
          tooltip: {
            snap: 0,
            shared: true,
            crosshairs: true,
            followPointer: true,
            dateTimeLabelFormats: {
              month: '%Y-%m-%d'
            },
            positioner: function(labelWidth, labelHeight, point) {
              const chart = this.chart;
              const tooltipY = Math.max(point.plotY + chart.plotTop - 20, chart.plotTop);
              let tooltipX;

              if (point.plotX - labelWidth < 0) {
                tooltipX = point.plotX + chart.plotLeft + 20; //right side
              } else {
                tooltipX = point.plotX + chart.plotLeft - labelWidth - 20; //left side
              }

              return {
                x: tooltipX,
                y: tooltipY
              };
            }
          },
          legend: {
            layout: 'vertical',
            align: 'left',
            x: 120,
            y: 40,
            verticalAlign: 'top',
            floating: true,
            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
          },
          plotOptions: {
            series: {
              tooltip: {
                valueSuffix: '%'
              },
              lineWidth: 2.5
            },
            spline: {
              marker: {
                enabled: false
              }
            }
          },
          series: [
            {
              name: $scope.returnsAxisTitle,
              yAxis: 1,
              data: returnsData,
              tooltip: {
                valueSuffix: ' %'
              },
              color: 'rgb(0, 3, 109)',
              zIndex: 10
            },
            {
              name: $scope.allocationAxisTitle,
              data: allocationData,
              color: 'rgb(182, 0, 0)'
            }
          ]
        });
      }
    };
  });
})();
