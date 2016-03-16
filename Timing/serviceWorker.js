var CACHE_VERSION = 1;
var CURRENT_CACHES = {
  mycache: 'my-cache-v-' + CACHE_VERSION
};

// var link = new Request('https://www.facebook.com/adumitras', {mode: 'no-cors'});
var link = new Request('https://www.facebook.com/adumitras');
// var link = new Request('https://www.facebook.com/adumitras?callback=undefined&q=show+tables&format=json&_=1457815470997', {mode: 'no-cors'});

self.addEventListener('install', function(event) {
    var urlsToCache = [
        '/Files/sw_50.html',
        // '/Files/sw_100.html',
        // '/Files/sw_150.html',
        // '/Files/sw_200.html',
        // '/Files/sw_250.html',
        // '/Files/sw_300.html',
        // '/Files/sw_350.html',
        // '/Files/sw_400.html',
        // '/Files/sw_450.html',
        // '/Files/sw_500.html',
        // '/Files/sw_550.html',
        // '/Files/sw_600.html',
        // '/Files/sw_650.html',
        // '/Files/sw_700.html',
        // '/Files/sw_750.html',
        // '/Files/sw_800.html',
        // '/Files/sw_850.html',
        // '/Files/sw_900.html',
        // '/Files/sw_950.html',
        // '/Files/sw_1000.html'
        // link
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

// self.addEventListener('fetch', function(event) {
//     // console.log('Fetch event:', event.request.url);
//
//     // event.respondWith(
//         // Check if request is already cached.
//         caches.match(event.request).then(function(response) {
//             if (response) {
//                 // console.log('Found in cache:', response);
//                 return response;
//             }
//
//             var fetchRequest = event.request.clone();
//             return fetch(fetchRequest).then(function(response) {
//                 var responseToCache = response.clone();
//                 var time = 0;
//                 caches.open(CURRENT_CACHES['mycache']).then(function(cache) {
//                     var cacheRequest = event.request.clone();
//                     // console.log("Add to cache:" + cacheRequest);
//                     var start_time = performance.now();
//
//                     // add and remove 10 times using promises
//                     cache.put(cacheRequest, responseToCache).then(function() {
//                         var end_time = performance.now();
//                         time = end_time - start_time;
//                         console.log("Put: " + time);
//                         cache.delete(cacheRequest);
//                     });
//                 });
//
//                 return response;
//             });
//         })
//     // );
// });

/**
 * Deletes an item from cache and then adds it back to cache.
 */
function deletePut(url, cache) {
    return new Promise(function(resolve, reject) {
        cache.delete(url).then(function(response) {
            cache.put(url, new Response()).then(function() {
                resolve(true);
            })
        })
    });
};

/**
 * Adds an item to cache and then deletes it from cache.
 */
function putDelete(url, response, cache) {
    return new Promise(function(resolve, reject) {
        cache.put(url, response).then(function() {
            cache.delete(url).then(function(res) {
                resolve(true);
            })
        })
    });
};

// Check is the request matches the URLs currently storred in cache, like a triggered
// Fetch some random url and keep the request object and use that to put and delete from cache.
self.addEventListener('fetch', function(event) {
    caches.match(event.request).then(function(response) {
        // if the request matches any of the URLs storred in the Cache object.
        if (response) {
            var url = 'http://localhost:8080/Files/sw_500.html';

            var ITERATIONS = 10;

            caches.open(CURRENT_CACHES['mycache']).then(function(cache) {
                // fetch URL to obtain the request object
                fetch(url).then(function(response) {
                    var promises = [];
                    var end;
                    var start = performance.now();

                    promises[0] = putDelete(url, response.clone(), cache);

                    for(var i=1; i<ITERATIONS; i++) {
                        promises[i] = promises[i-1].then(function(val) {
                            return putDelete(url, response.clone(), cache);
                        })
                    }

                    promises[i-1].then(function(val) {
                        end = performance.now();
                        var time = end - start;
                        console.log("Time :" + time + ", " + response.url);
                    });
                });
            });
        }
    });
});
