var user = require('./user-model')
var router = require('express').Router()
var classroom = require('../classroom/classroom-model')
var shopItem = require('../shop/shop-item-model');
var config = require('../../config')


const sharp = require('sharp');
const axios = require('axios')
const imgur = require('imgur');
imgur.setClientId(config.imgur.client);
imgur.setAPIUrl('https://api.imgur.com/3/');

console.log('this is the client', config.imgur.client);
// imgur.setClientId(config.imgur.client);
// imgur.setAPIUrl('https://api.imgur.com/3/');

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
          avatar_url: 'https://i.imgur.com/HeYNMAq.png',
          equipped: {
            animal_id: '60885cbaf24f980404b3196c',
            head_id: '60885c81f24f980404b31966',
            shirt_id: '60885c83f24f980404b31967',
            pant_id: '60885c85f24f980404b31968',
            accessory_id: '60885c87f24f980404b31969',
          },
          inventory: {
            animal_ids: ["60885cbaf24f980404b3196c"], // default animal for user
            head_ids: ["60885c81f24f980404b31966"], // blank image
            shirt_ids: ["60885c83f24f980404b31967"], // blank image
            pant_ids: ["60885c85f24f980404b31968"], // blank image
            accessory_ids: ["60885c87f24f980404b31969"], // blank image
          },
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
 * This function is called when a user saves their avatar.
 */
function updateEquippedItems(req, res) {
  user.findOne({ google_id: req.query.google_id }, async (err, user) => {
    if (err || !user) {
      console.log("No user found with updateEquippedItems.")
      res.status(404).send();
    }
    else {
      user.equipped.animal_id = req.body.animal_id;
      user.equipped.head_id = req.body.head_id;
      user.equipped.shirt_id = req.body.shirt_id;
      user.equipped.pant_id = req.body.pant_id;
      user.equipped.accessory_id = req.body.accessory_id;

      const item_ids = [
        req.body.animal_id,
        req.body.head_id,
        req.body.shirt_id,
        req.body.pant_id,
        req.body.accessory_id,
      ]

      // get list of items
      Promise.all((await shopItem.find({}).exec())
        // get items currently equipped
        .filter(item => item_ids.includes(String(item._id)))
        // sort by type
        .sort((a, b) => {
          var textA = a.type.toUpperCase();
          var textB = b.type.toUpperCase();
          return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        })
        // get image buffer data from item.full_url
        .map(async (x) => {
          const response = await axios.get(x.full_url,  { responseType: 'arraybuffer' })
          return Buffer.from(response.data, 'utf-8');
        })).then(async buffer_list => {
          // Combine images in order: animal, pant, shirt, head, accessory
          sharp('utils/background.png').composite([
            {input: buffer_list[1]},
            {input: buffer_list[3]},
            {input: buffer_list[4]},
            {input: buffer_list[2]},
            {input: buffer_list[0]}
          ])
          .toBuffer()
          .then(buffer => {
            // crop image
            sharp(buffer)
              .extract({ left: 64, top: 98, width: 164, height: 164 })
              .toBuffer()
              .then(async processed => {
                // upload to imgur
                imgur.uploadBase64(processed.toString('base64'))
                .then(x => {
                  // Save to user
                  user.avatar_url = x.link;
                  user.save();
                  res.json({avatar_url: x.link});
                })
              })
          });
        }
      );
    }
  });

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

function updateBalance(req, res) {
  // console.log(req.body)

  user.find().where('google_id').in(req.body.ids).exec((err, records) => {
    records.forEach(user_doc => {
      var index = user_doc.classes.findIndex(x => x.classroom_id == req.body.class_id)
      // if(req.body.type)
      user_doc.classes[index].balance += req.body.number * req.body.type
      if (user_doc.classes[index].balance < 0) {
        user_doc.classes[index].balance = 0
      }
      user_doc.save()
    });
  });

  res.status(201).send()
}

router.post('/user', createUser)
router.get('/user', getUser)

router.get('/complete-quest', completeQuest)

router.get('/completed-quests', getUserQuests)
router.get('/test/importquests', importQuestStatus)

router.get('/update-assignments', updateStudentAssignments)

router.post('/update-equipped-items', updateEquippedItems)

router.post('/update-balance', updateBalance)

module.exports = router