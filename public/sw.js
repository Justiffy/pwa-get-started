importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js');

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);
} else {
  console.log(`Boo! Workbox didn't load 😬`);
}

workbox.routing.registerRoute(
  /\.js$/,
  new workbox.strategies.NetworkFirst()
);

const CACHE_NAME = 'offline-page';
const FALLBACK_HTML_URL = '/offline.html';

self.addEventListener('install', async (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.add(FALLBACK_HTML_URL))
  );
});

workbox.navigationPreload.enable();

const networkOnly = new workbox.strategies.NetworkOnly();
const navigationHandler = async (params) => {
  try {
    return await networkOnly.handle(params);
  } catch (error) {
    return caches.match(FALLBACK_HTML_URL, {
      cacheName: CACHE_NAME,
    });
  }
};

workbox.routing.registerRoute(
  new workbox.routing.NavigationRoute(navigationHandler)
);