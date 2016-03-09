'use strict';

var videoCtrl = angular.module('VideoCtrl', []);

videoCtrl.controller("VideoCtrl", ['$scope', '$http', '$location',
    function($scope, $http, $location) {

        // All urls
        var URL = [
            {size: "50", url: "/Files/test_50.html", name: "50kB"},
            // {size: "100", url: "/Files/test_100.html", name: "100kB"},
            // {size: "150", url: "/Files/test_150.html", name: "150kB"},
            // {size: "200", url: "/Files/test_200.html", name: "200kB"},
            // {size: "250", url: "/Files/test_250.html", name: "250kB"},
            // {size: "300", url: "/Files/test_300.html", name: "300kB"},
            // {size: "350", url: "/Files/test_350.html", name: "350kB"},
            // {size: "400", url: "/Files/test_400.html", name: "400kB"},
            // {size: "450", url: "/Files/test_450.html", name: "450kB"},
            // {size: "500", url: "/Files/test_500.html", name: "500kB"},
            // {size: "550", url: "/Files/test_550.html", name: "550kB"},
            // {size: "600", url: "/Files/test_600.html", name: "600kB"},
            // {size: "650", url: "/Files/test_650.html", name: "650kB"},
            // {size: "700", url: "/Files/test_700.html", name: "700kB"},
            // {size: "750", url: "/Files/test_750.html", name: "750kB"},
            // {size: "800", url: "/Files/test_800.html", name: "800kB"},
            // {size: "850", url: "/Files/test_850.html", name: "850kB"},
            // {size: "900", url: "/Files/test_900.html", name: "900kB"},
            // {size: "950", url: "/Files/test_950.html", name: "950kB"},
            {size: "1000", url: "/Files/test_1000.html", name: "1000kB"}
        ];

        var URL50 = '/Files/test_50.html';
        var URL60 = '/Files/test_60.html';
        var URL100 = '/Files/test_100.html';
        var URL200 = '/Files/test_200.html';

        var URLcached50 = '/Files/test_50_cached.html';
        var URLcached60 = '/Files/test_60_cached.html';
        var URLcached100 = '/Files/test_100_cached.html';
        var URLcached200 = '/Files/test_200_cached.html';

        var URLsw50 = '/Files/test_50_sw.html';
        var URLsw60 = '/Files/test_60_sw.html';
        var URLsw100 = '/Files/test_100_sw.html';
        var URLsw200 = '/Files/test_200_sw.html';

///////////////////////////////////////////////////////////////
///////////////////// TIME VIDEO METHODS //////////////////////
///////////////////////////////////////////////////////////////
        $scope.video = {};

        // function time_video_basic(url, name) {
        //     var s = document.createElement('video');
        //     s.onerror = function() {
        //         timeError = window.performance.now();
        //         var time =  timeError - timeLoad;
        //         console.log(name + ": " + time);
        //     };
        //     s.onloadstart = function() {
        //         timeLoad = window.performance.now();
        //     };
        //     var timeLoad, timeError;
        //     s.src = url;
        // };

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
                for(var i=0; i<ROUNDS; i++) {
                    promises.push(getTimeVideoOnce(file.url));
                }

                // Construct output for each file
                var result = {};
                result.url = file.url;
                result.times = times;
                result.name = file.name;
                result.size = file.size;

                // Add result to results Array
                Promise.all(promises).then(function(result) {
                    resolve(result);
                });
            });
        };

        function getTimeVideoAll(files) {
            return new Promise(function(resolve, reject) {
                var promises = [];

                files.forEach(function(file) {
                    promises.push(getTimeVideoFile(file));
                });

                Promise.all(promises).then(function(results) {
                    resolve(results);
                });
            });
        };


        // // Time video using trick to call next iteration from onerror event
        // function time_video_all(url, name, iteration, results, current, input) {
        //     var s = document.createElement('video');
        //     var time = 0;
        //
        //     s.onerror = function() {
        //         timeError = window.performance.now();
        //         time =  timeError - timeLoad;
        //         if(iteration < $scope.video.rounds) {
        //             if(time > $scope.video.limit && $scope.video.limit != 0) {
        //                 time_video_all(url, name, iteration, results, current, input);
        //             } else {
        //                 results.push(time);
        //                 time_video_all(url, name, iteration + 1, results, current, input);
        //             }
        //         } else {
        //             totalResults.push(results);
        //             current++;
        //             if(current < 4) {
        //                 results = [];
        //                 time_video_all(input[current].url, input[current].name, 0, results, current, input);
        //             } else {
        //                 drawSomething(totalResults);
        //             }
        //         }
        //     };
        //
        //     s.onloadstart = function() {
        //         timeLoad = window.performance.now();
        //     };
        //
        //     var start = window.performance.now(), timeLoad, timeCanPlay, timeError;
        //     s.src = url;
        // }


/////////////////////////////////////////////////////////
//////////////////// COLOURS & LINES ////////////////////
/////////////////////////////////////////////////////////

        var totalResults = [];

        function getPDF(input) {
            var arr = [];
            for(var i=0; i<$scope.video.Xaxis*10; i++) {
                arr[i] = 0;
            }
            input.forEach(function(el) {
                var x = Math.floor(el * 10);
                if(x < arr.length) {
                    arr[x]++;
                }
            });
            return arr;
        };

        function draw(files) {
            $scope.chartObject = {};

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
            for(var i=0; i<$scope.video.Xaxis*10; i++) {
                label_data.push(i/10.0);
            }

            // Get array of times for each file.
            var times = [];
            files.forEach(function(file) {
                times.push(getPDF(file.times));
            });

            // Add times for each file at each time step.
            for(var i=0; i<$scope.video.Xaxis*10; i++) {
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

            // $scope.$apply();
        };

/////////////////////////////////////////////////////////
////////////////// BUTTONS & UI /////////////////////////
/////////////////////////////////////////////////////////

        $scope.time_video = function() {
            // var input = [
            //     {url: URL50, name: '50'},
            //     {url: URL60, name: '60'},
            //     {url: URL100, name: '100'},
            //     {url: URL200, name: '200'},
            // ];
            //
            // if($location.path() === '/videocached') {
            //     input = [
            //         {url: URLcached50, name: '50'},
            //         {url: URLcached60, name: '60'},
            //         {url: URLcached100, name: '100'},
            //         {url: URLcached200, name: '200'},
            //     ];
            // }
            //
            // if($location.path() === '/videosw') {
            //     input = [
            //         {url: URLsw50, name: '50'},
            //         {url: URLsw60, name: '60'},
            //         {url: URLsw100, name: '100'},
            //         {url: URLsw200, name: '200'},
            //     ];
            // }

            // totalResults = [];
            //
            // var results = [];
            // var current = 0;
            // time_video_all(input[current].url, input[current].name, 0, results, current, input);

            getTimeVideoAll(URL).then(function(results) {
                console.log(results);
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

        $scope.service_worker_50 = function() {
            var end;
            // resourceLoad('https://www.facebook.com/adumitras').then(function(time) {
            resourceLoad(URLsw50).then(function(time) {
                console.log("Time: " + time);
            });
        };

}]);
