// Service worker для PWA-установки.
// НАМЕРЕННО ничего не перехватывает и не кеширует — любая попытка
// "умно" обрабатывать запросы (как было раньше) рискует сломать
// музыку, навигацию по сайту или другие сетевые запросы.
// Присутствие обработчика fetch само по себе достаточно для того,
// чтобы браузер предложил "Установить приложение".

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', () => {
  // Пусто намеренно — не вмешиваемся ни в один запрос.
});

// ── Push-уведомления ──
// Отдельный блок, не связан с логикой выше. Просто показывает системное
// уведомление, когда сервер присылает push (см. send_push_to_user в server.py).
self.addEventListener('push', (event) => {
  let payload = { title: 'AION Vi', body: 'У тебя новое сообщение', url: '/' };
  try {
    if (event.data) payload = event.data.json();
  } catch (e) {}

  event.waitUntil(
    self.registration.showNotification(payload.title || 'AION Vi', {
      body: payload.body || '',
      icon: 'icon-192.png',
      badge: 'icon-192.png',
      data: { url: payload.url || '/' }
    })
  );
});

// Клик по уведомлению — открываем приложение (или переключаемся на уже
// открытую вкладку, если она есть, вместо дублирования).
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) || '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientsList) => {
      for (const client of clientsList) {
        if (client.url.includes(targetUrl) && 'focus' in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});
