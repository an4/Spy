'use strict';

angular.module('Cover', ['ngMaterial']);

angular.module('Cover').controller('coverCtrl', ['$scope', '$http',
    function($scope, $http) {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/serviceWorker.js', {scope: '/main'}).then(function(registration) {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            }).catch(function(err) {
                console.log('ServiceWorker registration failed: ', err);
            });
        }
}]);
