'use strict';

var navbarCtrl = angular.module('navbarCtrl', []);

navbarCtrl.controller("navbarCtrl", ['$scope', '$http', '$location',
    function($scope, $http, $location) {
        $scope.isActive = function (viewLocation) {
            var active = (viewLocation === $location.path());
            return active;
        };
}]);
