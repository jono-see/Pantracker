var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();

var scrapeOfficeworks = require('../controller/scrapeOfficeworks.js');
var scrapeWoolworths = require('../controller/scrapeWoolworths.js');
var scrapeBigW = require('../controller/scrapeBigW.js');
var User = mongoose.model('User');
var Stores = mongoose.model('allStores');

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

    if (productName.length == 0 && postcode.length == 0 && depth.length == 0) {
        console.log("no search terms...");
        res.render('productSearch', {error: true});
    } 

    scrapeOfficeworks(productName, postcode, depth).then((values) => {
        values.forEach(function(val) {
            let storeId = Stores.findOne( { name: val.storeName } )
            .then(e => 
                User.update(
                    { "username" : req.session.userId },
                    { "$push" : { "searchResults" : {
                        "storeName": val.storeName,
                        "storeLocation": val.storeLocation,
                        "storeNo": val.storeNo,
                        "productName": val.productName,
                        "productPrice": val.productPrice,
                        "productStatus": val.productStatus,
                        "productUrl": val.productUrl,
                        "storeId": e._id
                    }} })
                    // ).then(result => {
                    //     console.log("success Officeworks...");
                    //   })
                      .catch(err => console.log("error Officeworks...")))
            .catch(e => 
                // console.log("unable to find id");
                User.update(
                    { "username" : req.session.userId },
                    { "$push" : { "searchResults" : {
                        "storeName": val.storeName,
                        "storeLocation": val.storeLocation,
                        "storeNo": val.storeNo,
                        "productName": val.productName,
                        "productPrice": val.productPrice,
                        "productStatus": val.productStatus,
                        "productUrl": val.productUrl,
                        "storeId": "Unavailable"
                    }} })
                    // ).then(result => {
                    //     console.log("success Officeworks...");
                    //   })
                      .catch(err => console.log("error Officeworks..."))
                
                );

        }); 
    });

    scrapeWoolworths(productName, postcode, depth).then((values) => {
        values.forEach(function(val) {
            let storeId = Stores.findOne( { name: val.storeName } )
            .then(e => 
                User.update(
                    { "username" : req.session.userId },
                    { "$push" : { "searchResults" : {
                        "storeName": val.storeName,
                        "storeLocation": val.storeLocation,
                        "storeNo": val.storeNo,
                        "productName": val.productName,
                        "productPrice": val.productPrice,
                        "productStatus": val.productStatus,
                        "productUrl": val.productUrl,
                        "storeId": e._id
                    }} })
                    // ).then(result => {
                    //     console.log("success Woolworths...");
                    //   })
                      .catch(err => console.log("error Woolworths...")))
            .catch(e => 
                // console.log("unable to find id");
                User.update(
                    { "username" : req.session.userId },
                    { "$push" : { "searchResults" : {
                        "storeName": val.storeName,
                        "storeLocation": val.storeLocation,
                        "storeNo": val.storeNo,
                        "productName": val.productName,
                        "productPrice": val.productPrice,
                        "productStatus": val.productStatus,
                        "productUrl": val.productUrl,
                        "storeId": "Unavailable"
                    }} }
                    ).catch(err => console.log("error Woolworths..."))
                
                );

        });
    });

    scrapeBigW(productName, postcode, depth).then((values) => {
        values.forEach(function(val) {
            let storeId = Stores.findOne( { name: val.storeName } )
            .then(e => 
                User.update(
                    { "username" : req.session.userId },
                    { "$push" : { "searchResults" : {
                        "storeName": val.storeName,
                        "storeLocation": val.storeLocation,
                        "storeNo": val.storeNo,
                        "productName": val.productName,
                        "productPrice": val.productPrice,
                        "productStatus": val.productStatus,
                        "productUrl": val.productUrl,
                        "storeId": e._id
                    }} }
                    ).catch(err => console.log("error BigW...")))
            .catch(e => 
                // console.log("unable to find id");
                User.update(
                    { "username" : req.session.userId },
                    { "$push" : { "searchResults" : {
                        "storeName": val.storeName,
                        "storeLocation": val.storeLocation,
                        "storeNo": val.storeNo,
                        "productName": val.productName,
                        "productPrice": val.productPrice,
                        "productStatus": val.productStatus,
                        "productUrl": val.productUrl,
                        "storeId": "Unavailable"
                    }} }
                    ).catch(err => console.log("error BigW..."))
                
                );

        });
    });
  
  res.render('productSearch', {error: true});


});

router.get('/delete', function (req, res, next) {

    User.update(
        { "username" : req.session.userId },
        { "$set" : { "searchResults" : [] } }
    ).then(result => {
        return res.render("productSearch");
      })

});

module.exports = router;

