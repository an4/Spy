// importScripts('serviceworker-cache-polyfill.js');

var CACHE_VERSION = 1;
var CURRENT_CACHES = {
  mycache: 'my-cache-v-' + CACHE_VERSION
};

var link = new Request('https://www.facebook.com/adumitras', {mode: 'no-cors'});
var link = new Request('https://www.facebook.com/adumitras');
// var link = new Request('https://www.facebook.com/adumitras?callback=undefined&q=show+tables&format=json&_=1457815470997', {mode: 'no-cors'});

self.addEventListener('install', function(event) {
    var urlsToCache = [
        '/Files/sw_50.html',
        '/Files/sw_100.html',
        '/Files/sw_150.html',
        '/Files/sw_200.html',
        '/Files/sw_250.html',
        '/Files/sw_300.html',
        '/Files/sw_350.html',
        '/Files/sw_400.html',
        '/Files/sw_450.html',
        '/Files/sw_500.html',
        '/Files/sw_550.html',
        '/Files/sw_600.html',
        '/Files/sw_650.html',
        '/Files/sw_700.html',
        '/Files/sw_750.html',
        '/Files/sw_800.html',
        '/Files/sw_850.html',
        '/Files/sw_900.html',
        '/Files/sw_950.html',
        '/Files/sw_1000.html',
        link
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
    console.log('Fetch event:', event.request.url);

    event.respondWith(
        caches.match(event.request).then(function(response) {
            if (response) {
                console.log('Found in cache:', response);
                return response;
            }

            console.log('No response found in cache. Fetch from network...');

            var fetchRequest = event.request.clone();

            return fetch(fetchRequest).then(function(response) {
                if(!response || response.status !== 200 || response.type !== 'basic') {
                    return response;
                }

                var responseToCache = response.clone();

                caches.open(CURRENT_CACHES['mycache']).then(function(cache) {
                    var cacheRequest = event.request.clone();
                    console.log("Add to cache:" + cacheRequest);
                    cache.put(cacheRequest, responseToCache);
                });

                return response;
            });
        })
    );
});

// self.addEventListener('fetch', function(event) {
//     console.log("Fetching ...");
//     var response;
//     event.respondWith(caches.match(event.request).catch(function() {
//         return fetch(event.request);
//     }).then(function(r) {
//         response = r;
//         caches.open(CURRENT_CACHES['mycache']).then(function(cache) {
//             cache.put(event.request, response);
//         });
//         console.log("Here!");
//         return response.clone();
//     }).catch(function() {
//         return caches.match('/Files/sw_50.html');
//     }));
// });
