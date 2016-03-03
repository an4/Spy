var CACHE_NAME = 'timing-cache-v1';

var urlsToCache = [
  '/Files/test_50_sw.html',
  '/Files/test_60_sw.html',
  '/Files/test_100_sw.html',
  '/Files/test_200_sw.html'
];

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            return response || fetch(event.request);
        })
    );
});


// this.addEventListener('activate', function(event) {
//     console.log("Activated!");
// });
//

// self.addEventListener('fetch', function(event) {
//   event.respondWith(
//     caches.match(event.request).then(function(response) {
//         console.log(event.request);
//         if (response) {
//             console.log("return reponse");
//             return response;
//         }
//         return fetch(event.request);
//       }
//     )
//   );
// });
