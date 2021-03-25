// Maybe this is just some "joi" schema or uses an ORM like bookshelf etc


//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var LoginSchema = new Schema({
  user_id: String,
  user_type: Number
});

// Compile model from schema
let LoginModel = mongoose.model('usertype', LoginSchema );

  
 module.exports = LoginModel