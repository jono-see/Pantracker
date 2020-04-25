var express = require('express');
var router = express.Router();
var index = require('../views/index.html');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render(index, { title: 'Lecture5 Node&Express' });
});

module.exports = router;