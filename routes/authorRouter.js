import * as res from "express";

var express = require("express");

// create router
var router = express.Router();

// load/import the author controller
const authorController = require("../controllers/authorController.js");

// handle the GET request on root of the author-management path
// i.e. get all authors
router.get("/", (req, res) => {
    res.send("<H1>All products listed here</H1>");
};

// handle the GET request to get an author by ID
// note that :id refers to a param, accessed by req.params.id in controller fn
router.get("/:id", authorController.getAuthorByID);

// handle the POST request to add an author
router.post("/", authorController.addAuthor);

// handle the POST request to update an author
// note that the PATCH method may be more appropriate
router.post("/:id", authorController.updateAuthor);

// export the router
module.exports = router;
