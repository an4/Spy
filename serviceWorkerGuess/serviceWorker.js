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
    var url100 = 'https://raw.githubusercontent.com/an4/Data-Storage/master/100kB.html';
    var url200 = 'https://raw.githubusercontent.com/an4/Data-Storage/master/200kB.html';

    caches.open(CURRENT_CACHES['mycache']).then(function(cache) {
        var time_100 = 0;
        var time_200 = 0;
        var fetchRequest = event.request.clone();
        fetch(url100).then(function(response_100) {
            var start_100 = performance.now();
            var end_100;
            putDelete(url100, response_100, cache).then(function(val) {
                end_100 = performance.now();
                time_100 = end_100 - start_100;
                console.log("Time 100kB: " + time_100);
                fetch(url200).then(function(response_200) {
                    var start_200 = performance.now();
                    var end_200;
                    putDelete(url200, response_200, cache).then(function(val) {
                        end_200 = performance.now();
                        time_200 = end_200 - start_200;
                        console.log("Time 200kB: " + time_200);
                        fetch(fetchRequest).then(function(response) {
                            var end;
                            var cacheRequest = event.request.clone();
                            var start = performance.now();

                            putDelete(cacheRequest, response.clone(), cache).then(function(val) {
                                end = performance.now();
                                var time = end - start;
                                TIME = time;
                                console.log("Time :" + time + ", " + event.request.url);

                                // Approximate size.
                                var size = 0;
                                if(time > time_100) {
                                    time -= time_100;
                                    size += 100;
                                    var timeStep = time_200 - time_100;
                                    var x = time/timeStep;
                                    size = size + 100 * x;
                                } else {
                                    size = 100;
                                }

                                console.log("Size :" + size);

                                if(PORT) {
                                    PORT.postMessage(time);
                                }
                            });
                        });
                    });
                });
            });
        });
    });
});

self.addEventListener('message', function(event){
    // Establish connection.
    console.log(event.data);
    PORT = event.ports[0];
});
