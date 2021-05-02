/**
 * google.js: endpoints for pulling from google classroom and for pubsub integration
 */
var router = require("express").Router();
const { google } = require("googleapis");
var axios = require('axios')
const classroom = google.classroom("v1")
var config = require('../config')
var quest = require('../api/quest/quest-model')

/**
 * This is the classroom document that we have in our MongoDB collection.
 */
var mongo_classroom = require('../api/classroom/classroom-model')

// Imports the Google Cloud client library
const {PubSub} = require('@google-cloud/pubsub');
// Creates a client; cache this for further use
const pubSubClient = new PubSub();


const oauth2Client = new google.auth.OAuth2(
  config.google.client,
  config.google.secret
  );
  
var subscription

/**
 * This function is called right when the user logs in in order to get the google classroom permissions.
 */
function authorizeClient(req, res) {
  token = req.query.access_token

  oauth2Client.credentials = {access_token: token}

  google.options({
    auth: oauth2Client
  });

  res.status(200).send()
}

/**
 * This function gets information about a specific google classroom.
 */
async function getClassroom(req, res) {
  console.log('Getting classroom')
  token = req.query.access_token
  const class_id = req.query.class_id;

  classroom.courses.get(
    {
      id: class_id
    }, (err, result) => 
    {
      res.json(result.data)
    }
  )
}

/**
 * This function gets all of the google classroom courses that a user is registered in.
 */
async function getClassrooms(req, res) {
  console.log('Getting classrooms')
  console.log(req.query)
  subscription = pubSubClient.subscription("my-topic-heroku-push");

  // Check user type
  if(req.query.user_type == "1") {
    console.log('user is a teacher')
  classroom.courses.list(
    {
      teacherId: 'me'
    }, (err, result) => 
    {
      if(err) {
        console.log('Problem finding courses')
        console.log(err)
        res.status(404).send('Error finding teacher course list.')
      }
      // Student user types can't use registrations. It's just the design of the Classroom API.
      result.data.courses.forEach(async (element) => {
        console.log('registration starting')
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
        console.log('registration created')

        mongo_classroom.findOne({classroom_id: element.id}, async (err, doc) => {
          if(err) {

          }
          else {
            if(!doc) {
              let newEntry = new mongo_classroom({
                classroom_id: element.id,
                teacher_id: element.ownerId,
                quests: [],
                rewards: []
              })

              await newEntry.save((err, result) => {
              if (err) {console.log("oops")}
              else 
              {
                // result.status(201).send()
                console.log("Classroom entry saved!")
              }

              classroom.courses.courseWork.list(
                {
                  courseId: element.id
                },
                (err, assignments) => {
                  assignments.data.courseWork.forEach(element => {
                    newEntry.quests.push({
                      classroom_id: element.courseId,
                      coursework_id: element.id,
                      due_date: element.dueDate ? new Date(element.dueDate.year, element.dueDate.month - 1, element.dueDate.day) : null,
                      creation_date: new Date(element.creationTime),
                      last_modified: new Date(element.updateTime),
                      name: element.title,
                      reward_amount: 5,
                      type: 1
                    })
                  })
                  newEntry.save()
                }
                )
            })
              
            }
          }
        })
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
          res.status(404).send('Error finding student course list.')
        }
        res.json(result.data.courses)}
    )
      }  
}

/**
 * Function for creating the subscription.
 */
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

/**
 * The function that's called when the push endpoint is used by Google
 */
async function pushMethod(req, res) {
  // console.log(Buffer.from(req.body.message.data, 'base64'));
  var info = JSON.parse(Buffer.from(req.body.message.data, 'base64').toString())
  console.log(info.eventType)
  console.log(info.resourceId)
  // The code below needs to be fine-tuned for every type of change that can occur since we get so many notifications.
  // if(info.eventType == 'MODIFIED') {
  //   quest.findOneAndReplace({coursework_id: info.resourceId.id}, {upsert: true}, (err, docs) => {
  //     if (err) {

  //     }
  //     else {
  //       console.log(docs)
  //       if(true) {
  //         classroom.courses.courseWork.get(
  //           {
  //             courseId: info.resourceId.courseId,
  //             id: info.resourceId.id,
  //           }, (err, result) => {
  //             if (err) {
  //               console.log(err)
  //             }
  //             else {
  //               console.log(result.data)
  //               var element = result.data
  //               let newEntry = new quest({
  //                 classroom_id: element.courseId,
  //                 coursework_id: element.id,
  //                 due_date: element.due_date ? new Date(element.due_date.year, element.due_date.month - 1, element.due_date.day) : null,
  //                 creation_date: new Date(element.creationTime),
  //                 last_modified: new Date(element.updateTime),
  //                 name: element.title,
  //                 reward_amount: 5,
  //                 type: 1
  //               })
  //               console.log('yeeeeeeeeeeeeeeeeeeeeeeehaw')
  //               console.log(newEntry)
  //               newEntry.save((err, result) => {
  //                 if (err) {console.log("oops")
  //                   console.log(err)}
  //                 else 
  //                 { 
  //                   // result.status(201).send()
  //                   console.log("Assignment entry saved!")
  //                 }
  //               })
  //             }
  //           })
          
  //       }
  //     }
    
  //   })
  // }
  //   quest.deleteMany({name: {$exists: false}}, (err, result) => {
  //   if (err) {
  //     console.log('couldnt remove')
  //   }
  //   else {
  //     console.log(`empty entries removed.`)
  //   }
  // })
  res.status(200).send()
}

/**
 * 
 * 
 * 
 * TESTING FUNCTIONS
 * 
 * 
 * 
 **/

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



router.get('/classroom', getClassroom)
router.get('/createpush', pushTopic)
router.post('/push', pushMethod)
router.get('/client', authorizeClient)

router.get('/classrooms', getClassrooms)
router.get('/assignments', getAssignments)

module.exports = router;