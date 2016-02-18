    var size = 8 * 1024 * 1024;

    var buffer = new ArrayBuffer(size);
    var view = new DataView(buffer);

    var FLbuffer = new ArrayBuffer(size);
    var FLview = new DataView(FLbuffer);

    var offset = 64;

    var startAddress = 0;

    var current;

    // initialize linked list
    for (var i = 0; i < ((size) / offset) - 1; i++) {
      view.setFloat64(i * offset, (i+1) * offset);
    }
    view.setFloat64((((size) / offset) - 1 ) * offset, 0);


    // initialize linked list
    for (var i = 0; i < ((size) / offset) - 1; i++) {
      FLview.setFloat64(i * offset, (i+1) * offset);
    }
    FLview.setFloat64((((size) / offset) - 1 ) * offset, 0);

    var rounds = 1000;

    for(var round = 0; round < rounds; round++) {
        current = 0;
        do {
          current = view.getFloat64(current);
        } while (current != 0);

        var startTime1 = window.performance.now();
        current = FLview.getFloat64(startAddress);
        var endTime1 = window.performance.now();
        var diffTime1 = endTime1 - startTime1;
        // console.log("Time1: " + diffTime1);

        var startTime2 = window.performance.now();
        current = FLview.getFloat64(startAddress);
        var endTime2 = window.performance.now();
        var diffTime2 = endTime2 - startTime2;
        console.log("Time2: " + diffTime2);

        current = 0;
        do {
          current = view.getFloat64(current);
        } while (current != 0);

        var startTime3 = window.performance.now();
        current = FLview.getFloat64(startAddress);
        var endTime3 = window.performance.now();
        var diffTime3 = endTime3 - startTime3;
        console.log("Time3: " + diffTime3);


        var start = Math.floor((Math.random() * (size/offset)));
        current = start*offset;
        do {
          current = view.getFloat64(current);
      } while (current != start*offset);
    }
