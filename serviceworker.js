// Updated 0

var cacheName = 'rssReader';

var filesToCache = [
    '/',
    '/index.html',
    '/scripts/app.js',
    '/styles/app.css',
    '/images/reload24.png',
    '/images/rss24.png'
];

var dataCacheName = 'rssData';

self.addEventListener('install', function(event) {
  console.log('ServiceWorker installing');
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('ServiceWorker Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function(event) {
  console.log('ServiceWorker activating');
  event.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName && key !== dataCacheName) {
          console.log('ServiceWorker removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', function(event) {
  console.log('ServiceWorker fetching ', event.request.url);
  var baseUrl = 'https://query.yahooapis.com/';
  if (event.request.url.indexOf(baseUrl) > -1) {
    console.log('fetch request for feed data');
    event.respondWith(
      caches.open(dataCacheName).then(function(cache) {
        return fetch(event.request).then(function(response){
          cache.put(event.request.url, response.clone());
          return response;
        });
      })
    );
  } else {
    console.log('fetch request for app shell');
    event.respondWith(
      caches.match(event.request).then(function(response) {
        return response || fetch(event.request);
      })
    );
  }
});

self.addEventListener('push', function(event) {
  console.log('Push Notification Received', event);
  if (Notification.permission == 'granted') {

  // var title = 'Push Message.';
  // var body = 'We have received a push message.';
  // var icon = '/images/icon-192x192.png';
  // var tag = 'simple-push-demo-notification-tag';

    event.waitUntil(
      self.registration.showNotification('プッシュ通知を受信しました！').then(function(showEvent) {
    // self.registration.showNotification(title, {
    //   body: body,
    //   icon: icon,
    //   tag: tag
    // }).then(function(showEvent) {
        console.log('Notification Showed!', showEvent)
      }, function(error) {
        console.log(error);
      })
    );
  }
});

self.addEventListener('notificationclick', function(event) {
  console.log('Notification clicked.', event.notification.tag);
  // Android doesn’t close the notification when you click on it
  // See: http://crbug.com/463146
  event.notification.close();

  // This looks to see if the current is already open and
  // focuses if it is
  // event.waitUntil(clients.matchAll({
  //   type: 'window'
  // }).then(function(clientList) {
  //   for (var i = 0; i < clientList.length; i++) {
  //     var client = clientList[i];
  //     if (client.url === '/' && 'focus' in client) {
  //       return client.focus();
  //     }
  //   }
  //   if (clients.openWindow) {
  //     return clients.openWindow('/');
  //   }
  // }));
});
