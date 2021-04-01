var router = require("express").Router();
const { google } = require("googleapis");
var axios = require('axios')
const classroom = google.classroom("v1")
var config = require('../config')

// Imports the Google Cloud client library
const {PubSub} = require('@google-cloud/pubsub');
// Creates a client; cache this for further use
const pubSubClient = new PubSub();

async function getClassroom(req, res) {
  token = req.query.access_token
  const class_id = req.query.class_id;

  // locally, replace these env variables with references to config.js

  const oauth2Client = new google.auth.OAuth2(
    config.google.client,
    config.google.secret
  );

  oauth2Client.credentials = {access_token: token}

  google.options({
    auth: oauth2Client
  });


  classroom.courses.get(
    {
      id: class_id
    }, (err, result) => 
    {
      res.json(result.data)
    }
  )
}

async function getClassrooms(req, res) {
  token = req.query.access_token

  // TODO attach this oath client thing to the login so we are logged in without
  // needing to do it every time

  const oauth2Client = new google.auth.OAuth2(
    config.google.client,
    config.google.secret
  );

  oauth2Client.credentials = {access_token: token}

  google.options({
    auth: oauth2Client
  });

  classroom.courses.list(
    {
      teacherId: 'me'
    }, (err, result) => 
    {
      if(err) {
        console.log('Problem finding courses')
        res.status(404).send('Error finding teacher course list.')
      }
      res.json(result.data.courses)}
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
    console.log('subscription already exists')
    res.status(200).send()
  }
  res.status(200).send()
}

async function pushMethod(req, res) {
  console.log(Buffer.from(req.body.message.data, 'base64').toString());
  res.status(200).send()
}

router.get('/classroom', getClassroom)
router.get('/createpush', pushTopic)
router.post('/push', pushMethod)

router.get('/classrooms', getClassrooms)

module.exports = router;