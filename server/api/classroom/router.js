/**
 * Router for the classroom collection.
 * For our convenience, it contains references to the Google Classroom library. We use this to create a new classroom entry whenever a teacher
 * creates one in Google Classroom.
 */
var router = require("express").Router();
const { google } = require("googleapis");
var classroom = require('./classroom-model')
var user = require('../user/user-model')
var config = require('../../config')
const g_classroom = google.classroom("v1")

// Example for returning a json
function getFoo (req, res) {
    console.log('a')
    res.json({"a" : "aaaaa"} )
}

function getExampleDB (req, res) {
  classroom.find((err, result) =>
  {
    if(err) {console.log(error)}
    else { res.json(result)}
  })
}

/**
 * Creating a quest and adding it to the respective classroom document
 */
function createQuest(req, res) {
  // Find a classroom matching the classroom_id in the request
  classroom.findOne({classroom_id: req.body.classroom_id}, (err, doc) => {
    // Add the quest and it's deatils to the quests subdocument
    doc.quests.push({
      classroom_id: req.body.classroom_id,
      coursework_id: req.query.class_id,
      due_date: req.body.due_date,
      creation_date: Date.now(),
      last_modified: Date.now(),
      name: req.body.name,
      reward_amount: req.body.reward_amount,
      type: parseInt(req.body.type)
    })
    // Save the document
    doc.save()
  })
  res.status(201).send()
}

function readQuest(req, res) {
  // Hardcoded example for finding a certain quest
  classroom.findOne({'quests.coursework_id': '309832062048'}, (err, doc) => {
    //console.log(doc.quests)
    //console.log(typeof(doc.quests))
    console.log(doc.quests.find(x => x.coursework_id = '309832062048'))
    // console.log(typeof(doc.quests[0]))
    
  })
  
  res.status(200).send()
  
}

function readAllQuests(req, res) {
  console.log('getting quests')
  // Find a quest from the class_id in the requests
  classroom.findOne({classroom_id: req.query.class_id}).sort({due_date: 1}).exec(function(err, doc) {
    // Return the quests subdocument
    res.json(doc.quests)
  })
}


function updateQuest() {
  
}


function deleteQuest() {
  
}

function submitRequest(req, res) {
  // Ensure the user exists
  classroom.findOne({ classroom_id: req.query.classroom_id }, async (err, classroom_doc) => {
    if (err || !classroom_doc) {
      console.log("No class found.")
      res.json(JSON.stringify({ exists: false }))
    }
    else {
      // Find the index of the class within the classes document. This is needed to dig into the nested document.
      const user_doc = await user.findOne({google_id: req.query.id}).exec();
      var index = user_doc.classes.findIndex(x => x.classroom_id == req.query.classroom_id)
      // Mark the quest which matches the _id as true
      // Status:
      // 1: Approved
      // 2: Declined
      var classroom_index = classroom_doc.requests.findIndex(x => x._id == req.query._id)
      classroom_doc.requests[classroom_index].status = req.query.status
      if(req.query.status == '2')
        // Reverse the charge on the student's balance if the transaction has been declined
        user_doc.classes[index].balance += Number(req.query.amount)
      

      await user_doc.save()
      await classroom_doc.save()
      res.json(classroom_doc.requests)
    }

  })


}

function createReward(req, res) {
  // Find a classroom matching the classroom_id in the request
  classroom.findOne({classroom_id: req.body.classroom_id}, async (err, doc) => {
    // Add the reward and it's deatils to the reward subdocument
    doc.rewards.push({
      reward_name: req.body.name,
      reward_amount: req.body.price
    })
    // Save the document
    await doc.save()
    console.log(doc.rewards[doc.rewards.length - 1])
    res.json(doc.rewards[doc.rewards.length - 1])
  })
}


function getClassroomRewards(req, res) {
  classroom.find({}, (err, classes) => {
    console.log(classes);
    res.json(classes.map(x => {
      return {
        classroom_id: x.classroom_id,
        rewards: x.rewards,
      }
    }))
  })
}

