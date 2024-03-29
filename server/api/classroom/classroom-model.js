//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var Quests = new Schema({
  classroom_id: String,
  coursework_id: String,
  due_date: Date,
  creation_date: Date,
  last_modified: Date,
  name: String,
  reward_amount: Number,
  type: Number
})

var Rewards = new Schema({
  reward_name: String,
  reward_amount: Number
})

var Requests = new Schema({
  reward_name: String,
  reward_amount: Number,
  requester_id: String,
  status: Number,
  request_date: Date
})

var Classroom = new Schema({
  teacher_id: String,
  classroom_id: String,
  quests: [Quests],
  rewards: [Rewards],
  requests: [Requests]
});

// Compile model from schema
let ClassroomModel = mongoose.model('classroom', Classroom );

  
 module.exports = ClassroomModel