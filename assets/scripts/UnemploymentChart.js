(function() {
    'use strict';
    const Highcharts = window.Highcharts;
    const angular = window.angular;

    angular.module('app')
        .directive('unemploymentChart', function($rootScope) {
            return {
                restrict: 'A',
                scope: {
                    unemploymentData: '&',
                    recessionData: '&',
                    chartTitle: '@'
                },
                link: function ($scope, $elem, $attrs) {
                    const recessionPlotBands = $scope.recessionData().map(i => ({
                        color: 'rgb(196,195,198)',
                        from: new Date(i.start_date).getTime(),
                        to: new Date(i.end_date).getTime()
                    }));
                    const unemploymentData = $scope.unemploymentData().map(i => [new Date(i.date).getTime(), parseFloat((parseFloat(i.percentage) * 100).toFixed(1))]);
                    const unemploymentMAData = unemploymentData.slice(12).map(function(item, index) {
                        let movingAverage = unemploymentData.slice(index, index + 12).reduce(function(total, item) {
                            return total + item[1];
                        }, 0) / 12;
                        return [item[0], parseFloat(movingAverage.toFixed(2))];
                    });

                    const recessionAlerts = [];
                    let recessionAlert = true;

                    unemploymentData.slice(12).forEach(function(item, index) {
                        const date = item[0];
                        const unemploymentRate = item[1];
                        const movingAverage = unemploymentMAData[index][1];
                        if (!recessionAlert && unemploymentRate > movingAverage) {
                            recessionAlert = true;
                            recessionAlerts.push([date, unemploymentRate]);
                        }
                        if (recessionAlert && unemploymentRate < movingAverage) {
                            recessionAlert = false;
                        }
                    });

                    //Lazy workaround
                    $rootScope.isRecessionAlert = recessionAlert;
                    $rootScope.recessionAlertDate = new Date(recessionAlerts[recessionAlerts.length - 1][0]);

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
                               href="http://www.philosophicaleconomics.com/2016/02/uetrend/"
                               target="_blank">
                                Source: Philosophical Economics
                            </a>
                            `
                        },
                        yAxis: [{ // Primary yAxis
                            labels: {
                                format: '{value}%',
                                style: {
                                    color: '#000'
                                }
                            },
                            title: {
                                text: 'Unemployment',
                                style: {
                                    color: '#000'
                                }
                            },
                            tickInterval: 5,
                            endOnTick: false,
                            startOnTick: false,
                            maxPadding: 0,
                            minPadding: 0
                        }],
                        xAxis: {
                            type: 'datetime',
                            dateTimeLabelFormats: {
                                year: '%Y'
                            },
                            title: {
                                text: 'Date'
                            },
                            tickInterval: Date.UTC(2010, 1, 1) - Date.UTC(2010, 0, 1),
                            plotBands: recessionPlotBands
                        },
                        tooltip: {
                            snap: 0,
                            shared: true,
                            crosshairs: true,
                            followPointer: true,
                            dateTimeLabelFormats: {
                                month:"%Y-%m-%d",
                            },
                            positioner: function(labelWidth, labelHeight, point) {
                                const chart = this.chart;
                                let tooltipX;
                                let tooltipY;

                                if (point.plotX - labelWidth < 0) {
                                    tooltipX = point.plotX + chart.plotLeft + 20; //right side
                                } else {
                                    tooltipX = point.plotX + chart.plotLeft - labelWidth - 20; //left side
                                }
                                tooltipY = Math.max(point.plotY + chart.plotTop - 20, chart.plotTop);
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
                                name: 'Unemployment Rate',
                                data: unemploymentData,
                                tooltip: {
                                    valueSuffix: ' %'
                                },
                                color: 'rgb(0, 3, 109)',
                                zIndex: 10,
                                id: 'unemployment'
                            },
                            {
                                name: '12 Month MA',
                                data: unemploymentMAData,
                                tooltip: {
                                    valueSuffix: ' %'
                                },
                                color: 'rgb(220, 20, 60)'
                            },
                            {
                                name: 'Recession Alert',
                                data: recessionAlerts,
                                showInLegend: false,
                                marker: {
                                    enabled: true,
                                    radius: 5,
                                    lineColor: 'rgb(59,87,17)',
                                    fillColor: 'transparent',
                                    lineWidth: 2,
                                    symbol: 'circle'
                                },
                                lineWidth: 0,
                                states: {
                                    hover: {
                                        enabled: false
                                    }
                                }
                            }
                        ]
                    });
                }
            };
        });
})();
