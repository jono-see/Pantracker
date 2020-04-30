const express = require("express");

// create router
const storeRouter = express.Router();

// load/import the author controller
const storeController = require("../controller/authenticate/storeController.js");

//storeRouter.get('/map/:id', (req, res) => storeController.displayMap(req, res));
storeRouter.get("/:id", storeController.storeID);
storeRouter.get("/:id/closest", storeController.listStores);
storeRouter.get("/postcode/:id/", storeController.listStoresByPostcode);
storeRouter.post("/:id/plus", storeController.increaseYes);
storeRouter.post("/:id/minus", storeController.increaseNo);

module.exports = storeRouter;
