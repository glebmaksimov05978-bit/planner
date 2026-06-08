// Service Worker для push уведомлений
const CACHE_NAME = 'planner-v1';

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(clients.claim());
});

// Обработка уведомлений
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window' }).then(clientList => {
      if (clientList.length > 0) {
        return clientList[0].focus();
      }
      return clients.openWindow('/');
    })
  );
});

// Получение сообщений от страницы
self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SCHEDULE_NOTIFICATION') {
    const { id, title, body, delay } = e.data;
    setTimeout(() => {
      self.registration.showNotification(title, {
        body,
        icon: 'https://emojicdn.elk.sh/📅?style=apple',
        badge: 'https://emojicdn.elk.sh/📅?style=apple',
        tag: id,
        requireInteraction: false,
        vibrate: [200, 100, 200],
        data: { id }
      });
    }, delay);
  }

  if (e.data && e.data.type === 'CANCEL_NOTIFICATION') {
    // отменяем через tag
    self.registration.getNotifications({ tag: e.data.id }).then(notifications => {
      notifications.forEach(n => n.close());
    });
  }
});
