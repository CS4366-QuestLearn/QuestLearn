var router = require("express").Router();

function getFoo (req, res) {
    console.log('a')
    res.status(200).send('a')
}

router.get('/foobar', getFoo)

module.exports = router;