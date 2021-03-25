// Maybe this is just some "joi" schema or uses an ORM like bookshelf etc


//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var LoginSchema = new Schema({
  google_id: String
});

// Compile model from schema
let LoginModel = mongoose.model('login', LoginSchema );

  
 module.exports = LoginModel