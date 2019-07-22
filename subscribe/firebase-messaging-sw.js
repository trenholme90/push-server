self.addEventListener('push', function(event) {
  console.log('[Service Worker] Push Received.');
  console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);
  // showNotification(event)
  const pushData = event.data.json()
  console.log(pushData)
  const text = pushData.data.text
  const title = pushData.data.title
  const tag = event.data.tag

  const options = {
    body: text,
    icon: './assets/icons/logo.png',
    badge: './assets/icons/logo.png',
    tag
  };
  console.log(title, options)

  self.registration.showNotification(title, options)
  // event.waitUntil(notificationPromise)
});

self.addEventListener('notificationclick', function(event) {
  console.log('[Service Worker] Notification click Received.');

  event.notification.close();

  event.waitUntil(
    clients.openWindow('https://jet2holidays.com/')
  );
});

function showNotification(event) {
  console.log(event)
  console.log('new')
  return new Promise(resolve => {
    console.log(text, title, tag)
    self.registration
      .getNotifications(body)
      .then((body) => {
        console.log(body)
        const icon = `./assets/icons/logo.png`;
        return self.registration
          .showNotification( body.data.title, { 
            body: body.data.text,
            tag: body.data.tag,
            icon 
          })
      })
      .then(resolve)
  })
}