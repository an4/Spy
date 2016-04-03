'use strict';

angular.module('Main', ['ngMaterial']);

angular.module('Main').controller('mainCtrl', ['$scope', '$http',
    function($scope, $http) {
        var url = 'https://www.facebook.com/adumitras';

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

            // send_message_to_sw("Hello!!!").then(function(response) {
            //     console.log("From SW: " + response);
            // });
        };

        function send_message_to_sw(msg){
            return new Promise(function(resolve, reject){
                // Create a Message Channel
                var msg_chan = new MessageChannel();

                // Handler for recieving message reply from service worker
                msg_chan.port1.onmessage = function(event){
                    if(event.data.error){
                        reject(event.data.error);
                    }else{
                        resolve(event.data);
                    }
                };

                // Send message to service worker along with port for reply
                navigator.serviceWorker.controller.postMessage("Client 1 says '"+msg+"'", [msg_chan.port2]);
            });
        }
}]);
