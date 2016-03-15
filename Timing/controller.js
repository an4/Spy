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

// time_video('http://www.facebook.com/groups/208547725916026', 'In');
// time_video('http://www.facebook.com/groups/852392078107320', 'Out');
