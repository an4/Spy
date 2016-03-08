'use strict';

var videoCtrl = angular.module('VideoCtrl', []);

videoCtrl.controller("VideoCtrl", ['$scope', '$http', '$location',
    function($scope, $http, $location) {
        $scope.video = {};

        // All urls
        var URL = [
            {size: 50, url: "/Files/test_50.html"},
            {size: 100, url: "/Files/test_100.html"},
            {size: 150, url: "/Files/test_150.html"},
            {size: 200, url: "/Files/test_200.html"},
            {size: 250, url: "/Files/test_250.html"},
            {size: 300, url: "/Files/test_300.html"},
            {size: 350, url: "/Files/test_350.html"},
            {size: 400, url: "/Files/test_400.html"},
            {size: 450, url: "/Files/test_450.html"},
            {size: 500, url: "/Files/test_500.html"},
            {size: 550, url: "/Files/test_550.html"},
            {size: 600, url: "/Files/test_600.html"},
            {size: 650, url: "/Files/test_650.html"},
            {size: 700, url: "/Files/test_700.html"},
            {size: 750, url: "/Files/test_750.html"},
            {size: 800, url: "/Files/test_800.html"},
            {size: 850, url: "/Files/test_850.html"},
            {size: 900, url: "/Files/test_900.html"},
            {size: 950, url: "/Files/test_950.html"},
            {size: 1000, url: "/Files/test_1000.html"}
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

        function time_video_basic(url, name) {
            var s = document.createElement('video');
            s.onerror = function() {
                timeError = window.performance.now();
                var time =  timeError - timeLoad;
                console.log(name + ": " + time);
            };
            s.onloadstart = function() {
                timeLoad = window.performance.now();
            };
            var timeLoad, timeError;
            s.src = url;
        };

        function time_video(url, name, iteration, results) {
            var s = document.createElement('video');
            var time = 0;

            s.onerror = function() {
                timeError = window.performance.now();
                time =  timeError - timeLoad;
                if(iteration < $scope.video.rounds) {
                    if(time > $scope.video.limit && $scope.video.limit != 0) {
                        time_video(url, name, iteration, results);
                    } else {
                        results.push(time);
                        time_video(url, name, iteration + 1, results);
                    }
                } else {
                    var k = 0;
                    var sum = 0;
                    results.forEach(function(result) {
                        if($scope.video.print_results) {
                            console.log((k++) + " " + result);
                        }
                        sum += result;
                    });
                    // console.log("Average time: " + (sum/results.length));
                    drawSomethingSimple(results, name);
                }
            };

            s.onloadstart = function() {
                timeLoad = window.performance.now();
            };

            var start = window.performance.now(), timeLoad, timeCanPlay, timeError;
            s.src = url;
        };

        function drawSomethingSimple(results, name) {
            $scope.chartObject = {};

            $scope.chartObject.type = "LineChart";
            $scope.chartObject.displayed = false;
            $scope.chartObject.data = {
                "cols": [{
                    id: "sec",
                    label: "Time",
                    type: "string"
                }, {
                    id: name + "KB",
                    label: name + "KB",
                    type: "number"
                }],
                "rows": []};
            $scope.chartObject.options = {
                "title": "External resource load time. Samples: " + $scope.video.rounds,
                "colors": ['#AE1C28'],
                "defaultColors": ['#AE1C28'],
                "isStacked": "true",
                "displayExactValues": true,
                "vAxis": {
                    "gridlines": {
                        "count": 10
                    }
                },
                "hAxis": {
                    "title": "Milliseconds"
                }
            };

            var label_data = [];
            for(var i=0; i<$scope.video.Xaxis*10; i++) {
                label_data.push(i/10.0);
            }
            var output = getPDF(results);

            for(var i=0; i<$scope.video.Xaxis*10; i++) {
                var row = {};
                row.c = [{v: label_data[i]}, {v: output[i]}];
                $scope.chartObject.data.rows.push(row);
            }

            $scope.$apply();
        };


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

        function drawSomething(input) {
            $scope.chartObject = {};

            $scope.chartObject.type = "LineChart";
            $scope.chartObject.displayed = false;
            $scope.chartObject.data = {
                "cols": [{
                    id: "sec",
                    label: "Time",
                    type: "string"
                }, {
                    id: "50kb",
                    label: "50KB",
                    type: "number"
                }, {
                    id: "60kb",
                    label: "60KB",
                    type: "number"
                }, {
                    id: "100kb",
                    label: "100KB",
                    type: "number"
                }, {
                    id: "200kb",
                    label: "200KB",
                    type: "number"
                }],
                "rows": []};
            $scope.chartObject.options = {
                "title": "External resource load time. Samples: " + $scope.video.rounds ,
                "colors": ['#0000FF', '#009900', '#CC0000', '#DD9900'],
                "defaultColors": ['#0000FF', '#009900', '#CC0000', '#DD9900'],
                "isStacked": "true",
                "displayExactValues": true,
                "vAxis": {
                    "gridlines": {
                        "count": 10
                    }
                },
                "hAxis": {
                    "title": "Milliseconds"
                }
            };

            var label_data = [];
            for(var i=0; i<$scope.video.Xaxis*10; i++) {
                label_data.push(i/10.0);
            }
            var output = [];
            input.forEach(function(el) {
                output.push(getPDF(el));
            });

            for(var i=0; i<$scope.video.Xaxis*10; i++) {
                var row = {};
                row.c = [{v: label_data[i]}, {v: output[0][i]}, {v: output[1][i]}, {v: output[2][i]}, {v: output[3][i]}];
                $scope.chartObject.data.rows.push(row);
            }

            $scope.$apply();
        };

        function time_video_all(url, name, iteration, results, current, input) {
            var s = document.createElement('video');
            var time = 0;

            s.onerror = function() {
                timeError = window.performance.now();
                time =  timeError - timeLoad;
                if(iteration < $scope.video.rounds) {
                    if(time > $scope.video.limit && $scope.video.limit != 0) {
                        time_video_all(url, name, iteration, results, current, input);
                    } else {
                        results.push(time);
                        time_video_all(url, name, iteration + 1, results, current, input);
                    }
                } else {
                    totalResults.push(results);
                    current++;
                    if(current < 4) {
                        results = [];
                        time_video_all(input[current].url, input[current].name, 0, results, current, input);
                    } else {
                        drawSomething(totalResults);
                    }
                }
            };

            s.onloadstart = function() {
                timeLoad = window.performance.now();
            };

            var start = window.performance.now(), timeLoad, timeCanPlay, timeError;
            s.src = url;
        }

        $scope.time_video_all = function() {
            var input = [
                {url: URL50, name: '50'},
                {url: URL60, name: '60'},
                {url: URL100, name: '100'},
                {url: URL200, name: '200'},
            ];

            if($location.path() === '/videocached') {
                input = [
                    {url: URLcached50, name: '50'},
                    {url: URLcached60, name: '60'},
                    {url: URLcached100, name: '100'},
                    {url: URLcached200, name: '200'},
                ];
            }

            if($location.path() === '/videosw') {
                input = [
                    {url: URLsw50, name: '50'},
                    {url: URLsw60, name: '60'},
                    {url: URLsw100, name: '100'},
                    {url: URLsw200, name: '200'},
                ];
            }

            totalResults = [];

            var results = [];
            var current = 0;
            time_video_all(input[current].url, input[current].name, 0, results, current, input);
        };

////////////////////////////////////////////////////////////////////////////////////////////////////
// Service Worker MAGIC
////////////////////////////////////////////////////////////////////////////////////////////////////
        function resourceLoad(url) {
            return new Promise(function(resolve, reject) {
                var request = new XMLHttpRequest();
                request.open('GET', url);
                request.responseType = 'blob';

                request.onload = function() {
                    if (request.status == 200) {
                        var arrayResponse = [];
                        arrayResponse[0] = request.response;
                        arrayResponse[1] = url;
                        resolve(arrayResponse);
                    } else {
                        reject(Error('Resource didn\'t load successfully; error code:' + request.statusText));
                    }
                };

                request.onerror = function() {
                    reject(Error('There was a network error.'));
                };
                request.send();
            });
        };

        $scope.service_worker_50 = function() {
            var end;
            var start = window.performance.now();
            resourceLoad(URLsw50).then(function(arrayResponse) {
                end = window.performance.now();
                var time = end - start;
                console.log("Time: " + time);
            });
        };

}]);
