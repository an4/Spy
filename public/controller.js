'use strict';

angular.module('TheApp', []);

angular.module('TheApp').controller("MainCtrl", ['$scope', '$http',
    function($scope, $http) {
        /* 8MB buffer 8*1024*1024 bytes - */
        /* [1] https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays */
        var size = 8 * 1024 * 1024;
        var primeBuffer = new ArrayBuffer(size);
        var primeView = new DataView(primeBuffer);

        var offset = 64;

        /* We assume a victim system with 8192 cache sets, each which l=12-way associativity*/
        var sets = 8192;

        /* Global variable s so we can re-add it later if it is part of the same cache set */
        var s;

        /* Variable to check lines in the same cache set, maybe change value? Not sure
        why it is set to 0.*/
        var x = 0;

        /* 12-way associative */
        var l = 12;

        /* Possible addresses 8MB/64B = 131072 / 131K */
        var addresses = size/offset;

        /* Access the buffer in offsets of 1 per every 64 bytes. */
        /* Array of offsets */
        var S = {};
        /* |S| = addresses */
        for(var i=0; i<addresses; i++) {
            S[i] = false;
        }

        /* set threshold values between times */
        var threshold = 1;

        /* Access the buffer in offsets of 1 per every 64 bytes. */
        function accessMembers(set) {
            for(var key in set) {
                primeView.getUint32(key * offset);
            }
        }

        /* Helper function to measure the time it takes to retrieve a variable */
        function getTime(x) {
            var current;
            var startTime = window.performance.now();
            current = primeView.getUint32(x);
            var endTime = window.performance.now();
            return endTime - startTime;
        }

        /* Select random page s from S and remove it. */
        function removeRandomPage(set) {
            var available = Object.keys(set).filter(function(member) {return !set[member];});
            if (Object.keys(available).length == 0) {
                s = -1;
            } else {
                s = Math.floor(Math.random() * Object.keys(available).length);
                delete set[available[s]]
            }
        }

        function removeFromSameSet(el) {

        }

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
        function algorithm1() {
            var k = 100;
            while(k-- > 0) {
                // a
                accessMembers(S);

                // b

                // var current;
                // var startTime = window.performance.now();
                // current = primeView.getUint32(x);
                // var endTime = window.performance.now();
                // var diffTimeBefore = endTime - startTime;

                var diffTimeBefore = getTime(x);

                // c
                // Select random page s(global so it can be added later) from S and remove it.
                removeRandomPage(S);

                // d
                accessMembers(S);

                // e
                var diffTimeAfter = getTime(x);
                var difference = diffTimeBefore - diffTimeAfter;
                console.log(difference);

                // f
                if(difference > threshold) {
                    // Place s back into the set
                    S[s] = true;
                }

                if(Object.keys(S).length == 12) {
                    break;
                }
            }


            // Example code from the paper.
            // /* Invalidate the cache set */
            // var currentEntry = startAddress;
            // do {
            //     currentEntry = probeView.getUint32(currentEntry);
            // } while(currentEntry != startAddress);
            //
            // /* Measure access time */
            // var startTime = window.performance.now();
            // currentEntry = primeView.getUint32(variableToAccess);
            // var endTime = window.performance.now();
        };
        // end Algorithm1

        // console.log("Start algo 1");
        // algorithm1();
        // console.log("End algo 1");
}]);