function readAllRequests(req, res) {
  console.log('getting requests')
  // Find a classroom from the class_id in the requests
  classroom.findOne({classroom_id: req.query.class_id}).sort({request_date: 1}).exec(async function(err, doc) {
    // Return the quests subdocument
    const users = await user.find({}).exec();
    const data = doc.requests.map(request => {
      const requester = users.find(x => x.google_id == request.requester_id);

      return {
        ...request._doc,
        requester_name: requester.name,
        avatar_url: requester.avatar_url
      }

    })
    // console.log(data)
    res.json(data)
  })
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

// Hardcoded getClassroom
function getTestClassroom(req, res) {
  classroom.findOne({classroom_id: '311516886961'}).sort({due_date: 1}).exec(function(err, doc) {
    res.json(doc.quests)
  })
}

// Temporary function for creating a new classroom.
// Ideally we use pubsub to automatically create new database entries.
// For now, we have our 3 testing classrooms.
// This should ONLY be accessed through the testing page. DO NOT CALL THIS FROM ANYWHERE ELSE
async function createClassrooms(req, res) {
  // Because we don't use authorizeClient(), I thought it'd be better safe than sorry to just reauthorize
  token = req.query.access_token
  const class_id = req.query.class_id;

  const oauth2Client = new google.auth.OAuth2(
    config.google.client,
    config.google.secret
  );

  oauth2Client.credentials = {access_token: token}

  google.options({
    auth: oauth2Client
  });

  g_classroom.courses.list(
    {
      teacherId: 'me'
    }, (err, result) => 
    {
      if(err) {
        console.log('Problem finding courses')
        console.log(err)
        res.status(404).send('Error finding teacher course list.')
      }
      result.data.courses.forEach(async (element) => {
        // create new db entry here
        classroom.findOne({classroom_id: element.id}, (err, doc) => {
          if(err) {

          }
          else {
            if(!doc) {
              let newEntry = new classroom({
                classroom_id: element.id,
                teacher_id: element.ownerId,
                quests: [],
                rewards: []
              })
              newEntry.save((err, result) => {
              if (err) {console.log("oops")}
              else 
              {
                // result.status(201).send()
                console.log("Classroom entry saved!")
              }
            })
              
            }
          }
        })
      });
      res.json(result.data.courses)
    }
  )

  res.json({"b" : "bbbb"} )
}


// Example for how to save stuff in here
// This is for the testing page
async function importQuestsToClass(req, res) {
  // Because we don't use authorizeClient(), I thought it'd be better safe than sorry to just reauthorize
  token = req.query.access_token
  const class_id = req.query.class_id;

  const oauth2Client = new google.auth.OAuth2(
    config.google.client,
    config.google.secret
  );

  oauth2Client.credentials = {access_token: token}

  google.options({
    auth: oauth2Client
  });

  g_classroom.courses.list(
    {
      teacherId: 'me'
    }, (err, result) => 
    {
      if(err) {
        console.log('Problem finding courses')
        console.log(err)
        res.status(404).send('Error finding teacher course list.')
      }
      result.data.courses.forEach((element) => {
        classroom.findOne({classroom_id: element.id}, (err, doc) => {
          console.log(doc)
          g_classroom.courses.courseWork.list(
            {
            courseId: element.id
            },
            (err, courses) => {
              // console.log(courses.data.courseWork)
              courses.data.courseWork.forEach(element => {
                doc.quests.push({
                  classroom_id: element.courseId,
                  coursework_id: element.id,
                  due_date: element.due_date ? new Date(element.due_date.year, element.due_date.month - 1, element.due_date.day) : null,
                  creation_date: new Date(element.creationTime),
                  last_modified: new Date(element.updateTime),
                  name: element.title,
                  reward_amount: 5,
                  type: 1
                })
              })
              doc.save()
            }
            )
          // doc.quests.push({classroom_id: 'butts'})
          // doc.save()
        })
        // create new db entry here for each assignment

      });
      // res.json(result.data.courses)
    }
  )

  res.json({"b" : "bbbb"} )

}


/**
 * Creating a request and adding it to the respective classroom document
 */
function addTestRequest(req, res) {
  console.log('request adding')
  // Find a classroom matching the classroom_id in the request
  classroom.findOne({classroom_id: '311516886961'}, (err, doc) => {
    // Add the request and it's details to the request subdocument
    doc.requests.push({
      reward_name: 'A reward',
      reward_amount: 10,
      requester_id: '107965676074857006502',
      request_date: Date.now(),
      status: -1
    })
    // Save the document
    doc.save()
  })
  res.status(201).send()
}


router.get('/foobar', getFoo)
router.get('/create', createClassrooms)
router.get('/import', importQuestsToClass)
router.get('/quests', readAllQuests)
router.get('/quest', readQuest)
router.post('/quest', createQuest)

router.get('/requests', readAllRequests)

router.get('/submit-request', submitRequest)
router.post('/add-reward', createReward)
router.get('/get-rewards/', getClassroomRewards)


// testing functions
router.get('/test/classroom', getTestClassroom)
router.get('/test/request', addTestRequest)
module.exports = router;