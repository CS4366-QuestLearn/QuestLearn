var router = require("express").Router();
const { google } = require("googleapis");
var axios = require('axios')
const classroom = google.classroom("v1")
var config = require('../config')

// Imports the Google Cloud client library
const {PubSub} = require('@google-cloud/pubsub');
// Creates a client; cache this for further use
const pubSubClient = new PubSub();

async function getClassrooms(req, res) {
  console.log('hello i am unda da wata')
  token = req.query.access_token
  console.log(token)
  res.status(200).send()

  // locally, replace these env variables with references to config.js

  const oauth2Client = new google.auth.OAuth2(
    config.google.client,
    config.google.secret
  );

  oauth2Client.credentials = {access_token: token}

  google.options({
    auth: oauth2Client
  });


  room = classroom.courses.get(
    {
      id: '274852630327'
    }, (err, res) => 
    { console.log(res.data)}
  )
}

async function pushTopic(req, res) {
  
  subscription = pubSubClient.subscription("my-topic-sub");
  res.status(200).send()

  const options = {
    pushConfig: {
      // Set to an HTTPS endpoint of your choice. If necessary, register
      // (authorize) the domain on which the server is hosted.
      pushEndpoint: `https://questlearn-server.herokuapp.com/api/google/push`,
    },
  };
  try {
  await pubSubClient
    .topic("my-topic")
    .createSubscription('my-topic-heroku-push', options);
  console.log(`Subscription created.`);
  res.status(200).send()
  }
  catch {
    console.log('already exists')
    res.status(200).send()
  }
  res.status(200).send()
}

async function pushMethod(req, res) {
  console.log(Buffer.from(req.body.message.data, 'base64').toString());
  res.status(200).send()
}

router.get('/classrooms', getClassrooms)
router.get('/createpush', pushTopic)
router.post('/push', pushMethod)

module.exports = router;