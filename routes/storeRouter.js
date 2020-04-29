const express = require("express");

// create router
const storeRouter = express.Router();

// load/import the author controller
const storeController = require("../controller/authenticate/storeController.js");

//storeRouter.get('/map/:id', (req, res) => storeController.displayMap(req, res));

storeRouter.get("/:id", storeController.listStores);

module.exports = storeRouter;