var size = 8 * 1024 * 1024;

// Buffer of size 8MB
var buffer = new ArrayBuffer(size);
var view = new DataView(buffer);

var offset = 64;

var startAddress = 0;

var error_count = 0;

var current;

var flushed = [];
var unflushed = [];
var flushed_sum = 0;
var unflushed_sum = 0;

var max_time = 0;

// initialize linked list
for (var i = 0; i < ((size) / offset) - 1; i++) {
    view.setUint32(i * offset, (i+1) * offset);
}
view.setUint32((((size) / offset) - 1 ) * offset, 0);

// numbber of rounds to test the attack
var rounds = 100;

// 10 ^ 6
// JavaScript HighResolution Time API provides sub milliseconds time measurements (10^-3 s)
// Multiplying by 10^-6 provides time measurements in nano seconds, easier to read and display.

var times = 1000000;

// Variable
var x = 0;

for(var round = 0; round < rounds; round++) {
    // access all elements in view to add them to the cache, start from random value and
    // access it as a linked list.
    startAddress = Math.floor((Math.random() * (size/offset))) * offset;
    current = startAddress;
    do {
        current = view.getUint32(current);
    } while (current != startAddress);

    var startTimeRAM = window.performance.now();
    current = x;
    var endTimeRAM = window.performance.now();

    // access the previous variable again, this time from the cache
    var startTimeCache = window.performance.now();
    current = x;
    var endTimeCache = window.performance.now();

    var diffTimeRAM = Math.floor((endTimeRAM - startTimeRAM) * times);
    flushed.push(diffTimeRAM);
    flushed_sum  += diffTimeRAM;

    var diffTimeCache = Math.floor((endTimeCache - startTimeCache) * times);
    unflushed.push(diffTimeCache);
    unflushed_sum += diffTimeCache;

    if(max_time < diffTimeRAM) {
        max_time = diffTimeRAM
    }
    if(max_time < diffTimeCache) {
        max_time = diffTimeCache;
    }

    if(diffTimeRAM < diffTimeCache) {
        error_count++;
    }
}

console.log("Flushed avg: " + (flushed_sum/rounds));
console.log("Unflushed avg: " + (unflushed_sum/rounds));
console.log("Error count: " +  error_count);

///////////////////////////////////////////////////////////////////////////////////////////////////
// Google Chart Drawing
///////////////////////////////////////////////////////////////////////////////////////////////////

google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
    var rawData = [];
    rawData.push(["Time step", "Access Time from RAM - Flushed", "Access Time from Cache - Unflushed"]);
    for(var i=0; i<rounds; i++) {
        rawData.push([i, flushed[i], unflushed[i]]);
    }

    var data = google.visualization.arrayToDataTable(rawData);

    var options = {
        title: 'Variable access time',
        curveType: 'function',
        legend: { position: 'bottom' },
        vAxis: {
            title: "Time (ns)",
            viewWindow: {
                min: 0,
                max: 500
            },
            ticks: [0, 100, 200, 300, 400, 500]
        },
        hAxis: {
            title: "Round",
            viewWindow: {
                min: 0,
                max: 100
            },
            ticks: [0, 25, 50, 75, 100]
        }
    };

    var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));
    chart.draw(data, options);
}
