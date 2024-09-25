importScripts(
  'https://www.gstatic.com/firebasejs/10.13.1/firebase-app-compat.js'
);
importScripts(
  'https://www.gstatic.com/firebasejs/10.13.1/firebase-messaging-compat.js'
);

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
};
const messaging = firebase.messaging();

// 백그라운드 메시지 처리
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message: ', payload);

  const notificationTitle =
    payload.notification?.title || 'Default Title';
  const notificationOptions = {
    body: payload.notification?.body || 'Default body',
    icon: '/cat_calendar_192x192.png', // 원하는 아이콘으로 변경
  };

  self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});

// 푸시 알림을 수신하고 처리
self.addEventListener('push', function (event) {
  if (event.data) {
    const data = event.data.json().data;
    const options = {
      body: data.body,
      icon: data.image,
      data: {
        click_action: data.click_action,
      },
    };

    event.waitUntil(
      self.registration.showNotification(
        data.title,
        options
      )
    );
  }
});

// 알림 클릭 이벤트 처리
self.addEventListener(
  'notificationclick',
  function (event) {
    event.notification.close();

    const urlToOpen = new URL('/', self.location.origin)
      .href;

    event.waitUntil(
      clients
        .matchAll({
          type: 'window',
          includeUncontrolled: true,
        })
        .then((windowClients) => {
          for (let client of windowClients) {
            if (
              client.url === urlToOpen &&
              'focus' in client
            ) {
              return client.focus();
            }
          }
          if (clients.openWindow) {
            return clients.openWindow(urlToOpen);
          }
        })
    );
  }
);
