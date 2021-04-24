var user = require('./user-model')
var router = require('express').Router()
var classroom = require('../classroom/classroom-model')

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
  user.findOne({google_id: req.query.google_id}, (err, doc) =>
  {
    if(err || !doc) {
      console.log("No user found with getUser.")
      res.json(JSON.stringify({exists: false}))
    }
    else {
      doc.completed_quests.push({
        _id: req.body._id,
        completed: true
      })

      doc.save()

        
    }

  })

  res.status(201).send()

}

// THIS IS ONLY FOR TESTING TO LOAD DATA IN. DO NOT CALL THIS
function importQuestStatus(req, res) {
  console.log('importing')
  console.log(req.query)
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
        classroom.findOne({classroom_id: '311516886961'}, async (err, classdoc) => {
          classdoc.quests.forEach(element => {
            if (user_doc.completed_quests.filter(e => e._id === element.id).length > 0) {
              // if it already exists
              console.log('quest already added')
            }
            else{
              console.log('adding quest')
            user_doc.completed_quests.push({
              _id: element.id,
              classroom_id: element.classroom_id,
              completed: false
            })
          }
        });
        await user_doc.save()
        // console.log(user_doc.completed_quests)
        res.json(user_doc.completed_quests)   
        }) 
      }
  
    })
  }

router.post('/user', createUser)
router.get('/user', getUser)

router.post('/quest', completeQuest)

router.get('/completed-quests', getUserQuests)
router.get('/test/importquests', importQuestStatus)

module.exports = router