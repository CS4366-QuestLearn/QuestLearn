/**
 * DEPRECATED: Keeping this here for documentation purposes
 */
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;
  // currently sending 0 as class ID until classroom page is set up
  // Example body
    // classroom: 0
    // dueDate: Fri Mar 26 2021 00:00:00 GMT-0500 (Central Daylight Time) {}
    // name: "asd"
    // rewardAmount: 1
    // type: "2" <- single/group
var QuestSchema = new Schema({
  classroom_id: String,
  coursework_id: String,
  due_date: Date,
  creation_date: Date,
  last_modified: Date,
  name: String,
  reward_amount: Number,
  type: Number
});

// Compile model from schema
let QuestModel = mongoose.model('quest', QuestSchema );

  
 module.exports = QuestModel