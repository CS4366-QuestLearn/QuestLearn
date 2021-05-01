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
                quests: []
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
router.get('/foobar', getFoo)
router.get('/create', createClassrooms)
router.get('/import', importQuestsToClass)
router.get('/quests', readAllQuests)
router.get('/quest', readQuest)
router.post('/quest', createQuest)


// testing functions
router.get('/test/classroom', getTestClassroom)
module.exports = router;