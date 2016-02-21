var size = 8 * 1024 * 1024;

var buffer = new ArrayBuffer(size);
var view = new DataView(buffer);

var variables = new ArrayBuffer(size);
var variables_view = new DataView(variables);

/* ? each line has 64 bytes */
var offset = 64;

/* Possible addresses 8MB/64B = 131072 / 131K */
var addresses = size/offset;

/* Global variable s so we can re-add it later if it is part of the same cache set */
var s;

/* 12-way associative */
var l = 12;

/* Variable to check lines in the same cache set. Choose a random value for it.*/
var x = Math.floor((Math.random() * (size/offset))) * offset;

var current;

/* Threshold time. Needs to be changed. */
var threshold = 10;

/* Convert time measurement to something, not seconds. 10^5*/
var times = 100000;

/**
 * If S contains the key i, it means that the line at position offset*i is still in the set.
 * If the value associated with i is false, it means that the line at position offset*i has
 * not been checked.
 */
var S = {};
/* |S| = addresses */
for(var i=0; i<addresses; i++) {
    S[i] = false;
}

/* Initialize buffer as a linked list */
for (var i = 0; i < ((size) / offset) - 1; i++) {
    view.setUint32(i * offset, (i+1) * offset);
}
view.setUint32((((size) / offset) - 1 ) * offset, 0);

/* Choose random start address to iterate through the buffer. */
var startAddress = Math.floor((Math.random() * (size/offset))) * offset;

/**
 * Algorithm 1 Profiling a Cache Set
 * Let S be the set of currently unmapped page-aligned addresses, and address x be an
 * arbitrary page-aligned address in memory.
 *      1. Repeat k times:
 *          (a) Iteratively access all members of S.
 *          (b) Measure t_1, the time takes to access x.
 *          (c) Select a random page s from S and remove it.
 *          (d) Iteratively access all members of S/s.
 *          (e) Measure t_2, the time it takes to access x.
 *          (f) If removing s caused the memory to speed up considerably (i.e., t_1 - t_2 > thres),
 *              then this address is part of the same set as x. Place it back into S.
 *          (g) If removing s did not cause memory access to speed up considerably, then s
 *              is not part of the same set as x.
 *      2. If |S| = 12, return S. Otherwise report failure.
 */

var rounds = 100;

while (rounds > 0 && Object.keys(S).length != 12) {
    rounds--;

    // a
    Object.keys(S).forEach(function(member) {
        current = view.getUint32(member * offset);
    });

    // b
    var startTimeBefore = window.performance.now();
    current = variables_view.getUint32(x);
    var endTimeBefore = window.performance.now();
    var diffTimeBefore = Math.floor((endTimeBefore - startTimeBefore) * times);

    console.log("Time to access x before the removal: " + diffTimeBefore);

    // c
    /* Get all lines that are still in S and have not been tested */
    valid = Object.keys(S).filter(function(line) {return !S[line];});
    /* If we tried all keys or S is empty set s to -1. How can this happen? */
    if (Object.keys(valid).length == 0) {
      s = -1;
    } else {
      s = Math.floor(Math.random() * Object.keys(valid).length)
      // Remove s from S
      delete S[valid[s]]
    }

    // d
    Object.keys(S).forEach(function(member) {
        current = view.getUint32(member * offset);
    });

    // e
    var startTimeAfter = window.performance.now();
    current = variables_view.getUint32(x);
    var endTimeAfter = window.performance.now();
    var diffTimeAfter = Math.floor((endTimeAfter - startTimeAfter) * times);

    console.log("Time to access x after removing s: " + diffTimeAfter);

    // f + g
    if(diffTimeBefore - diffTimeAfter > threshold) {
        // Place s back into S and set s to true because we know s is part of the same cache set as x.
        S[s] = true;
        console.log("Found s in x's set.");
        // TODO Finding one element should give us more info. Optimization 2.
    }
}
