const CACHE_NAME = 'tth-chat-cache-v2'; // Увеличил версию кэша для обновления
const urlsToCache = [
  '/',
  '/styles.css',
  '/script.js',
  '/socket.io/socket.io.js',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Устанавливаем сервис-воркер и кэшируем файлы
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

// Работаем с кэшем при запросах
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Если запрос есть в кэше, возвращаем его
        if (response) {
          return response;
        }
        
        // Если запроса нет в кэше, пытаемся его загрузить
        return fetch(event.request).then(function(fetchResponse) {
          // Проверяем, что запрос был успешным и подходит для кэширования
          if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
            return fetchResponse;
          }

          // Кэшируем загруженный ресурс, если это не сторонний запрос (CDN, API и т.д.)
          let responseClone = fetchResponse.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(event.request, responseClone);
          });

          return fetchResponse;
        });
      })
  );
});

// Удаление старого кэша при обновлении версии сервис-воркера
self.addEventListener('activate', function(event) {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});