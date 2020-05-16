const express = require("express");

// create router
const storeRouter = express.Router();

// load/import the author controller
const storeController = require("../controller/storeController.js");

//storeRouter.get('/map/:id', (req, res) => storeController.displayMap(req, res));
storeRouter.get("/:id", storeController.storeID);
storeRouter.get("/postcode/:id/", storeController.nearestStores);
storeRouter.get("/search/postcode", function (req, res) {
    res.redirect("/stores/postcode/" + req.query.postcode);
});
storeRouter.get("/:id/plus", storeController.increaseYes);
storeRouter.get("/:id/minus", storeController.increaseNo);
storeRouter.get("/list/bigw", storeController.getAllStores);

module.exports = storeRouter;
