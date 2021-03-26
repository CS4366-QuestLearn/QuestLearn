
var router = require('express').Router();

function createQuest (req, res) {
  // currently sending 0 as class ID until classroom page is set up
  // Example body
    // classroom: 0
    // dueDate: Fri Mar 26 2021 00:00:00 GMT-0500 (Central Daylight Time) {}
    // name: "asd"
    // rewardAmount: 1
    // type: "2" <- single/group

  throw new Error('Method not implemented.'); 
}

function getQuest (req, res) {
  throw new Error('Method not implemented.'); 
}

function editQuest (req, res) {
  throw new Error('Method not implemented.'); 
}

function deleteQuest (req, res) {
  throw new Error('Method not implemented.'); 
}


router.post('/', createQuest);
router.get('/:id', getQuest);
router.post('/:id', editQuest);
router.delete('/:id', deleteQuest);

module.exports = router;
