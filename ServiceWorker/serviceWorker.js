var CACHE_VERSION = 1;
var CURRENT_CACHES = {
  mycache: 'my-cache-v-' + CACHE_VERSION
};

var link = new Request('https://www.facebook.com/adumitras', {mode: 'no-cors'});
// var link = new Request('https://www.facebook.com/adumitras?callback=undefined&q=show+tables&format=json&_=1457815470997', {mode: 'no-cors'});

var in_url = new Request('https://www.facebook.com/groups/208547725916026', {mode: 'no-cors'});
var out_url = new Request('https://www.facebook.com/groups/852392078107320', {mode: 'no-cors'});

self.addEventListener('install', function(event) {
    var urlsToCache = [];

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

// // EXAMPLE - Working for facebook
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
//                         // cache.delete(cacheRequest);
//                     });
//                 });
//
//                 return response;
//             });
//         })
//     );
// });

/**
 * Deletes an item from cache and then adds it back to cache.
 */
function deletePut(url, response, cache) {
    return new Promise(function(resolve, reject) {
        cache.delete(url).then(function(bool) {
            cache.put(url, response).then(function() {
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
            });
        });
    });
};

// Fetch some random url and keep the request object and use that to put and delete from cache.
self.addEventListener('fetch', function(event) {
    var url = event.request.clone();

    var ITERATIONS = 10;

    caches.open(CURRENT_CACHES['mycache']).then(function(cache) {
        // fetch URL to obtain the request object
        var fetchRequest = event.request.clone();
        fetch(fetchRequest).then(function(response) {
            var promises = [];
            var end;
            var cacheRequest = event.request.clone();
            var start = performance.now();
            // console.log("S: " + start);
            promises[0] = putDelete(cacheRequest, response.clone(), cache);

            for(var i=1; i<ITERATIONS; i++) {
                promises[i] = promises[i-1].then(function(val) {
                    // console.log(performance.now());
                    cacheRequest = event.request.clone();
                    var responseClone = response.clone();
                    return putDelete(cacheRequest, responseClone, cache);
                })
            }

            promises[i-1].then(function(val) {
                end = performance.now();
                var time = end - start;
                console.log("Time :" + time + ", " + event.request.url);
                // event.ports[0].postMessage(time);
            });
        });
    });
});

// self.addEventListener('message', function(event){
//     console.log("Client 1 Received Message: " + event.data);
//     event.ports[0].postMessage("Client 1 Says 'Hello back!'");
// });
