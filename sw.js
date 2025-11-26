const CACHE_NAME = "pool-app-v1";
const ASSETS = [
  "./",
  "./Creating_pool.html",
  "./names.html",
  "./game.html",
  "./results.html",
  "./creating_pool.css",
  "./names.css",
  "./game.css",
  "./Main.js",
  "./icon.png"
];

// Install the app and save files
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Serve files from cache when offline
self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});