// Maybe this is just some "joi" schema or uses an ORM like bookshelf etc


//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var Quests = new Schema({
  _id: String,
  completed: Boolean,
})

var Classes = new Schema({
  classroom_id: String,
  balance: Number,
  quests: [Quests]
})

var Equipped = new Schema({
  animal_id: String,
  head_id: String,
  shirt_id: String,
  pant_id: String,
  accessory_id: String,
})

var Inventory = new Schema({
  animal_ids: [String],
  head_ids: [String],
  shirt_ids: [String],
  pant_ids: [String],
  accessory_ids: [String],
})

var UserSchema = new Schema({
  google_id: String,
  user_type: Number,
  balance: Number,
  avatar_url: String,
  classes: [Classes],
  equipped: Equipped,
  inventory: Inventory,
});

// Compile model from schema
let UserModel = mongoose.model('user', UserSchema );

  
 module.exports = UserModel