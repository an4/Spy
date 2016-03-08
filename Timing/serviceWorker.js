// importScripts('serviceworker-cache-polyfill.js');

var CACHE_VERSION = 1;
var CURRENT_CACHES = {
  mycache: 'my-cache-v-' + CACHE_VERSION
};

self.addEventListener('install', function(event) {
    var urlsToCache = [
      '/Files/test_50_sw.html',
      '/Files/test_60_sw.html',
      '/Files/test_100_sw.html',
      '/Files/test_200_sw.html',
      new Request('https://www.facebook.com/adumitras', {mode: 'no-cors'}),
    ];

    event.waitUntil(
        caches.open(CURRENT_CACHES['mycache']).then(function(cache) {
            cache.addAll(urlsToCache.map(function(urlToCache) {
                return new Request(urlToCache, {mode: 'no-cors'});
            })).then(function() {
                console.log('All urls have been fetched and cached.');
            });
        }).catch(function(error) {
            console.error('Cache failed:', error);
        })
    );
});

self.addEventListener('activate', function(event) {
    // Delete all caches that aren't named in CURRENT_CACHES.
    var expectedCacheNames = Object.keys(CURRENT_CACHES).map(function(key) {
        return CURRENT_CACHES[key];
    });

    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (expectedCacheNames.indexOf(cacheName) == -1) {
                        console.log('Deleted out of date cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', function(event) {
    console.log("Fetching...");
    event.respondWith(
        caches.match(event.request)
    );
});

// self.addEventListener('fetch', function(event) {
//     console.log('Fetch event:', event.request.url);
//
//     event.respondWith(
//         caches.match(event.request).then(function(response) {
//             if (response) {
//                 console.log('Found in cache:', response);
//                 return response;
//             }
//
//             console.log('No response found in cache. Fetch from network...');
//
//             var fetchRequest = event.request.clone();
//
//             return fetch(fetchRequest).then(function(response) {
//                 if(!response || response.status !== 200 || response.type !== 'basic') {
//                     return response;
//                 }
//
//                 var responseToCache = response.clone();
//
//                 caches.open(CURRENT_CACHES['mycache']).then(function(cache) {
//                     var cacheRequest = event.request.clone();
//                     console.log("Add to cache:" + cacheRequest);
//                     cache.put(cacheRequest, responseToCache);
//                 });
//
//                 return response;
//             });
//         })
//     );
// });
