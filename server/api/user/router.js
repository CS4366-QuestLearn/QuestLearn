var user = require('./user-model')
var router = require('express').Router()
var classroom = require('../classroom/classroom-model')

/**
 * Creates a new user and saves it to the users collection
 */
function createUser(req, res) {
  // Look for a user matching the google_id
  user.findOne({ google_id: req.body.user }, (err, result) => {
    if (err) { console.log(error) }
    else {
      // If it doesn't exist, make it exist
      if (!result) {
        console.log('No user found associated with this account: saving to database')
        let newEntry = new user({
          google_id: req.body.user,
          user_type: parseInt(req.body.user_type),
          balance: 0,
          avatar_url: ''
        })
        newEntry.save((err, result) => {
          if (err) { console.log("Problem saving using") }
          else {
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

function getUser(req, res) {
  user.findOne({ google_id: req.query.google_id }, (err, result) => {
    if (err || !result) {
      console.log("No user found with getUser.")
      res.json(JSON.stringify({ exists: false }))
    }
    else {
      res.json(JSON.stringify({ exists: true, user_type: result.user_type }))
    }
  })
}

/**
 * Mark a quest as finished.
 */
function completeQuest(req, res) {
  // Ensure the user exists
  user.findOne({ google_id: req.query.google_id }, async (err, doc) => {
    if (err || !doc) {
      console.log("No user found with getUser.")
      res.json(JSON.stringify({ exists: false }))
    }
    else {
      // Find the index of the class within the classes document. This is needed to dig into the nested document.
      var index = doc.classes.findIndex(x => x.classroom_id == req.query.classroom_id)
      // Mark the quest which matches the _id as true
      doc.classes[index].quests.id(req.query._id).completed = true
      // Increment the class balance
      doc.classes[index].balance += Number(req.query.value)

      await doc.save()
      res.json(doc.classes)
    }

  })


}

/**
 * This function is called every time a student enters a classroom page.
 * It checks to see if there are any new assignments, and if so, adds them to the quests in the user document.
 */
function updateStudentAssignments(req, res) {
  console.log('importing! ')
  // console.log(req.query)
  // call get GoogleID to get the reference
  // google_user = user.findOne( {google_id: req.google_id})

  // user_type = usertype.find( {user_id: google_user._id})

  user.findOne({ google_id: req.query.google_id }, (err, user_doc) => {
    if (err || !user_doc) {
      console.log("No user found with getUser.")
      res.json(JSON.stringify({ exists: false }))
    }
    else {
      classroom.findOne({ classroom_id: req.query.classroom_id }, async (err, classdoc) => {
        if (user_doc.classes.filter(e => e.classroom_id === req.query.classroom_id).length > 0) {
          //               // if it already exists
          console.log('classroom already added')
        }
        else {
          user_doc.classes.push({
            classroom_id: req.query.classroom_id,
            balance: 0,
            quests: []
          })
        }
        var index = user_doc.classes.findIndex(x => x.classroom_id == req.query.classroom_id)
        classdoc.quests.forEach(element => {
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
        await user_doc.save()
        // console.log(user_doc.completed_quests)
        res.json(user_doc.classes[index])
      })
    }

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

// THIS IS ONLY FOR TESTING TO LOAD DATA IN. DO NOT CALL THIS
function importQuestStatus(req, res) {
  console.log('importing')
  // console.log(req.query)
  // call get GoogleID to get the reference
  // google_user = user.findOne( {google_id: req.google_id})

  // user_type = usertype.find( {user_id: google_user._id})

  user.findOne({ google_id: req.query.google_id }, (err, user_doc) => {
    if (err || !user_doc) {
      console.log("No user found with getUser.")
      res.json(JSON.stringify({ exists: false }))
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
          else {
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

function getUserQuests(req, res) {
  console.log('getting user quests')

  user.findOne({ google_id: req.query.google_id }, (err, doc) => {
    if (err || !doc) {
      console.log("No user found with getUser.")
      res.json(JSON.stringify({ exists: false }))
    }
    else {
      res.json(doc.completed_quests)
    }

  })
  // res.status(200).send()
}

router.post('/user', createUser)
router.get('/user', getUser)

router.get('/complete-quest', completeQuest)

router.get('/completed-quests', getUserQuests)
router.get('/test/importquests', importQuestStatus)

router.get('/update-assignments', updateStudentAssignments)

module.exports = router