importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.1/workbox-sw.js');

workbox.setConfig({
  debug: true,
});
workbox.skipWaiting();
workbox.clientsClaim();

self.__precacheManifest = [].concat(self.__precacheManifest || []);

// precahce and route asserts built by webpack
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
// Precache shell page
workbox.precaching.precacheAndRoute([
  {
    url: '/shell',
    revision: 'abc',
  }
]);

// return app shell for all navigation requests
workbox.routing.registerNavigationRoute('/shell');