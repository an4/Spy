var buffer = new ArrayBuffer(8192 * 1024);
var view = new DataView(buffer);

var offset = 64;
var S = {}
for (var i=0; i<8192*1024/offset; i++) {
  S[i] = false;
}

var index = [];
for(var i=0; i<8192*1024/offset; i++) {
    index.push(i);
}

Array.prototype.shuffle = function() {
    var input = this;

    for (var i = input.length-1; i >=0; i--) {

        var randomIndex = Math.floor(Math.random()*(i+1));
        var itemAtIndex = input[randomIndex];

        input[randomIndex] = input[i];
        input[i] = itemAtIndex;
    }
    return input;
}

function accessMembers(set) {
  Object.keys(set).forEach(function(member) {
    view.getUint32(member * offset);
  });
};

// Access buffer in random order
function accessBuffer(i) {
    index.shuffle();
    if(i % 2 == 0) {
        for(var i=0; i<index.length; i++) {
            view.getFloat64(index[i] * offset);
        }
    } else {
        for(var i=index.length-1; i>=0; i--) {
            view.getFloat64(index[i] * offset);
        }
    }
};

var flushed = []
var unflushed = []

function testAccessTime(i) {
    var x = Math.random();
    x = Math.random();

    var startTime1 = window.performance.now();
    x = Math.random();
    var endTime1 = window.performance.now();
    var diffTime1 = endTime1 - startTime1;
    // console.log("Unflushed: " + diffTime1);

    unflushed.push(diffTime1);

    // for(var i=0; i<8192*1024/offset; i++) {
    //     view.getFloat64(i * offset);
    // }

    index.shuffle();
    if(i % 2 == 0) {
        for(var j=0; j<index.length; j++) {
            view.getFloat64(index[j] * offset);
        }
    } else {
        for(var j=index.length-1; j>=0; j--) {
            view.getFloat64(index[j] * offset);
        }
    }

    var startTime2 = window.performance.now();
    x = Math.random();
    var endTime2 = window.performance.now();
    var diffTime2 = endTime2 - startTime2;
    // console.log("Flushed: " + diffTime2);

    // return diffTime2 - diffTime1;
    flushed.push(diffTime2);
};

var sum = 0;

var itr = 5;
var l = 0;
for(var i=0; i<itr; i++) {
    testAccessTime();
    accessMembers(S);
}

console.log("UN " + unflushed);
console.log(flushed);


// Visualization

// google.charts.load("current", {packages:["corechart"]});
// google.charts.setOnLoadCallback(drawChart);
// function drawChart() {
//   var data = google.visualization.arrayToDataTable(flushed);
//
//   console.log(data);
//
//   var options = {
//     title: 'WTF',
//     legend: { position: 'none' },
//   };
//
//   var chart = new google.visualization.Histogram(document.getElementById('chart_div'));
//   chart.draw(data, options);
//
// }
