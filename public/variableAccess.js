var buffer = new ArrayBuffer(8192 * 1024);
var view = new DataView(buffer);

var offset = 64;
var S = {}
for (var i=0; i<8192*1024/offset; i++) {
  S[i] = false;
}

function accessMembers(set) {
  Object.keys(set).forEach(function(member) {
    view.getUint32(member * offset);
  });
};

var flushed = []
var unflushed = []
flushed.push(['a', 'a']);
unflushed.push(['a', 'a']);

function testAccessTime(i) {
    var x = 0;

    var startTime1 = window.performance.now();
    var current1 = x;
    var endTime1 = window.performance.now();
    var diffTime1 = endTime1 - startTime1;
    // console.log("Unflushed: " + diffTime1);

    unflushed.push([i, diffTime1]);

    accessMembers(S);

    var startTime2 = window.performance.now();
    var current2 = x;
    var endTime2 = window.performance.now();
    var diffTime2 = endTime2 - startTime2;
    // console.log("Flushed: " + diffTime2);

    // return diffTime2 - diffTime1;
    flushed.push([i, diffTime2]);
};

var sum = 0;

var itr = 500;
var l = 0;
for(var i=0; i<itr; i++) {
    testAccessTime();
}

console.log("Here");

// Visualization

google.charts.load("current", {packages:["corechart"]});
google.charts.setOnLoadCallback(drawChart);
function drawChart() {
  var data = google.visualization.arrayToDataTable(flushed);

  console.log(data);

  var options = {
    title: 'WTF',
    legend: { position: 'none' },
  };

  var chart = new google.visualization.Histogram(document.getElementById('chart_div'));
  chart.draw(data, options);

}
