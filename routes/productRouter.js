var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();

var scrapeOfficeworks = require('../controller/scrapeOfficeworks.js');
var scrapeWoolworths = require('../controller/scrapeWoolworths.js');
var scrapeBigW = require('../controller/scrapeBigW.js');
var products = require("../models/products.js");
var User = mongoose.model('User');

function requiresLogin(req, res, next) {
    if (req.session && req.session.userId) {
      return next();
    } else {
      var err = new Error('You must be logged in to view this page.');
      err.status = 401;
      return next(err);
    }
  }

router.post('/search', requiresLogin, function (req, res, next) {

    let productName = req.body.productName;
    let postcode = req.body.postcode;
    let depth = req.body.depth;

    scrapeOfficeworks(productName, postcode, depth).then((values) => {
        values.forEach(function(val) {
            // products.push(val)
            console.log(val);
                User.update(
                    { "username" : req.session.userId },
                    { "$push" : { "searchResults" : {
                        "storeName": val.storeName,
                        "storeLocation": val.storeLocation,
                        "storeNo": val.storeNo,
                        "productName": val.productName,
                        "productPrice": val.productPrice,
                        "productStatus": val.productStatus
                    }} }
                    ).then(result => {
                        console.log(result);
                      })
                      .catch(err => console.log(err));
        }); 
    });

    scrapeWoolworths(productName, postcode, depth).then((values) => {
        values.forEach(function(val) {
            // products.push(val)
            console.log(val);
                User.update(
                    { "username" : req.session.userId },
                    { "$push" : { "searchResults" : {
                        "storeName": val.storeName,
                        "storeLocation": val.storeLocation,
                        "storeNo": val.storeNo,
                        "productName": val.productName,
                        "productPrice": val.productPrice,
                        "productStatus": val.productStatus
                    }} }
                    ).then(result => {
                        console.log(result);
                      })
                      .catch(err => console.log(err));
        }); 
    });

    scrapeBigW(productName, postcode, depth).then((values) => {
        values.forEach(function(val) {
            // products.push(val)
            console.log(val);
                User.update(
                    { "username" : req.session.userId },
                    { "$push" : { "searchResults" : {
                        "storeName": val.storeName,
                        "storeLocation": val.storeLocation,
                        "storeNo": val.storeNo,
                        "productName": val.productName,
                        "productPrice": val.productPrice,
                        "productStatus": val.productStatus
                    }} }
                    ).then(result => {
                        console.log(result);
                      })
                      .catch(err => console.log(err));


        }); 
    });
  
  res.render('productSearch', {error: true});


});

router.get('/delete', function (req, res, next) {

    User.update(
        { "username" : req.session.userId },
        { "$set" : { "searchResults" : [] } }
    ).then(result => {
        return res.render("index");
      })

});

module.exports = router;

// commit