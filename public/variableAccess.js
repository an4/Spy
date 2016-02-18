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

var rounds = 5000;

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
    unflushed.push(diffTime2);
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
    flushed.push(diffTime3);
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
