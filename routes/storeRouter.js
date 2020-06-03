const express = require("express");

// create router
const storeRouter = express.Router();

// load/import the author controller
const storeController = require("../controller/storeController.js");

const DEFAULT_KM = "5";

// All the paths under /store/
storeRouter.get("/:id", storeController.storeID);
storeRouter.get("/postcode/:id/", function (req,res) {
    res.redirect("/stores/postcode/" + req.params.id + "/" + DEFAULT_KM)
});
storeRouter.get("/postcode/:id/:distance", storeController.nearestStores);
storeRouter.get("/search/postcode", function (req, res) {
    res.redirect("/stores/postcode/" + req.query.postcode + "/" + req.query.distance);
});
storeRouter.get("/:id/plus", storeController.increaseYes);
storeRouter.get("/:id/minus", storeController.increaseNo);

module.exports = storeRouter;

