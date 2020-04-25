var express = require('express');
var router = express.Router();
//var views = require('./views');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render("./routes/index", { title: 'Lecture5 Node&Express' });
});

module.exports = router;