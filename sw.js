// Cache v2
var CACHE_NAME = 'cache-v2.0.0';

let moduleUrl = 'build/';

const urlsToCache = [
    '/',
    '/assets/css/prod/styles.css',
    '/js/lib/require.js',
    '/manifest.json',
    '/js/' + moduleUrl + 'init.js',
    '/js/' + moduleUrl + 'lib/knockout-3.4.1.js',
    '/js/' + moduleUrl + 'lib/pubsub.min.js',
    '/js/' + moduleUrl + 'lib/hammer.min.js',
    '/js/' + moduleUrl + 'lib/knockouch.js',
    '/js/' + moduleUrl + 'modules/game.js',
    '/js/' + moduleUrl + 'modules/complete.js',
    '/js/' + moduleUrl + 'modules/persist.js',
    '/js/' + moduleUrl + 'modules/player.js',
    '/js/' + moduleUrl + 'modules/round.js',
    '/js/' + moduleUrl + 'modules/score.js',
    '/js/' + moduleUrl + 'modules/undo.js'
];

const urlsToIgnore = [
    'lib/smoothscroll.js',
    'analytics.js',
    'use.typekit.net',
    'amazon-adsystem.com'
];

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
        for(let registration of registrations) {
            registration.update();
        } 
    })
}

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
            return fetch(event.request) || response;
        })
    );
});
