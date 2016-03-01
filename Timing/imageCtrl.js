'use strict';

var imageCtrl = angular.module('ImageCtrl', []);

imageCtrl.controller("ImageCtrl", ['$scope', '$http',
    function($scope, $http) {
        $scope.image = {};

        function time_image_basic(url, name) {
            var img = new Image();
            img.onerror = function() {
                var end = window.performance.now();
                console.log(name + " " + (end-start));
            }
            var start = window.performance.now();
            img.src = url;
        };

        function time_image(url, name, iteration, results) {
            var img = new Image();
            img.onerror = function() {
                var end = window.performance.now();
                var time = end-start;
                if(iteration < $scope.image.rounds) {
                    if(time > $scope.image.limit && $scope.image.limit != 0) {
                        time_image(url, name, iteration, results);
                    } else {
                        results.push(time);
                        time_image(url, name, iteration + 1, results);
                    }
                } else {
                    var k = 0;
                    var sum = 0;
                    results.forEach(function(result) {
                        if($scope.image.printResults) {
                            console.log((k++) + " " + result);
                        }
                        sum += result;
                    });
                    console.log("Average time: " + (sum/results.length));
                }
            }
            var start = window.performance.now();
            img.src = url;
        };

        $scope.time_image_50 = function () {
            var results = [];
            time_image('/Files/test_50.html', '50', 0, results);
        };

        $scope.time_image_60 = function () {
            var results = [];
            time_image('/Files/test_60.html', '60', 0, results);
        };

        $scope.time_image_100 = function () {
            var results = [];
            time_video('/Files/test_100.html', '100', 0, results);
        };

        $scope.time_image_200 = function () {
            var results = [];
            time_image('/Files/test_200.html', '200', 0, results);
        };

}]);
