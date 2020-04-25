var express = require('express');
var router = express.Router();
var views = require('../views');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render("", { title: 'Lecture5 Node&Express' }, views);
});

module.exports = router;