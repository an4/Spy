'use strict';

var app = angular.module('TheApp', [
    'ngRoute',
    'googlechart',
    'ImageCtrl',
    'VideoCtrl',
    'navbarCtrl',
    'ScriptCtrl'
]);

app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/video', {
        templateUrl: 'video.html',
        controller: 'VideoCtrl'
      }).
      when('/videocached', {
        templateUrl: 'video.html',
        controller: 'VideoCtrl'
      }).
      when('/image', {
          templateUrl: 'image.html',
          controller: 'ImageCtrl'
      }).
      when('/script', {
          templateUrl: 'script.html',
          controller: 'ScriptCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);

// app.controller("MainCtrl", ['$scope', '$http',
//     function($scope, $http) {
//
//
//
//
//         function wait(ms){
//             var start = new Date().getTime();
//             var end = start;
//             while(end < start + ms) {
//                 end = new Date().getTime();
//             }
//         }
//
//         $scope.run = function() {
//             // time_video('https://www.facebook.com/kristianTonef', "Chris");
//             // time_video('https://www.facebook.com/alina.ivan.946', "Alina");
//             // time_video('https://www.facebook.com/logan.lerman.37', "Not 1");
//             // time_video('https://www.facebook.com/jzelikovic', "Not 2");
//
//             // time_video('http://www.facebook.com/groups/208547725916026', 'In');
//             // time_video('http://www.facebook.com/groups/852392078107320', 'Out');
//         };
//
//
//
// }]);
