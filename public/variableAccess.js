var buffer = new ArrayBuffer(8192 * 1024);
var view = new DataView(buffer);

var offset = 64;
var S = {}
for (var i=0; i<8 *1024 *1024/offset; i++) {
  S[i] = false;
}

var index = [];
for(var i=0; i<8192*1024/offset; i++) {
    index.push(i);
}

var current;

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

// initialize linked list
for (var i = 0; i < ((8192 * 1024) / offset); i++) {
  view.setFloat64(i * offset, (i+1) * offset);
}
view.setFloat64((((8192 * 1024) / offset) - 1 ) * offset, 0);


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

function testAccessTime(i) {
    var startAddress = 0;

    var startTime1 = window.performance.now();
    current = view.getFloat64(startAddress);
    var endTime1 = window.performance.now();
    var diffTime1 = endTime1 - startTime1;
    console.log("Time1: " + diffTime1);

    var startTime2 = window.performance.now();
    current = view.getFloat64(startAddress);
    var endTime2 = window.performance.now();
    var diffTime2 = endTime2 - startTime2;
    console.log("Time2: " + diffTime2);

    // Access buffer as linked list, puting it in a function does not work.
    current = 0;
    do {
      current = view.getFloat64(current);
    } while (current != 0);

    var startTime3 = window.performance.now();
    current = view.getFloat64(startAddress);
    var endTime3 = window.performance.now();
    var diffTime3 = endTime3 - startTime3;
    console.log("Time3: " + diffTime3);
};

var itr = 5;
for(var i=0; i<itr; i++) {
    testAccessTime();
    current = 0;
    do {
      current = view.getFloat64(current);
    } while (current != 0);
}
