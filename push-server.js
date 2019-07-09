
var firebase = require('firebase/app');
require('firebase/database');
var admin = require("firebase-admin");
// var express = require('express');
// var router = express.Router();
var express = require('express');
const app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http)

// Initialize Firebase
var serviceAccount = require("./pwa-push-notifications-firebase.json");

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
    .then( function(pushMessageSent) {
      if(pushMessageSent) {
        console.log('Sent')
        socket.emit('responseMessage', "Thanks, you're message was sent!")
      } else {
        console.log("Something went wrong, please cntact you're nearest FED!")
        socket.emit('responseMessage', "Something went wrong, please cntact you're nearest FED!")
      }
    })
  })
  console.log('a user connected');
});

// Load the UI
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

// display on localhost:3000
http.listen(3000, function(){
  console.log('listening on *:3000');
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
    console.log(tokenValues)
    return tokenValues
  })
  .then(function(registrationTokens) {
    console.log(registrationTokens)

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
    .then((isSent) => {
      console.log(isSent)
      return isSent
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