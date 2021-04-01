var user = require('../api/login/user-model');
var router = require("express").Router();

function getUser(req, res) {
  user.findOne({ google_id: req.query.google_id }, (err, result) => {
    if (err || !result) {
      res.status(404).send();
    }
    else {
      res.json(result);
    }
  })
}

router.get('/user', getUser)

module.exports = router;