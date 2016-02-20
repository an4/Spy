$(document).ready(function () {
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
    var rounds = 5000;

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

        // eviction round 2
        startAddress = Math.floor((Math.random() * (size/offset))) * offset;
        current = startAddress;
        do {
            current = view.getUint32(current);
        } while (current != startAddress);

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

    drawPDF();

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
        pdData.sort(function(a,b) {return a[0] - b[0];});
    }

    return pdData;
    }

function drawPDF() {
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
            max: 80,
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
