var user = require('./user-model')
var router = require('express').Router()

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

router.post('/user', createUser)
router.get('/user', getUser)

module.exports = router