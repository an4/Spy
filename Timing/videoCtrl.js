'use strict';

var videoCtrl = angular.module('VideoCtrl', []);

videoCtrl.controller("VideoCtrl", ['$scope', '$http',
    function($scope, $http) {
        $scope.video = {};

        var URL50 = '/Files/test_50.html';
        var URL60 = '/Files/test_60.html';
        var URL100 = '/Files/test_100.html';
        var URL200 = '/Files/test_200.html';

        var URLcached50 = '/Files/test_50_cached.html';
        var URLcached60 = '/Files/test_60_cached.html';
        var URLcached100 = '/Files/test_100_cached.html';
        var URLcached200 = '/Files/test_200_cached.html';

        function time_video_basic(url, name) {
            var s = document.createElement('video');
            var time = 0;
            s.onerror = function() {
                timeError = window.performance.now();
                time =  timeError - timeLoad;
                console.log(name + ": " + time);
            };
            s.onloadstart = function() {
                timeLoad = window.performance.now();
            };
            var start = window.performance.now(), timeLoad, timeError;
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
                    console.log("Average time: " + (sum/results.length));
                }
            };

            s.onloadstart = function() {
                timeLoad = window.performance.now();
            };

            var start = window.performance.now(), timeLoad, timeCanPlay, timeError;
            s.src = url;
        };

        var totalResults = [];

        function getPDF(input) {
            var arr = [];
            for(var i=0; i<100; i++) {
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
            var output = [];
            input.forEach(function(el) {
                output.push(getPDF(el));
            });
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

        $scope.time_video_50 = function () {
            var results = [];
            time_video(URL50, '50', 0, results);
        };

        $scope.time_video_cached_50 = function () {
            var results = [];
            time_video(URLcached50, '50', 0, results);
        };

        $scope.time_video_60 = function () {
            var results = [];
            time_video(URL60, '60', 0, results);
        };

        $scope.time_video_cached_60 = function () {
            var results = [];
            time_video(URLcached60, '60', 0, results);
        };

        $scope.time_video_100 = function () {
            var results = [];
            time_video(URL100, '100', 0, results);
        };

        $scope.time_video_cached_100 = function () {
            var results = [];
            time_video(URLcached100, '100', 0, results);
        };

        $scope.time_video_200 = function () {
            var results = [];
            time_video(URL200, '200', 0, results);
        };

        $scope.time_video_cached_200 = function () {
            var results = [];
            time_video(URLcached200, '200', 0, results);
        };

        $scope.time_video_all_files = function() {
            var input = [
                {url: URL50, name: '50'},
                {url: URL60, name: '60'},
                {url: URL100, name: '100'},
                {url: URL200, name: '200'},
            ];

            totalResults = [];

            var results = [];
            var current = 0;
            time_video_all(input[current].url, input[current].name, 0, results, current, input);
        };

        $scope.time_video_cached_all_files = function() {
            var input = [
                {url: URLcached50, name: '50'},
                {url: URLcached60, name: '60'},
                {url: URLcached100, name: '100'},
                {url: URLcached200, name: '200'},
            ];

            totalResults = [];

            var results = [];
            var current = 0;
            time_video_all(input[current].url, input[current].name, 0, results, current, input);
        };
}]);
