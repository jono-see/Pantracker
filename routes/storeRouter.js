const express = require("express");

// create router
const storeRouter = express.Router();

// load/import the author controller
const storeController = require("../controller/storeController.js");

// All the paths under /store/
storeRouter.get("/:id", storeController.storeID);
storeRouter.get("/postcode/:id/", storeController.nearestStores);
storeRouter.get("/search/postcode", function (req, res) {
    res.redirect("/stores/postcode/" + req.query.postcode);
});
storeRouter.get("/:id/plus", storeController.increaseYes);
storeRouter.get("/:id/minus", storeController.increaseNo);

module.exports = storeRouter;

