var user = require('./login-model')
var usertype = require ('./usertype-model')
var router = require('express').Router()



function createUser (req, res) {
  console.log(req.body.user)
  console.log(req.body.user_type)
  user.findOne({google_id: req.body.user}, (err, result) =>
  {
    if (err) {console.log(error)}
    else{ 
      // console.log(`this is the result ${result}`)
      // check = result
      if(!result)
      {
        console.log('making new')
        // user.findOne
        let newEntry = new user({
          google_id: req.body.user,
        })
        newEntry.save((err, result) => {
          if (err) {console.log("oops")}
          else 
          {
            res.status(201).send()
            // just nice to have
            console.log("entry saved!")
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
            // just nice to have
            console.log("entry saved!")
          }
        })
      }
      else {
        console.log('already exists')
        res.status(409).send("Already exists")
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
      console.log("sdkjsdfh")
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
      if (err) {console.log("oops")}
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