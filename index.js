
var express = require('express');

const app = express();

// Load HTTP module
const http = require("http");
const hostname = '127.0.0.1';
const port = 3000;

// var firebase = require("firebase/app");
// require("firebase/messaging");
const webpush = require('web-push')

app.use('/dist', express.static('dist'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

const vapidKeys = webpush.generateVAPIDKeys()
console.log(vapidKeys.publicKey)


var server = app.listen(port)