var shopItem = require('./shop-item-model');
var user = require('../user/user-model')
var router = require('express').Router()

function createItem (req, res) {
  let newEntry = new shopItem({
    name: req.body.name,
    cost: req.body.cost,
    thumbnail_url: req.body.thumbnail_url,
    full_url: req.body.full_url,
    type: req.body.type,
    times_purchased: 0,
  });

  newEntry.save((err, result) => {
    if (err) {
      console.log("Shop item failed to save", err);
      res.status(404).send();
    }
    else 
    {
      res.status(201).send();
      console.log("Shop item entry saved!");
    }
  });
}

function editItem (req, res) {
  shopItem.findOne({_id: req.body._id}, async (err, item) => {
    if(err || !item) {
      console.log("No item found with editItem.");
      res.status(404).send();
    }
    else {
      item.name = req.body.name;
      item.cost = req.body.cost;
      item.thumbnail_url = req.body.thumbnail_url;
      item.full_url = req.body.full_url;
      item.type = req.body.type;
      item.times_purchased = req.body.times_purchased;
      
      item.save();
      res.status(201).send();
    }
  });
}

function buyItem(req, res) {
  user.findOne({google_id: req.body.google_id}, async (err, user) =>
  {
    if(err || !user) {
      console.log("No user found with buyItem.");
      res.status(404).send();
    }
    else {
      let itemTypeList = user.inventory[req.body.item_type + '_ids'];
      if (itemTypeList.includes(req.body.item_id)) {
        res.status(409).send("A user with associated with this Google Account already has this item.")
      } else {
        if (req.body.classroom_id) {
          var classroom = user.classes.find(x => x.classroom_id == req.body.classroom_id);
          var item = await shopItem.findOne({_id: req.body.item_id}).exec();
          if (classroom.balance <= item.cost) {
            res.status(400).send("The specified user does not have enough balance to purchase this item.")
          } else {
            classroom.balance -= item.cost;
            item.times_purchased += 1;
          }
        }
        itemTypeList.push(req.body.item_id)
        await user.save();
        await item.save();
        res.json(user.inventory);
      }

    }
  });
}

function getItems(req, res) {
  shopItem.find({}, (err, shopItems) => {
    res.json(shopItems);
  });
}

function getItemsByType(req, res) {
  shopItem.find({type: req.params.type}, (err, shopItems) => {
    res.json(shopItems);
  });
}

router.post('/create-item', createItem);
router.post('/edit-item', editItem);
router.post('/buy-item', buyItem);
router.get('/get-items', getItems);
router.get('/get-items/:type', getItemsByType);

module.exports = router
