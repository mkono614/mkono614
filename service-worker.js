// service-worker.js
self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
});

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
});

self.addEventListener('fetch', function (event) {
    event.respondWith(
      new Response('�T�[�r�X���[�J�[�������Ă��܂��I')
    );
});

self.addEventListener('push', function (event) {
    console.log('Received a push message', event);
    var title = "�v�b�V���ʒm�ł��I";
    var body = "�v�b�V���ʒm�͂��̂悤�ɂ��đ�����̂ł�";

    event.waitUntil(
        self.registration.showNotification(title, {
            body: body,
            icon: 'http://free-images.gatag.net/images/201108090000.jpg',
            tag: 'push-notification-tag'
        })
    );
});
self.addEventListener('notificationclick', function (event) {
    event.notification.close();
    clients.openWindow("/");
}, false);