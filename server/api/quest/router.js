/**
 * DEPRECATED: Keeping this here for documentation purposes
 */
var quest = require('./quest-model')
var router = require('express').Router();
var config = require('../../config')

const { google } = require("googleapis");
const classroom = google.classroom("v1")

const {PubSub} = require('@google-cloud/pubsub');

// for now, custom quests are allowed:
// maybe we id them but not worth rn
function createQuest (req, res) {
  console.log(req.body)
  let newEntry = new quest({
    classroom_id: req.body.classroom_id,
    coursework_id: req.query.class_id,
    due_date: req.body.due_date,
    creation_date: Date.now(),
    last_modified: Date.now(),
    name: req.body.name,
    reward_amount: req.body.reward_amount,
    type: parseInt(req.body.type)
  })

  newEntry.save((err, result) => {
    if(err) {
      console.log(err)
    }
    else {
      console.log('Custom quest saved')
      res.status(201).send(JSON.stringify(result))
    }

  })
}

function getQuest (req, res) {
  // test this using
  // http://127.0.0.1:3000/api/quests/quest/605eb64bf6baae4230fcbb0a where that big number is the
  // object Id from mongo
  quest.findOne({_id: req.params._id}, (err, result) => {
    if (err || !result) {
      console.log('couldnt find a quest')
      res.status(404).send()
    }
    else {
      res.json(result)
    }
  })
}

function editQuest (req, res) {
  // TODO: add option to edit google assignments
  // Check if it has a coursework ID 

  req.body.last_modified = Date.now();

  quest.findOneAndUpdate({_id: req.params._id}, req.body, {new: true}, (err, result) => {
    if (err || !result) {
      console.log('couldnt find a quest')
      res.status(404).send()
    }
    else {
      res.json(result)
    }
  });

  // res.status(200).send();
}

function deleteQuest (req, res) {
  quest.deleteOne({_id: req.params._id}, (err, result) => {
    if (err) {
      console.log('couldnt remove')
      res.status(404).send()
    }
    else {
      console.log(`entry ${req.params._id} deleted.`)
      res.status(200).send()
    }
  })
}

function importAllQuests(req, res) {
  console.log('GETTING ALL QUESTS FROM CLASSROOM')
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
      orderBy: "updateTime asc"
    }, (err, res) => {
      res.data.courseWork.forEach(element => {
        // check if it already exists in the quests collection
        quest.findOne({coursework_id: element.id}, (err, result) => {
          if (err) {

          }
          else {
            if(!result) {
              console.log(`assignment ${element.title} is not in the db yet`)
              let newEntry = new quest({
                classroom_id: req.query.class_id,
                coursework_id: element.id,
                due_date: element.due_date ? new Date(element.due_date.year, element.due_date.month - 1, element.due_date.day) : null,
                creation_date: new Date(element.creationTime),
                last_modified: new Date(element.updateTime),
                name: element.title,
                reward_amount: 5,
                type: 1
              })
              newEntry.save((err, result) => {
                if (err) {console.log("oops")}
                else 
                {
                  // result.status(201).send()
                  console.log("Assignment entry saved!")
                }
              })
            }
            else {
              console.log(`assignment ${element.title} already exists in the db`)
            }

          }
        })
      })
    }
  )

  console.log('yeeeeeeeeeehaw')

  res.status(200).send()
}

// todo: integrate with pubsub
function importQuest(resource) {
  classroom.courses.courseWork.get(
    {
      courseId: resource.courseId,
      id: resource.id,
    }, (err, res) => {
      console.log(res.data)
    })
  // quest.findOne({coursework_id: id}, (err, result) => {
  //   if (err) {

  //   }
  //   else {
  //     if(!result) {

  //       console.log(`assignment ${element.title} is not in the db yet`)
  //       let newEntry = new quest({
  //         classroom_id: req.query.class_id,
  //         coursework_id: element.id,
  //         due_date: element.due_date ? new Date(element.due_date.year, element.due_date.month - 1, element.due_date.day) : null,
  //         creation_date: new Date(element.creationTime),
  //         last_modified: new Date(element.updateTime),
  //         name: element.title,
  //         reward_amount: 5,
  //         type: 1
  //       })
  //       newEntry.save((err, result) => {
  //         if (err) {console.log("oops")}
  //         else 
  //         {
  //           // result.status(201).send()
  //           console.log("Assignment entry saved!")
  //         }
  //       })
  //     }
  //     else {
  //       console.log(`assignment ${element.title} already exists in the db`)
  //     }

  //   }
  // })
}

function foobar() {
  console.log('testing')
}

// this has an example of using mongoose's filters (.sort)
function getAllQuests(req, res) {
  console.log('getting all quests')
  quest.find({classroom_id: req.query.class_id}).sort({due_date: 1}).exec(function(err, docs) {
    console.log(req.query.class_id)
    res.json(docs)
  })
}

router.get('/', getAllQuests)

router.post('/quest', createQuest);
router.get('/quest/:_id', getQuest);
router.post('/quest/:_id', editQuest);
router.delete('/quest/:_id', deleteQuest);

router.get('/import', importAllQuests)

module.exports = router;
