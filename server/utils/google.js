var router = require("express").Router();
const { google } = require("googleapis");
var axios = require('axios')
const classroom = google.classroom("v1")
var config = require('../config')

// Imports the Google Cloud client library
//const {PubSub} = require('@google-cloud/pubsub');

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

router.get('/classrooms', getClassrooms)

module.exports = router;