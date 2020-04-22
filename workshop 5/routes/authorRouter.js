const express = require("express");

// create router
const authorRouter = express.Router();

// load/import the author controller
const authorController = require("../controllers/authorController.js");

// handle the GET request on root of the author-management path
// i.e. get all authors
authorRouter.get("/", authorController.getAllAuthors);

// handle the GET request to get an author by ID
// note that :id refers to a param, accessed by req.params.id in controller fn
authorRouter.get("/:id", authorController.getAuthorByID);

// handle the POST request to add an author
authorRouter.post("/", authorController.addAuthor);

// handle the POST request to update an author
// note that the PATCH method may be more appropriate
authorRouter.post("/:id", authorController.updateAuthor);

// export the router
module.exports = authorRouter;
