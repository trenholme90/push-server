
var firebase = require('firebase/app');
require('firebase/database');
var admin = require("firebase-admin");
var express = require('express');
const pushServer = express();
const subscribeServer = express();
var httpPush = require('http').Server(pushServer);
var httpSubscribe = require('http').Server(subscribeServer);
var io = require('socket.io')(httpPush)

// Initialize Firebase
var serviceAccount = require("./pwa-push-notifications-firebase.json");

// Load the Push Server page
pushServer.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

// Push Server on localhost:3000
httpPush.listen(3000, function(){
  console.log('listening on *:3000');
});

// Load the Subscribe page
subscribeServer.get('/', function (req, res) {
  res.sendFile(__dirname + '/subscribe/index.html');
});

// Get all files in subscribe
subscribeServer.use(express.static('./subscribe'))

// Subscribe Server on localhost:8080
httpSubscribe.listen(8080, function(){
  console.log('listening on *:8080');
});

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://pwa-push-notifications-f93c1.firebaseio.com"
})

// Socket.io allows for communication between the webpage and the node server
// First connect to the socket in the browser 
io.on('connection', function(socket) {
  // Listning for the sendMessage function to triggered in the browser
  socket.on('sendMessage', function(msg) {
    new Promise( function (resolve, reject) {
      try {
        resolve(sendPushNotification(msg))
      } catch(err) {
        console.log(reject(err))
      }
    })
  })
});

function sendPushNotification(msg) {
  new Promise( function (resolve, reject) {
    try {
      resolve(getDbInfo('/tokens'))
    } catch(err) {
      reject(console.log(err))
    }
  })
  .then(function(tokens) {
    let tokenValues = [] 
    new Promise( function () {
      try {
        for (let token in tokens) {
          tokenValues.push(tokens[token])
        }
      } catch(err) {
        reject(console.log(err))
      }
    })
    return tokenValues
  })
  .then(function(registrationTokens) {

    var message = {
      data: {
        title: 'Jet2holidays.com',
        text: msg,
        tag: 'all'
      },
      tokens: registrationTokens
    };

    new Promise( function () {
      try {
        return serverPush(message)
      } catch(err) {
        reject(console.log(err))
      }
    })
  })
  .catch(function(err){
    console.log(err)
  })
} 

// Send a message to the device corresponding to the provided
// registration token.
function serverPush(message) {
  admin.messaging().sendMulticast(message)
    .then(() => {
        return true
    })
    .catch((error) => {
      var errorMessage = JSON.stringify(error)
      console.log(errorMessage);
      return false
    });
}

function getDbInfo(info) {
  var database = admin.database()
  
  // Get subscription details from firebase
  var dbInfo = database.ref(`/${info}`)
  //Get the data from the database 
  return new Promise( function (resolve, reject) {
    try {
      dbInfo.on('value', function(snapshot) {
        resolve(snapshot.val()) 
      })
    } catch(err) {
      console.log(reject(err))
    }
  })  
}