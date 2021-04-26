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

var UserSchema = new Schema({
  google_id: String,
  user_type: Number,
  balance: Number,
  avatar_url: String,
  classes: [Classes]
});

// Compile model from schema
let UserModel = mongoose.model('user-test-2', UserSchema );

  
 module.exports = UserModel