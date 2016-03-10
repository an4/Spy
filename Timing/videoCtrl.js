'use strict';

var videoCtrl = angular.module('VideoCtrl', []);

videoCtrl.controller("VideoCtrl", ['$scope', '$http', '$location',
    function($scope, $http, $location) {
///////////////////////////////////////////////////////////////
///////////////////// TIME VIDEO METHODS //////////////////////
///////////////////////////////////////////////////////////////
        $scope.video = {};

        function getTimeVideoOnce(url) {
            return new Promise(function(resolve, reject) {
                var video = document.createElement('video');
                // The error is only triggered when the file has finished parsing
                video.onerror = function() {
                    timeError = window.performance.now();
                    var time = timeError - timeLoad;
                    resolve(time);
                };
                // Start timing once the resource is loaded and parsing begins.
                video.onloadstart = function() {
                    timeLoad = window.performance.now();
                };
                var timeLoad, timeError;
                video.src = url;
            });
        };

        function getTimeVideoFile(file) {
            return new Promise(function(resolve, reject) {
                var ROUNDS = $scope.video.rounds;

                // Array of all promises to be resolved;
                var promises = [];
                // Array of times for current file.
                var times = [];

                promises[0] = getTimeVideoOnce(file.url);
                for(var i=1; i<ROUNDS; i++) {
                    promises[i] = promises[i-1].then(function(time) {
                        times.push(time);
                        return getTimeVideoOnce(file.url);
                    });
                }

                promises[i-1].then(function(time) {
                    times.push(time);
                    var result = {};
                    result.url = file.url;
                    result.times = times;
                    result.name = file.name;
                    result.size = file.size;
                    resolve(result);
                });
            });
        };

        function getTimeVideoAll(files) {
            return new Promise(function(resolve, reject) {
                var promises = [];
                var results = [];

                promises[0] = getTimeVideoFile(files.shift());

                for(var i=0; i<files.length; i++) {
                    promises[i+1] = promises[i].then(function(result) {
                        console.log(result.name);
                        results.push(result);
                        return getTimeVideoFile(files.shift());
                    });
                }

                promises[i].then(function(result) {
                    console.log(result.name);
                    results.push(result);
                    resolve(results);
                });
            });
        };

/////////////////////////////////////////////////////////
//////////////////// COLOURS & LINES ////////////////////
/////////////////////////////////////////////////////////

        var totalResults = [];

        function getPDF(input, bin_size) {
            var arr = [];
            for(var i=0; i<$scope.video.Xaxis * bin_size; i++) {
                arr[i] = 0;
            }
            input.forEach(function(el) {
                var x = Math.floor(el * bin_size);
                if(x < arr.length) {
                    arr[x]++;
                }
            });
            return arr;
        };

        function draw(files) {
            var bin_size = 1/$scope.video.binSize;

            $scope.chartObject.type = "LineChart";
            $scope.chartObject.displayed = false;
            $scope.chartObject.data = {"cols": [], "rows": []};

            // Add labels
            $scope.chartObject.data.cols.push({id: "Seconds", label: "Time", type: "string"});

            // Add chart data for each file
            files.forEach(function(file) {
                var col = {};
                col.id = file.name;
                col.label = file.name;
                col.type = "number";
                $scope.chartObject.data.cols.push(col);
            });

            //  Add more colours;
            $scope.chartObject.options = {
                "title": "External resource load time. Samples: " + $scope.video.rounds ,
                "isStacked": "true",
                "vAxis": {
                    "gridlines": {
                        "count": 10
                    }
                },
                "hAxis": {
                    "title": "Milliseconds"
                }
            };

            // X-axis labels
            var label_data = [];
            for(var i=0; i<$scope.video.Xaxis*bin_size; i++) {
                label_data.push(i/bin_size);
            }

            // Get array of times for each file.
            var times = [];
            files.forEach(function(file) {
                times.push(getPDF(file.times, bin_size));
            });

            // Add times for each file at each time step.
            for(var i=0; i<$scope.video.Xaxis*bin_size; i++) {
                var row = {};
                row.c = [];
                // Add time step value
                row.c.push({v: label_data[i]});
                // Add times for each file at current time step.
                for(var j=0; j<times.length; j++) {
                    row.c.push({v: times[j][i]})
                }
                // row.c = [{v: label_data[i]}, {v: output[0][i]}, {v: output[1][i]}, {v: output[2][i]}, {v: output[3][i]}];
                $scope.chartObject.data.rows.push(row);
            }

            $scope.$apply();
        };

/////////////////////////////////////////////////////////
////////////////// BUTTONS & UI /////////////////////////
/////////////////////////////////////////////////////////

        $scope.time_video = function() {
            var path = "/Files/";

            // Change this based on URL
            var type = "";
            if($location.path() === '/videocached') {
                type = "cache";
            }
            if($location.path() === '/video') {
                type = "test";
            }

            var files = [
                // {size:   "50", url: path+type+"_50.html",   name: "50kB"},
                {size:  "100", url: path+type+"_100.html",  name: "100kB"},
                // {size:  "150", url: path+type+"_150.html",  name: "150kB"},
                {size:  "200", url: path+type+"_200.html",  name: "200kB"},
                // {size:  "250", url: path+type+"_250.html",  name: "250kB"},
                {size:  "300", url: path+type+"_300a.html", name: "300kB"},
                // {size:  "350", url: path+type+"_350.html",  name: "350kB"},
                {size:  "400", url: path+type+"_400.html",  name: "400kB"},
                // {size:  "450", url: path+type+"_450.html",  name: "450kB"},
                {size:  "500", url: path+type+"_500.html",  name: "500kB"},
                // {size:  "550", url: path+type+"_550.html",  name: "550kB"},
                {size:  "600", url: path+type+"_600.html",  name: "600kB"},
                // {size:  "650", url: path+type+"_650.html",  name: "650kB"},
                {size:  "700", url: path+type+"_700.html",  name: "700kB"},
                // {size:  "750", url: path+type+"_750.html",  name: "750kB"},
                {size:  "800", url: path+type+"_800.html",  name: "800kB"},
                // {size:  "850", url: path+type+"_850.html",  name: "850kB"},
                {size:  "900", url: path+type+"_900.html",  name: "900kB"},
                // {size:  "950", url: path+type+"_950.html",  name: "950kB"},
                {size: "1000", url: path+type+"_1000.html", name: "1000kB"}
            ];

            getTimeVideoAll(files).then(function(results) {
                $scope.chartObject = {};
                draw(results);
            });
        };

////////////////////////////////////////////////////////////////////////////////////////////////////
// Service Worker MAGIC
////////////////////////////////////////////////////////////////////////////////////////////////////
        function resourceLoad(url) {
            return new Promise(function(resolve, reject) {
                var s = document.createElement('video');
                s.onerror = function() {
                    timeError = window.performance.now();
                    var time =  timeError - timeLoad;
                    resolve(time);
                };
                s.onloadstart = function() {
                    timeLoad = window.performance.now();
                };
                var timeLoad, timeError;
                s.src = url;
            });

        };

}]);
