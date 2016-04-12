'use strict';

angular.module('Main', ['ngMaterial']);

angular.module('Main').controller('mainCtrl', ['$scope', '$http',
    function($scope, $http) {
        // Create a Message Channel
        var msg_chan = new MessageChannel();
        navigator.serviceWorker.controller.postMessage("Connected", [msg_chan.port2]);

        var url = 'https://www.facebook.com/adumitras';

        $scope.sw = {};

        $scope.in = function() {
            var in_url = 'https://www.facebook.com/groups/208547725916026';
            var img = new Image();
            img.src = in_url;
        }

        $scope.out = function() {
            var out_url = 'https://www.facebook.com/groups/852392078107320';
            var img = new Image();
            img.src = out_url;
        }

        $scope.test = function() {
            console.log("Testing...");
            var img = new Image();
            img.src = url;
        };

        $scope.anyUrl = function() {
            var img = new Image();
            img.src = $scope.sw.url;
        };

        msg_chan.port1.onmessage = function(event){
            if(event.data.error){
                console.log(event.data.error);
            }else{
                console.log(event.data);
            }
        };
}]);
