/**
 * google.js: endpoints for pulling from google classroom and for pubsub integration
 */
var router = require("express").Router();
const { google } = require("googleapis");
var axios = require('axios')
const classroom = google.classroom("v1")
var config = require('../config')
var quest = require('../api/quest/quest-model')
var user = require('../api/user/user-model')

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
  // console.log(req.query)
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
                rewards: [],
                requests: []
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
                  // user push here
                  })
                  newEntry.save()
                  updateUserAssignments(req, res, newEntry)
                }
                )
            })
              
            }
            else if(doc) {
              updateUserAssignments(req, res, doc)
              console.log('am finished doing stuff')
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
        result.data.courses.forEach(element => {
          mongo_classroom.findOne({classroom_id: element.id}, (err, class_doc) => {
            if(class_doc) {
              updateUserAssignments(req, res, class_doc)
            }
          })
        });
        res.json(result.data.courses)}
    )
      }  
}

function updateUserAssignments(req, res, class_doc) {
  user.findOne({ google_id: req.query.google_id }, async (err, user_doc) => {
    if (err || !user_doc) {
      console.log("No user found with getUser.")
      res.json(JSON.stringify({ exists: false }))
    }
    else {
      if (user_doc.classes.filter(e => e.classroom_id === class_doc.classroom_id).length > 0) {
        //               // if it already exists
        console.log('classroom already added')
      }
      else {
        if(req.query.user_type == "1") {
          user_doc.classes.push({
            classroom_id: class_doc.classroom_id,
            balance: 9999999,
            quests: []
          })
        }
        else {
          user_doc.classes.push({
            classroom_id: class_doc.classroom_id,
            balance: 0,
            quests: []
          })
        }

      }
      await user_doc.save()
      mongo_classroom.findOne({ classroom_id: class_doc.classroom_id }, async (err, classroom_doc) => {
      var index = user_doc.classes.findIndex(x => x.classroom_id == classroom_doc.classroom_id)
      console.log(index)
      classroom_doc.quests.forEach(element => {
        if (user_doc.classes[index].quests.filter(e => e._id === element.id).length > 0) {
          // if it already exists
          console.log('quest already added')
        }
        else {
          console.log('adding quest')
          user_doc.classes[index].quests.push({
            _id: element.id,
            completed: false
          })
        }
      });
      user_doc.save()
    })
    }
  })
}

async function getStudentsBalance(req, res) {
  const class_id = req.query.class_id;
  console.log(class_id)
  classroom.courses.students.list(
    {
      courseId: class_id
    }, async (err, result) => 
    {
      if(err) {
        console.log(err)
      }
      else {
        // console.log(result.data.students)
        // await result.data.students.forEach(async element => {
        //   await user.findOne({google_id: element.profile.id}).exec(function(err, doc)
        //   {
        //     if (err || !doc) {
        //       console.log('problem finding user')
        //     }
        //     else{
        //       console.log('mongo user found')
        //       var index = doc.classes.findIndex(x => x.classroom_id == class_id)
        //       element.balance = doc.classes[index].balance
        //       console.log('set da balance!')
        //     }
        //   })
        // });
        // console.log(results.data.students)
        const google_ids = result.data.students.map(x => x.profile.id);
        const db_students = (await user.find({}).exec())
          .filter(student => google_ids.includes(student.google_id));

        result.data.students.forEach(student => {
          const db_student = db_students.find(x => x.google_id == student.profile.id);
          student.balance = db_student.classes.find(x => x.classroom_id == class_id).balance;
          
        })
        // console.log(result.data.students)
        // // console.log(students);
        // console.log('im sending!!!!')
        res.json(result.data.students)
        // console.log('i sent it!!!!')
      }
    }
  )
}

// PUBSUB FUNCTIONS -------------------------------------------------------------------------------------------------------------
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

  // A MODIFIED event.
  if(info.eventType == 'MODIFIED'){
    if(info.collection == 'courses.courseWork') {
      console.log('Coursework was modified.')

      mongo_classroom.findOne({classroom_id: info.resourceId.courseId}, async (err, class_doc) => {
        if(err) {
          console.log('err')
        }
        else {
          classroom.courses.courseWork.get({
            courseId: info.resourceId.courseId,
            id: info.resourceId.id
          }, (err, coursework) => {
            if(err) {
              console.log(err)
            }
            else{
              var coursework_index = class_doc.quests.findIndex(x => x.coursework_id == info.resourceId.id)
              if(class_doc.quests[coursework_index]) {
                class_doc.quests[coursework_index].name = coursework.data.title
              }
              else {
                class_doc.quests.push({
                  classroom_id: coursework.data.courseId,
                  coursework_id: coursework.data.id,
                  due_date: coursework.data.dueDate ? new Date(coursework.data.dueDate.year, coursework.data.dueDate.month - 1, coursework.data.dueDate.day) : null,
                  creation_date: Date.now(),
                  last_modified: Date.now(),
                  name: coursework.data.title,
                  reward_amount: 5,
                  type: 1
                })
              }
              class_doc.save();
            }
          })

        }
      })
    }
    else if(info.collection == 'courses.courseWork.studentSubmissions') {
      console.log('did something with a submission')
      classroom.courses.courseWork.studentSubmissions.get({
        courseId: info.resourceId.courseId,
        courseWorkId: info.resourceId.courseWorkId,
        id: info.resourceId.id
      }, (err, assignment) => {
        if(err) {
          console.log(err)
        }
        else{
          // console.log(assignment)
          if(assignment.data.state == 'RETURNED') {
            user.findOne({ google_id: assignment.data.userId }, async (err, user_doc) => {
              const a_class = await mongo_classroom.findOne({classroom_id: info.resourceId.courseId}).exec()
              const an_assignment = a_class.quests.find(x => x.coursework_id == info.resourceId.courseWorkId)
              // console.log(a_class)
              // console.log(an_assignment)

              const user_course = user_doc.classes.find(x => x.classroom_id == info.resourceId.courseId)
              const current_user_quest = user_course.quests.find(x => x._id == an_assignment._id)
              
              console.log(user_course)
              console.log(current_user_quest)
              current_user_quest.completed = true
              user_course.balance += an_assignment.reward_amount

              await user_doc.save()
            })
          }
        }
      })

    }
  }
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

router.get('/students-balance', getStudentsBalance)
router.get('/students', getStudentsBalance)

module.exports = router;