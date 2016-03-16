'use strict';

angular.module('TheApp').controller("ServiceWorkerCtrl", ['$scope', '$http',
    function($scope, $http) {
        // var url = 'https://www.facebook.com/adumitras?callback=JSON_CALLBACK';
        // var url = 'https://www.facebook.com/adumitras';
        var url = '/Files/sw_50.html';
        // var url = 'https://www.linkedin.com/in/anadumitras?trk=hp-identity-name?callback=JSON_CALLBACK';
        // var url = "http://public-api.wordpress.com/rest/v1/sites/wtmpeachtest.wordpress.com/posts?callback=JSON_CALLBACK";

        $scope.test = function() {
            // $http.jsonp(url).then(function successCallback(response) {
            //     console.log(response);
            // }, function errorCallback(response) {
            //     console.log("Error");
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

        };

}]);
