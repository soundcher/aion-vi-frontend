// Минимальный service worker — нужен, чтобы Android/Chrome
// предложили "Установить приложение", а не просто "Добавить ярлык".
// Кеширование не делаем намеренно — данные (анализы, курс валют
// расчётов) должны быть всегда свежими, не устаревшими из кеша.

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Просто пропускаем все запросы напрямую в сеть — без кеша.
  event.respondWith(fetch(event.request));
});
