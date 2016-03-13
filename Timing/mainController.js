'use strict';

var MainController = angular.module('MainController', []);

MainController.controller('MainController', ['$scope', '$http', '$location',
    function($scope, $http, $location) {
        $scope.video = {};


///////////////////////////////////////////////////////////////
///////////////////// TIME VIDEO METHODS //////////////////////
///////////////////////////////////////////////////////////////
        function measureTimeVideo(url) {
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

///////////////////////////////////////////////////////////////
///////////////////// IMAGE VIDEO METHODS /////////////////////
///////////////////////////////////////////////////////////////
        function measureTimeImage(url) {
            return new Promise(function(resolve, reject) {
                var img = new Image();
                img.onerror = function() {
                    var end = window.performance.now();
                    var time = end-start;
                    resolve(time);
                }
                var start = window.performance.now();
                img.src = url;
            });
        };

///////////////////////////////////////////////////////////////
/////////////////////// Mutliple Files ////////////////////////
///////////////////////////////////////////////////////////////
        /**
         * Get multiple measurements for the same file
         * file - file to be measured
         * rounds - how many measurements
         * method - function used for measurement (image/video)
         */
        function getMeasurementFile(file, rounds, method) {
            return new Promise(function(resolve, reject) {
                // Array of all promises to be resolved;
                var promises = [];
                // Array of times for current file.
                var times = [];

                promises[0] = method(file.url);
                for(var i=1; i<rounds; i++) {
                    promises[i] = promises[i-1].then(function(time) {
                        times.push(time);
                        return method(file.url);
                    });
                }

                promises[i-1].then(function(time) {
                    times.push(time);
                    var result = {};
                    result.url = file.url;
                    result.times = times;
                    result.name = file.name;
                    result.size = file.size;
                    result.index = file.index;
                    resolve(result);
                });
            });
        };

        /**
         * Get multiple measurement for a list of files
         * files - array of files
         * rounds - the number of measurements for each files
         * method - function used to measure the time
         */
        function getMeasurementAll(files, rounds, method) {
            return new Promise(function(resolve, reject) {
                var promises = [];
                var results = [];

                promises[0] = getMeasurementFile(files.shift(), rounds, method);

                for(var i=0; i<files.length; i++) {
                    promises[i+1] = promises[i].then(function(result) {
                        console.log(result.name + ". Avg: " + math.mean(result.times) + ". Std: " + math.std(result.times));
                        results[result.index] = result;
                        return getMeasurementFile(files.shift(), rounds, method);
                    });
                }

                promises[i].then(function(result) {
                    console.log(result.name + ". Avg: " + math.mean(result.times) + ". Std: " + math.std(result.times));
                    results[result.index] = result;
                    resolve(results);
                });
            });
        };

/////////////////////////////////////////////////////////
//////////////////////// HELPER /////////////////////////
/////////////////////////////////////////////////////////

        /* https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle */
        /* Fisher-Yates shuffle */
        function shuffle(array) {
            for(var counter=array.length-1; counter > 0; counter--) {
                let index = Math.floor(Math.random() * counter);
                let temp = array[counter];
                array[counter] = array[index];
                array[index] = temp;
            }
            return array;
        }

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
                $scope.chartObject.data.rows.push(row);
            }

            $scope.$apply();
        };

/////////////////////////////////////////////////////////
////////////////// BUTTONS & UI /////////////////////////
/////////////////////////////////////////////////////////

        $scope.run = function() {
            var path = "/Files/";

            // Change this based on URL
            var type = "";
            if($location.path() === '/cache') {
                type = "cache";
            }
            if($location.path() === '/basic') {
                type = "test";
            }

            var type = $scope.settings.type;
            var method = 'measureTimeVideo';
            if(type === 'video') {
                method = 'measureTimeVideo';
            }
            if(type === 'image') {
                method = 'measureTimeImage';
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

            // Add original index for each file
            for(var i=0; i<files.length; i++) {
                files[i].index = i;
            }

            files = shuffle(files);

            var rounds = $scope.video.rounds;

            getMeasurementAll(files, rounds, method).then(function(results) {
                $scope.chartObject = {};
                draw(results);
            });
        };
}]);
