var CACHE_NAME = 'timing-cache-v1';

var urlsToCache = [
  '/Files/test_50_sw.html',
  '/Files/test_60_sw.html',
  '/Files/test_100_sw.html',
  '/Files/test_200_sw.html'
];

this.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
        })
    );
});

this.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }

        return fetch(event.request);
      }
    )
  );
});
