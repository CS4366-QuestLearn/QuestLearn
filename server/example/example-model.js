// Maybe this is just some "joi" schema or uses an ORM like bookshelf etc


//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var ExampleSchema = new Schema({
  a_string: String,
  an_int: Number
});

// Compile model from schema
let SomeModel = mongoose.model('example', ExampleSchema );

  
 module.exports = SomeModel