'use strict';

angular.module('TheApp').controller("ServiceWorkerCtrl", ['$scope', '$http',
    function($scope, $http) {
        var url = 'https://www.facebook.com/adumitras';
        // var url = '/Files/sw_200.html';
        // var url = 'https://www.linkedin.com/in/anadumitras?trk=hp-identity-name?callback=JSON_CALLBACK';
        // var url = "http://public-api.wordpress.com/rest/v1/sites/wtmpeachtest.wordpress.com/posts?callback=JSON_CALLBACK";

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
            // $http.jsonp(url).then(function successCallback(response) {
            //     console.log(response);
            // }, function errorCallback(response) {
            //     console.log("Error");
            // });

            // fetch(url).then(function(response) {
            //     console.log("Done");
            // });

            var img = new Image();
            img.src = url;

            // $.ajax({
            //     url: url,
            //     dataType: "jsonp",
            //     data: {
            //         format: "json"
            //     },
            //     success: function( response ) {
            //         console.log( response );
            //     }
            // });
            send_message_to_sw("Hello!!!").then(function(response) {
                console.log("From SW: " + response);
            });
        };

        if('serviceWorker' in navigator) {
            navigator.serviceWorker.register('serviceWorker.js', {scope: '/'}).then(function(sw) {
                // registration worked!
                console.log("Scope: " + sw.scope);
            }).catch(function(error) {
                // registration failed :(
                console.log("Error: " + error);
            });
        }

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
