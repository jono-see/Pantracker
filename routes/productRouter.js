var express = require('express');
var router = express.Router();

var scrapeOfficeworks = require('../controller/authenticate/scrapeOfficeworks.js');
var scrapeWoolworths = require('../controller/authenticate/scrapeWoolworths.js');
var scrapeBigW = require('../controller/authenticate/scrapeBigW.js');
var products = require("../models/products.js");

router.post('/search', function (req, res, next) {

    let productName = req.body.productName;
    let postcode = req.body.postcode;
    let depth = req.body.depth;

    scrapeOfficeworks(productName, postcode, depth).then((values) => {
        values.forEach(function(val) {
            products.push(val)
        }); 
    });

    scrapeWoolworths(productName, postcode, depth).then((values) => {
        values.forEach(function(val) {
            products.push(val)
        }); 
    });

    scrapeBigW(productName, postcode, depth).then((values) => {
        values.forEach(function(val) {
            products.push(val)
        }); 
    });
  
  res.render('index', {error: true});

});

router.get('/', function (req, res, next) {

  res.send(products);

});

router.get('/clear', function (req, res, next) {

  products = [];

  res.send(products);

});

module.exports = router;

