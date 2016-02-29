'use strict';

var app = angular.module('TheApp', []);

// app.config(['$routeProvider',
//   function($routeProvider) {
//     $routeProvider.
//       when('/phones', {
//         templateUrl: 'partials/phone-list.html',
//         controller: 'PhoneListCtrl'
//       }).
//       when('/phones/:phoneId', {
//         templateUrl: 'partials/phone-detail.html',
//         controller: 'PhoneDetailCtrl'
//       }).
//       otherwise({
//         redirectTo: '/phones'
//       });
//   }]);

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
        };



}]);
