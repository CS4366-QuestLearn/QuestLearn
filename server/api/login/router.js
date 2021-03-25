var user = require('./login-model')
var usertype = require ('./usertype-model')
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
        })
        newEntry.save((err, result) => {
          if (err) {console.log("oops")}
          else 
          {
            res.status(201).send()
            console.log("User entry saved!")
          }
        })
      
        let typeEntry = new usertype({
          user_id: newEntry._id,
          user_type: parseInt(req.body.user_type)
      
        })
        typeEntry.save((err, result) => {
          if (err) {console.log(err)}
          else 
          {
            res.status(201).send()
            console.log("User Type entry saved!")
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
      usertype.findOne({user_id: result._id}, (err, result) =>
      {
        if (err) {console.log(error)}
        else{ res.json(JSON.stringify({exists: true}))
        }
      }
      
      )}

  })
}

function createExample (req, res) {
  let newEntry = new example({
      a_string: "abcd",
      an_int: 2
    })
    newEntry.save((err, result) => {
      if (err) {console.log("Cannot be saved")}
      else 
      {
        res.status(201).send()
        // just nice to have
        console.log("entry saved!")
      }
    })
}

router.post('/user', createUser)
router.get('/user', getUser)

module.exports = router