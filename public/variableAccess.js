$(document).ready(function () {
  //your code here


  var size = 8 * 1024 * 1024;

  var buffer = new ArrayBuffer(size);
  var view = new DataView(buffer);

  var FLbuffer = new ArrayBuffer(size);
  var FLview = new DataView(FLbuffer);

  var offset = 64;

  var current;

  var flushed = [];
  var unflushed = [];
  var flushed_sum = 0;
  var unflushed_sum = 0;

  // initialize linked list
  for (var i = 0; i < ((size) / offset) - 1; i++) {
    view.setFloat64(i * offset, (i+1) * offset);
  }
  view.setFloat64((((size) / offset) - 1 ) * offset, 0);

  var rounds = 1000;

  for(var round = 0; round < rounds; round++) {
      current = 0;

      var start = Math.floor((Math.random() * (size/offset)));
      current = start*offset;
      do {
        current = view.getFloat64(current);
      } while (current != start*offset);

      var startTime0 = window.performance.now();
      current = FLview.getFloat64(current);
      var endTime0 = window.performance.now();
      var diffTime0 = endTime0 - startTime0;
      // console.log("Time0: " + diffTime0);


      var startTime1 = window.performance.now();
      current = FLview.getFloat64(current);
      var endTime1 = window.performance.now();
      var diffTime1 = endTime1 - startTime1;
      // console.log("Time1: " + diffTime1);

      var startTime2 = window.performance.now();
      current = FLview.getFloat64(current);
      var endTime2 = window.performance.now();
      var diffTime2 = endTime2 - startTime2;
      // console.log("Time2: " + diffTime2);
      unflushed.push(diffTime2 * 10000);
      unflushed_sum += diffTime2;

      var start = Math.floor((Math.random() * (size/offset)));
      current = start*offset;
      do {
        current = view.getFloat64(current);
      } while (current != start*offset);

      var startTime3 = window.performance.now();
      current = FLview.getFloat64(current);
      var endTime3 = window.performance.now();
      var diffTime3 = endTime3 - startTime3;
      // console.log("Time3: " + diffTime3);
      flushed.push(diffTime3 * 10000);
      flushed_sum  += diffTime3;

      // if(diffTime3 < diffTime2) {
      //   console.log("ABC");
      // }
      // console.log(diffTime3 - diffTime2);


      var start = Math.floor((Math.random() * (size/offset)));
      current = start*offset;
      do {
        current = view.getFloat64(current);
      } while (current != start*offset);
  }

  console.log("Flushed avg: " + (flushed_sum/rounds));
  console.log("Unflushed avg: " + (unflushed_sum/rounds));

  plot();

  function createDataSetToPlot(data) {
      counts = {}
      data.forEach(function(el) {
        if (el in counts) {
          counts[el] += 1;
        } else {
          counts[el] = 1;
        }
      });

      pdData = []
      for (var el in counts) {
        pdData.push([el, counts[el]/data.length]);
      }

      pdData.sort(function(a,b) {return a[0] - b[0];});
      // remove outliers

      return pdData;
  }

  function plot() {
      // jqplot data visualization
      plot1 = $.jqplot("chart1", [createDataSetToPlot(flushed), createDataSetToPlot(unflushed)], {
        title: "Access Latencies : Flushed vs Unflushed",
        cursor: {
            show: false
        },
        highlighter: {
            show: true,
            showMarker: false,
            useAxesFormatters: false,
            formatString: '%d, %.1f'
        },
        axesDefaults: {
            labelRenderer: $.jqplot.CanvasAxisLabelRenderer
        },
        seriesDefaults: {
            showMarker: false
        },
        series:[
          {label: 'flushed'},
          {label: 'unflushed'},
        ],
        legend: {
          show: true,
          location: 'ne'
        },
        axes: {
            xaxis: {
                label: 'Access Latency (10^-5 seconds)',
                pad:0,
                ticks: [],
                tickOptions: {
                    formatString: "%d"
                },
                max: 11,
                min: 0
            },
            yaxis: {
                label: 'Probability Density (%)',
                forceTickAt0: true,
                pad: 0
            }
        },
        grid: {
            drawBorder: false,
            shadow: false,
            background: "white"
        }
      });

  }

});