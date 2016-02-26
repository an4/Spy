'use strict';

var app = angular.module('TheApp', ['googlechart']);

app.controller("MainCtrl", ['$scope', '$http',
    function($scope, $http) {
        var arr_50 = [];
        var arr_60 = [];
        var arr_100 = [];
        var arr_200 = [];


        function time_image(url) {
            var img = new Image();
            img.onerror = function() {
                var end = window.performance.now();
            }
            var start = window.performance.now();
            img.src = url;
        };

        function time_video(url, name) {
            var s = document.createElement('video');

            var time = 0;

            s.onerror = function() {
                timeError = window.performance.now();
                // console.log("Time video error: " + (timeError - timeLoad) + " " + name);
                time =  timeError - timeLoad;
                console.log(name + ": " + time);
            };

            s.onloadstart = function() {
                timeLoad = window.performance.now();
            };

            var start = window.performance.now(), timeLoad, timeCanPlay, timeError;
            s.src = url;
        };

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

        function getData(iterations) {

            for(var i=0; i<iterations; i++) {
                time_video('/test_50.html', '50');
                // time_video('/test_60.html', '60');
                // time_video('/test_100.html', '100');
                // time_video('/test_200.html', '200');
            }

            //wait one minute
            // wait(60000);



        };


        $scope.run = function() {
            // time_video('https://www.facebook.com/kristianTonef', "Chris");
            // time_video('https://www.facebook.com/alina.ivan.946', "Alina");
            // time_video('https://www.facebook.com/logan.lerman.37', "Not 1");
            // time_video('https://www.facebook.com/jzelikovic', "Not 2");

            time_video('http://www.facebook.com/groups/208547725916026', 'In');
            time_video('http://www.facebook.com/groups/852392078107320', 'Out');

            time_video('/test_50.html', '50');
            time_video('/test_60.html', '60');
            time_video('/test_100.html', '100');
            time_video('/test_200.html', '200');
        };

        getData(50);

}]);
