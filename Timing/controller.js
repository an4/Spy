'use strict';

var app = angular.module('TheApp', [
    'ngRoute',
    'googlechart'
]);

app.config(['$routeProvider', '$locationProvider', '$httpProvider',
    function($routeProvider, $locationProvider, $httpProvider) {
        $routeProvider.
            when('/basic', {
                templateUrl: 'main.html',
                controller: 'MainController'
            }).
            when('/cache', {
                templateUrl: 'main.html',
                controller: 'MainController'
            }).
            when('/sw', {
                templateUrl: 'serviceWorker.html',
                controller: 'ServiceWorkerCtrl'
            });
            // otherwise({
            //     redirectTo: '/'
            // });

            $locationProvider.html5Mode({
                enabled: true,
                requireBase: false
            });
  }]);
