'use strict';

var scriptCtrl = angular.module('ScriptCtrl', []);

function time_script(url) {
    window.onerror = function() {
        var d = performance.now() - window.start;
        console.log("parsing done " + d);
    };
    var s = document.createElement('script');
    document.body.appendChild(s);
    s.onload = function() {
        console.log("script downloaded");
        window.start = window.performance.now();
    };
    s.src = url;
};

// time_script('/Files/test_50.js');

scriptCtrl.controller("ScriptCtrl", ['$scope', '$http',
    function($scope, $http) {

}]);
