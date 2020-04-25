var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    res.send("<H1>THIS SHOULD BE A PAGE</H1>");
});

module.exports = router;