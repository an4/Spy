'use strict';

angular.module('TheApp', []);

angular.module('TheApp').controller("MainCtrl", ['$scope', '$http',
    function($scope, $http) {
        /* 8MB buffer 8*1024*1024 bytes - */
        /* [1] https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays */
        var size = 8 * 1024 * 1024;
        var buffer = new ArrayBuffer(size);
        var lines = new DataView(buffer);

        var offset = 64;

        /* We assume a victim system with 8192 cache sets, each which l=12-way associativity*/
        var s = 8192;

        /* 12-way associative */
        var l = 12;

        /* Possible addresses 8MB/64B = 131072 / 131K */
        var addresses = size/offset;

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
        var algorithm1 = function () {

        };
}]);
