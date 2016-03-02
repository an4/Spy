'use strict';

var scriptCtrl = angular.module('ScriptCtrl', []);

// function time_script(url) {
//     window.onerror = function() {
//         var d = performance.now() - window.start;
//         console.log("parsing done " + d);
//     };
//     var s = document.createElement('script');
//     document.body.appendChild(s);
//     s.onload = function() {
//         console.log("script downloaded");
//         window.start = window.performance.now();
//     };
//     s.src = url;
// };

// $( document ).ready(function() {
    // console.log( "ready!" );
    //
    // var s = document.createElement('script');
    //
    // window.onerror = function() {
    //     var d = performance.now() - window.start;
    //     console.log('parsing done', d);
    //     // alert('parsing done: ' +  d);
    // };
    //
    // document.body.appendChild(s);
    //
    // s.onload = function() {
    //     console.log('script downloaded');
    //     window.start = performance.now();
    // }
    // // s.src = 'http://example.com/resource';
    //
    // s.src = 'Files/test_50.js';
    //
    // function time_script() {
    //
    //     s.src = 'Files/test_50.js';
    // };

// });






// time_script('/Files/test_50.js');

scriptCtrl.controller("ScriptCtrl", ['$scope', '$http',
    function($scope, $http) {

}]);
