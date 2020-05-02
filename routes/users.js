var express = require('express');
var router = express.Router();
var login = require('../controller/authenticate/login');
var scrapeOfficeworks = require('../controller/authenticate/search.js');

/* GET users listing. */
router.get('/', function (req, res, next) {
    var users = [{
        id: 1,
        firstName: 'John',
        lastName: 'Doe'
    },
        {
            id: 2,
            firstName: 'Stefany',
            lastName: 'Lynn'
        }];
    res.send(users);
});

/* GET users by id. */
router.get('/:id', function (req, res, next) {
    var users = [{
        id: 1,
        firstName: 'John',
        lastName: 'Doe'
    },
        {
            id: 2,
            firstName: 'Stefany',
            lastName: 'Lynn'
        }];
    // console.log(req.params.id);
    // console.log(users.find(x => x.id == req.params.id));
    res.send(users.find(x => x.id == req.params.id));
});

/* login users. */
router.post('/login', function (req, res, next) {

    const username = req.body.username;
    var loginResult = login(username, req.body.password);

    if (loginResult) {
        res.render('users', {username: username});
    } else {
        res.render('index', {error: true});
    }
});

router.post('/search', function (req, res, next) {

    let prod = req.body.product;
    let pcode = req.body.postcode;

    var products = scrapeOfficeworks(prod, pcode).then((val) => res.send(val));

});

module.exports = router;
