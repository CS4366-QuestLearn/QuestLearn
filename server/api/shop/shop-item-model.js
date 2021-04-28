//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var ShopItem = new Schema({
  name: String,
  cost: Number,
  thumbnail_url: String,
  full_url: String,
  type: String,
});

// Compile model from schema
let UserModel = mongoose.model('shop-items', ShopItem);

module.exports = UserModel;
