// service-worker.js
self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
});

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
});

// ����ł́A���̏����������Ȃ���Service Worker���L���Ɣ��肳��Ȃ��悤�ł�
self.addEventListener('fetch', function(event) {});

self.addEventListener("push", function(event) {
  event.waitUntil(
    self.registration.pushManager.getSubscription()
      .then(function(subscription) {
        if (subscription) {
          return subscription.endpoint
        }
        throw new Error('User not subscribed')
    })
    .then(function(res) {
      return fetch('/notifications.json')
    })
    .then(function(res) {
      if (res.status === 200) {
        return res.json()
      }
      throw new Error('notification api response error')
    })
    .then(function(res) {
      return self.registration.showNotification(res.title, {
        icon: '/icon-192.png',
        body: res.body
      })
    })
  )
})