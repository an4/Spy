var size = 8 * 1024 * 1024;

var buffer = new ArrayBuffer(size);
var view = new DataView(buffer);

var variables = new ArrayBuffer(size);
var variables_view = new DataView(variables);

var offset = 64;

var startAddress = 0;

var error_count = 0;

var varAddress;

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
var rounds = 300;

var times = 100000;

// Choose random address for the variable
varAddress = Math.floor((Math.random() * (size/offset))) * offset;

for(var round = 0; round < rounds; round++) {
    // console.log("Round: " + round);

    // access all elements in view to add them to the cache, start from random value and
    // access it as a linked list.
    startAddress = Math.floor((Math.random() * (size/offset))) * offset;
    current = startAddress;
    do {
        current = view.getUint32(current);
    } while (current != startAddress);


    // access a variable from FLview, retrieve value from RAM
    var startTimeRAM0 = window.performance.now();
    current = variables_view.getUint32(varAddress);
    var endTimeRAM0 = window.performance.now();
    // console.log("RAM 0: " + Math.floor((endTimeRAM0 - startTimeRAM0) * times));

    // access the previous variable again, this time from the cache
    var startTimeCache0 = window.performance.now();
    current = variables_view.getUint32(varAddress);
    var endTimeCache0 = window.performance.now();
    // console.log("Cache 0: " + Math.floor((endTimeCache - startTimeCache) * times));

    // access the previous variable again, this time from the cache
    var startTimeCache = window.performance.now();
    current = variables_view.getUint32(varAddress);
    var endTimeCache = window.performance.now();

    var diffTimeCache = Math.floor((endTimeCache - startTimeCache) * times);
    // console.log("Time cache: " + diffTimeCache);
    unflushed.push(diffTimeCache);
    unflushed_sum += diffTimeCache;

    // eviction round 1
    startAddress = Math.floor((Math.random() * (size/offset))) * offset;
    current = startAddress;
    do {
        current = view.getUint32(current);
    } while (current != startAddress);

    // // eviction round 2
    // startAddress = Math.floor((Math.random() * (size/offset))) * offset;
    // current = startAddress;
    // do {
    //     current = view.getUint32(current);
    // } while (current != startAddress);

    // retrieve a variable from view, thought to be from RAM since view already occupied
    // the cache.
    var startTimeRAM = window.performance.now();

    current = variables_view.getUint32(varAddress);

    var endTimeRAM = window.performance.now();

    var diffTimeRAM = Math.floor((endTimeRAM - startTimeRAM) * times);
    // console.log("Time RAM: " + diffTimeRAM);
    flushed.push(diffTimeRAM);
    flushed_sum  += diffTimeRAM;

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
