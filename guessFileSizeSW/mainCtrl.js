'use strict';

angular.module('Main', ['ngMaterial']);

angular.module('Main').controller('mainCtrl', ['$scope', '$http',
    function($scope, $http) {
        // Create a Message Channel
        var msg_chan = new MessageChannel();
        navigator.serviceWorker.controller.postMessage("Connected", [msg_chan.port2]);

        $scope.sw = {};
        $scope.sw.size = 0;
        $scope.sw.show = false;

        // Given URL apporoximate size;
        $scope.guessSize = function() {
            var img = new Image();
            img.src = $scope.sw.url;
            $scope.sw.size = 0;
        };

        // Receive message from SW
        msg_chan.port1.onmessage = function(event){
            if(event.data.error){
                console.log(event.data.error);
            }else{
                if($scope.sw.url == event.data.url) {
                    $scope.sw.size = event.data.size;
                    $scope.sw.show = true;
                    $scope.$apply()
                }
            }
        };
}]);
