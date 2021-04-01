var router = require("express").Router();
const { google } = require("googleapis");
var axios = require('axios')
const classroom = google.classroom("v1")
var config = require('../config')

// Imports the Google Cloud client library
const {PubSub} = require('@google-cloud/pubsub');
// Creates a client; cache this for further use
const pubSubClient = new PubSub();

// Hardcoded testing function.
async function getClassroom(req, res) {
  console.log('hello i am unda da wata')
  token = req.query.access_token
  console.log(token)
  //res.status(200).send()

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
      id: '274852630327'
    }, (err, result) => 
    { 
      console.log(result.data)
      res.json(result.data)
    }
  )
}
var subscription
async function getClassrooms(req, res) {
  console.log('geting classrooms')
  subscription = pubSubClient.subscription("my-topic-heroku-push");
  if(req.query.user_type == "1") {
    console.log('user is a teacher')
  classroom.courses.list(
    {
      teacherId: 'me'
    }, (err, result) => 
    {
      if(err) {
        console.log('Problem finding courses')
        res.status(404).send('Error finding teacher course list.')
      }
      result.data.forEach(async (element) => {
        await classroom.registrations.create(
          {
            requestBody: {
              cloudPubsubTopic: {
                topicName: "projects/phonic-botany-304917/topics/my-topic"
              },
              feed: {
                feedType: "COURSE_WORK_CHANGES",
                courseWorkChangesInfo: {
                  courseId: element.id
                }      
              }
            }
          }
        )
      });
      res.json(result.data.courses)
    }
  )
    }
  else {
    classroom.courses.list(
      {
        studentId: 'me'
      }, (err, result) => 
      {
        if(err) {
          console.log('Problem finding courses')
          res.status(404).send('Error finding teacher course list.')
        }
        res.json(result.data.courses)}
    )
      }  
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


// NOT FINAL. The actual call is in quest/router.js.
// This will only get the google classroom assignments.
async function getAssignments(req, res) {
  token = req.query.access_token
  const oauth2Client = new google.auth.OAuth2(
    config.google.client,
    config.google.secret
  );

  oauth2Client.credentials = {access_token: token}

  google.options({
    auth: oauth2Client
  });

  // Example query
  // room = classroom.courses.list(
  //   {
  //     teacherId: 'me'
  //   }, (err, res) => 
  //   { console.log(res.data)}
  // )

  classroom.courses.courseWork.list(
    {
      // note: google is a little poop baby and
      // sometimes you have to do
      // "courseId" in quotes APPARENTLY since it was a 
      // path parameter

      // TODO: remove hardcoded ID
      // the course ID would be passed through the request
      courseId: req.query.class_id,
      orderBy: "updateTime desc"
    }, (err, result) => {
      result.data.courseWork.forEach(element => {
        // console.log(element)
        // element.due_date = new Date(element.dueDate.year, element.dueDate.month - 1, element.dueDate.day)
      });
      console.log(result.data.courseWork)
      res.json(result.data.courseWork)
    })
}
const oauth2Client = new google.auth.OAuth2(
  config.google.client,
  config.google.secret
);


function authorizeClient(req, res) {
  token = req.query.access_token

  oauth2Client.credentials = {access_token: token}

  google.options({
    auth: oauth2Client
  });
}

async function subscribeCoursework() {
  await classroom.registrations.create(
    {
      requestBody: {
        cloudPubsubTopic: {
          topicName: "projects/phonic-botany-304917/topics/my-topic"
        },
        feed: {
          feedType: "COURSE_WORK_CHANGES",
          courseWorkChangesInfo: {
            courseId: "274852630327"
          }      
        }
      }
    }
  )
}

router.get('/classroom', getClassroom)
router.get('/createpush', pushTopic)
router.post('/push', pushMethod)
router.get('/client', authorizeClient)
router.get('subscribe/coursework', subscribeCoursework)

router.get('/classrooms', getClassrooms)
router.get('/assignments', getAssignments)

module.exports = router;