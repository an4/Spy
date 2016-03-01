'use strict';

var videoCtrl = angular.module('VideoCtrl', []);

videoCtrl.controller("VideoCtrl", ['$scope', '$http',
    function($scope, $http) {
        $scope.video = {};

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

        $scope.time_video_50 = function () {
            var results = [];
            time_video('/Files/test_50.html', '50', 0, results);
        };

        $scope.time_video_cached_50 = function () {
            var results = [];
            time_video('/Files/test_50_cached.html', '50', 0, results);
        };

        $scope.time_video_60 = function () {
            var results = [];
            time_video('/Files/test_60.html', '60', 0, results);
        };

        $scope.time_video_cached_60 = function () {
            var results = [];
            time_video('/Files/test_60_cached.html', '60', 0, results);
        };

        $scope.time_video_100 = function () {
            var results = [];
            time_video('/Files/test_100.html', '100', 0, results);
        };

        $scope.time_video_cached_100 = function () {
            var results = [];
            time_video('/Files/test_100_cached.html', '100', 0, results);
        };

        $scope.time_video_200 = function () {
            var results = [];
            time_video('/Files/test_200.html', '200', 0, results);
        };

        $scope.time_video_cached_200 = function () {
            var results = [];
            time_video('/Files/test_200_cached.html', '200', 0, results);
        };
}]);
