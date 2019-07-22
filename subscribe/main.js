import * as firebase from "firebase/app"
import 'firebase/database'
import 'firebase/messaging'

// Initialize Firebase
var config = {
  apiKey: "AIzaSyAEdr7SqSgZWivHQXNKJOcBjIg3jAyT-ec",
  authDomain: "pwa-push-notifications-f93c1.firebaseapp.com",
  databaseURL: "https://pwa-push-notifications-f93c1.firebaseio.com",
  projectId: "pwa-push-notifications-f93c1",
  storageBucket: "pwa-push-notifications-f93c1.appspot.com",
  messagingSenderId: "52597477453"
}

firebase.initializeApp(config)

console.log('main')
if ('serviceWorker' in navigator && 'PushManager' in window) {
  navigator.serviceWorker.register('firebase-messaging-sw.js')
  .then(function(swReg) {
    console.log('Service Worker Registered!', swReg)
    initialiseUI()
  })
   .catch(function(err) {
    console.log('Service Worker registration failed: ', err)
  });
} else {
  alert('Sorry, push messaging is not supported in your browser')
}

function initialiseUI() {
  const subscribeBtn = document.querySelector('.js-subscribe')
  subscribeBtn.addEventListener('click', () => {
    subscribe()
  })
}

function subscribe() {
  // get permission, doesn't run if they already have permission
  Notification.requestPermission(function(status) {
    console.log('Notification permission status:', status)
  })
  const messaging = firebase.messaging();
  messaging
    .requestPermission()
    .then(function () {
        console.log("Notification permission granted.")

        // get the token in the form of promise
        return messaging.getToken()
    })
    .then(function(token) {
        console.log("token is : " + token)
        const serverKey = 'key=AAAADD8N0E0:APA91bEZZ46VctxTP-QeaJLBPmzLt3xxiwwpxqm7tTkFSz9LEDXwLqDLnrdZqcQN3dGITJi3Sm2QF8poKh8bS4PHwgyorfsfBKlxeZncq4f1qbrATE95RDoVCKK9x5E7aJx73Qgc7km5'
        console.log(serverKey)
        sendToServer(token, 'tokens')      
    })
    .catch(function (err) {
        console.log("Unable to get permission to notify.", err)
    });

  messaging.onMessage(function(payload) {
      console.log("Message received. ", payload)
  })
}

function sendToServer(data, databaseRef) {
  console.log(data)
  // Fetch 'subscriptions' in the db and push user data to it
  return fetch(`https://pwa-push-notifications-f93c1.firebaseio.com/${databaseRef}.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'mode': 'no-cors'
    },
    body: JSON.stringify(data)
  })
  .then( (response) => {
    if (!(response)) {
      throw new Error('Bad response from server.')
    } else {
      return console.log('You are now subscribed')
    }
  })
  .catch( (err) => {
    console.log('An error has occured: ', err)
  })
}