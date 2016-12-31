var CACHE_NAME = 'blitz-cache-v1';

let moduleUrl = 'build/';

const urlsToCache = [
    '/',
    '/assets/css/prod/styles.css',
    '/js/' + moduleUrl + 'init.js',
    '/js/' + moduleUrl + 'lib/require.js',
    '/js/' + moduleUrl + 'lib/knockout-3.4.1.js',
    '/js/' + moduleUrl + 'lib/pubsub.min.js',
    '/js/' + moduleUrl + 'modules/game.js',
    '/js/' + moduleUrl + 'modules/complete.js',
    '/js/' + moduleUrl + 'modules/persist.js',
    '/js/' + moduleUrl + 'modules/player.js',
    '/js/' + moduleUrl + 'modules/round.js',
    '/js/' + moduleUrl + 'modules/score.js'
];

const urlsToIgnore = [
    'lib/smoothscroll.js',
    'analytics.js',
    'use.typekit.net',
    'amazon-adsystem.com'
];

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
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