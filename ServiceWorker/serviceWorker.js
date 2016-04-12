var CACHE_VERSION = 1;
var CURRENT_CACHES = {
  mycache: 'my-cache-v-' + CACHE_VERSION
};

var PORT;

// var link = new Request('https://www.facebook.com/adumitras', {mode: 'no-cors'});
// var in_url = new Request('https://www.facebook.com/groups/208547725916026', {mode: 'no-cors'});
// var out_url = new Request('https://www.facebook.com/groups/852392078107320', {mode: 'no-cors'});

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
                TIME = time;
                console.log("Time :" + time + ", " + event.request.url);
                if(PORT) {
                    PORT.postMessage(time);
                }
            });
        });
    });
});

self.addEventListener('message', function(event){
    // Establish connection.
    console.log(event.data);
    PORT = event.ports[0];
});
