var CACHE_VERSION = 1;
var CURRENT_CACHES = {
  mycache: 'my-cache-v-' + CACHE_VERSION
};

var PORT;

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

function putDeleteOnce(url, response, cache) {
    return new Promise(function(resolve, reject) {
        var end;
        var start = performance.now();
        cache.put(url, response.clone()).then(function() {
            end = performance.now();
            var time = end-start;
            cache.delete(url).then(function(res) {
                resolve(time);
            });
        });
    });
};

function getMin(arr) {
    arr.sort();
    return arr[0];
}

function putDelete(url, response, cache) {
    return new Promise(function(resolve, reject) {
        var promises = [];
        var iterations = 25;

        var times = [];

        promises[0] = putDeleteOnce(url, response, cache);
        for(var i=1; i<iterations; i++) {
            promises[i] = promises[i-1].then(function(time) {
                times.push(time);
                return putDeleteOnce(url, response, cache);
            });
        }

        promises[i-1].then(function(time) {
            times.push(time);
            var min = getMin(times);
            resolve(min);
        });
    });

}

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
            putDelete(url100, response_100, cache).then(function(t_100) {
                time_100 = t_100;
                // console.log("Time 100kB: " + time_100);
                fetch(url200).then(function(response_200) {
                    putDelete(url200, response_200, cache).then(function(t_200) {
                        time_200 = t_200;
                        // console.log("Time 200kB: " + time_200);
                        fetch(fetchRequest).then(function(response) {
                            var end;
                            var cacheRequest = event.request.clone();
                            var start = performance.now();

                            putDelete(cacheRequest, response.clone(), cache).then(function(t) {
                                var time = t;
                                TIME = time;
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

                                if(PORT) {
                                    PORT.postMessage({'size' : size, 'url': event.request.url});
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
