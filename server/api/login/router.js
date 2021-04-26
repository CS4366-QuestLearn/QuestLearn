var user = require('./user-model')
var router = require('express').Router()
var classroom = require('../classroom/classroom-model')


// TODO:
// On page entry or on login, add all of the quests to the user object
// probably good to just do it on page entry so we can get the changes when the student needs to see them
function createUser (req, res) {
  user.findOne({google_id: req.body.user}, (err, result) =>
  {
    if (err) {console.log(error)}
    else{ 
      if(!result)
      {
        console.log('No user found associated with this account: saving to database')
        let newEntry = new user({
          google_id: req.body.user,
          user_type: parseInt(req.body.user_type),
          balance: 0,
          avatar_url: ''
        })
        newEntry.save((err, result) => {
          if (err) {console.log("oops")}
          else 
          {
            res.status(201).send()
            console.log("User entry saved!")
          }
        })
      }
      else {
        console.log('Tried to create but account already exists')
        res.status(409).send("An account with associated with this Google Account already exists.")
      }
    }
  })
}

function getUser (req, res) {
  // call get GoogleID to get the reference
  // google_user = user.findOne( {google_id: req.google_id})

  // user_type = usertype.find( {user_id: google_user._id})

  user.findOne({google_id: req.query.google_id}, (err, result) =>
  {
    if(err || !result) {
      console.log("No user found with getUser.")
      res.json(JSON.stringify({exists: false}))
    }
    else { 
          res.json(JSON.stringify({exists: true, user_type: result.user_type}))   
    }

  })
}

function getUserQuests (req, res) {
  console.log('getting user quests')

  user.findOne({google_id: req.query.google_id}, (err, doc) =>
  {
    if(err || !doc) {
      console.log("No user found with getUser.")
      res.json(JSON.stringify({exists: false}))
    }
    else { 
          res.json(doc.completed_quests)   
    }

  })
  // res.status(200).send()
}

function completeQuest(req, res) {
  user.findOne({google_id: req.query.google_id}, async (err, doc) =>
  {
    if(err || !doc) {
      console.log("No user found with getUser.")
      res.json(JSON.stringify({exists: false}))
    }
    else {
      var index = doc.classes.findIndex(x => x.classroom_id == req.query.classroom_id)
      doc.classes[index].quests.id(req.query._id).completed = true
      doc.classes[index].balance += Number(req.query.value)

      await doc.save()
      res.json(doc.classes)
    }
    
  })


}

// THIS IS ONLY FOR TESTING TO LOAD DATA IN. DO NOT CALL THIS
// Eventually this will be called only once when the user registers
function importQuestStatus(req, res) {
  console.log('importing')
  // console.log(req.query)
    // call get GoogleID to get the reference
    // google_user = user.findOne( {google_id: req.google_id})
  
    // user_type = usertype.find( {user_id: google_user._id})
  
    user.findOne({google_id: req.query.google_id}, (err, user_doc) =>
    {
      if(err || !user_doc) {
        console.log("No user found with getUser.")
        res.json(JSON.stringify({exists: false}))
      }
      else {
        classroom.findOne({ classroom_id: '311516886961' }, async (err, classdoc) => {
          if (user_doc.classes.filter(e => e.classroom_id === '311516886961').length > 0) {
            //               // if it already exists
            console.log('classroom already added')
          }
          else {
            user_doc.classes.push({
              classroom_id: '311516886961',
              balance: 0,
              quests: []
            })
          }
          var index = user_doc.classes.findIndex(x => x.classroom_id == '311516886961')
          classdoc.quests.forEach(element => {
            if (user_doc.classes[index].quests.filter(e => e._id === element.id).length > 0) {
              // if it already exists
              console.log('quest already added')
            }
            else{
            console.log('adding quest')
            user_doc.classes[index].quests.push({
              _id: element.id,
              completed: false
            })
          }
        });
          await user_doc.save()
        // console.log(user_doc.completed_quests)
        res.json(user_doc.classes[index])   
        }) 
      }
  
    })
  }

router.post('/user', createUser)
router.get('/user', getUser)

router.get('/complete-quest', completeQuest)

router.get('/completed-quests', getUserQuests)
router.get('/test/importquests', importQuestStatus)

module.exports = router