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


this.addEventListener('fetch', function(event) {
    var response;
    event.respondWith(caches.match(event.request).catch(function() {
        return fetch(event.request);
    }).then(function(r) {
        response = r;
        caches.open(CACHE_NAME).then(function(cache) {
            cache.put(event.request, response);
        });
        return response.clone();
    }).catch(function() {
        return caches.match('/Files/test_50_sw.html');
    }));
});

// self.addEventListener('fetch', function(event) {
//     event.respondWith(
//         caches.match(event.request).then(function(response) {
//             return response || fetch(event.request);
//         })
//     );
// });


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
