/* global self, caches, fetch */
/* eslint no-restricted-globals: 0 */

const CACHE_NAME = 'avenuecodeblog';

const STATIC_FILES = [
  '/main.css',
  '/images/logo_192x192.png',
  '/images/logo_512x512.png',
];

// Get data from the network, so save the response in the cache
const fetchAndCache = request => (
  caches.open(CACHE_NAME).then(cache => (
    fetch(request).then((fetchResponse) => {
      cache.put(request, fetchResponse.clone());
      return fetchResponse;
    })
  ))
);

/*
  Online: Cache
  No cache: Network >> Save in cache
  Offline: ¯\_(ツ)_/¯
 */
const cacheFallingBackToTheNetwork = ({ request }) => (
  caches.match(request).then(response => response || fetchAndCache(request))
);

/*
  Online: Network >> Save in cache
  Offline: Cache
  No cache: ¯\_(ツ)_/¯
 */
const networkFallingBackToTheCache = ({ request }) => (
  fetchAndCache(request).catch(() => caches.match(request))
);

// Builds a response based on the fallback strategy
const buildResponse = ({ event, fallbackStrategy }) => event.respondWith(fallbackStrategy(event));

// The very first load. Installs the service worker in the browser and save the static files
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_FILES)));
});

/*
  Adds a listener for the 'fetch' event.
  Every request, either an HTML, CSS, image or else will be handled by this method.
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const { url } = request;

  if (url === 'http://localhost:3000/') {
    // The main page will probably have new changes, such as when a new post is published.
    buildResponse({ event, fallbackStrategy: networkFallingBackToTheCache });
  } else {
    // The post page will probably have no one changes.
    buildResponse({ event, fallbackStrategy: cacheFallingBackToTheNetwork });
  }
});
