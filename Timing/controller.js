'use strict';

var app = angular.module('TheApp', []);

app.controller("MainCtrl", ['$scope', '$http',
    function($scope, $http) {
        function time_image(url) {
            var img = new Image();
            img.onerror = function() {
                var end = window.performance.now();
            }
            var start = window.performance.now();
            img.src = url;
        };

//////////////////////////////////////////////////VIDEO/////////////////////////////////////////////
        // $scope.VIDEO_ROUNDS = 100;
        // $scope.VIDEO_LIMIT = 15;
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
                if(iteration < $scope.video.VIDEO_ROUNDS) {
                    if(time > $scope.video.VIDEO_LIMIT && $scope.video.VIDEO_LIMIT != 0) {
                        time_video(url, name, iteration, results);
                    } else {
                        results.push(time);
                        time_video(url, name, iteration + 1, results);
                    }
                } else {
                    var k = 0;
                    var sum = 0;
                    results.forEach(function(result) {
                        console.log((k++) + " " + result);
                        sum += result;
                    });
                    console.log("Average time: " + (sum/k));
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
            console.log($scope.video.VIDEO_ROUNDS);
            time_video('/test_50.html', '50', 0, results);
        }

        $scope.time_video_60 = function () {
            var results = [];
            time_video('/test_60.html', '60', 0, results);
        }

        $scope.time_video_100 = function () {
            var results = [];
            time_video('/test_100.html', '100', 0, results);
        }

        $scope.time_video_200 = function () {
            var results = [];
            time_video('/test_200.html', '200', 0, results);
        }


//////////////////////////////////////////////////VIDEO/////////////////////////////////////////////

        function time_script(url) {
            window.onerror = function() {
                var d = performance.now() - window.start;
                console.log("parsing done " + d);
            };
            var s = document.createElement('script');
            s.type = "text/javascript";
            document.body.appendChild(s);
            s.onload = function() {
                console.log("script downloaded");
                window.start = window.performance.now();
            };
            s.src = url;
        };

        function wait(ms){
            var start = new Date().getTime();
            var end = start;
            while(end < start + ms) {
                end = new Date().getTime();
            }
        }

        $scope.run = function() {
            // time_video('https://www.facebook.com/kristianTonef', "Chris");
            // time_video('https://www.facebook.com/alina.ivan.946', "Alina");
            // time_video('https://www.facebook.com/logan.lerman.37', "Not 1");
            // time_video('https://www.facebook.com/jzelikovic', "Not 2");

            // time_video('http://www.facebook.com/groups/208547725916026', 'In');
            // time_video('http://www.facebook.com/groups/852392078107320', 'Out');

            /* DON't RUN THEM AT THE SAME TIME */
            // var results = [];
            // time_video('/test_50.html', '50', 0, results);
            // time_video('/test_60.html', '60', 0, results);
            // time_video('/test_100.html', '100', 0, results);
            // time_video('/test_200.html', '200', 0, results);
        };



}]);
