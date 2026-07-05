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
  // Аудио/видео и запросы "по кускам" (для потокового воспроизведения)
  // НЕ трогаем — иначе браузер не может нормально проигрывать музыку.
  const isMedia = /\.(wav|mp3|ogg|m4a|mp4|webm)$/i.test(event.request.url);
  const isRangeRequest = event.request.headers.has('range');
  if (isMedia || isRangeRequest) {
    return; // пропускаем как есть, без вмешательства
  }
  event.respondWith(fetch(event.request));
});
