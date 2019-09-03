# push-server(forked from my other git user)
This is a proof of concept for a push server

Tools:
 - Node.js
 - Service Worker
 - firebase messaging
 - ES6

It serves two pages through node.js, one mimics a user subscribing to push notifications, the other sending push notifications to the subscriber. When the user subscribes,
their device token is stored in a firebase database ready to be used. From the other page, takes a message and when it is sent, gets the subscribed user device tokens from firebase and used firebase messaging to sent a push notification to that device.


