const express = require("express");

// create router
const router = express.Router();

// load/import the author controller
const productController = require("../controllers/productController.js");

// handle the GET request on root of the author-management path
// i.e. get all authors
router.get('/', (req, res) => productController.getAllProducts(req, res));


// handle the GET request to get an author by ID
// note that :id refers to a param, accessed by req.params.id in controller fn
router.get("/:id", productController.getProductByID);

// handle the POST request to add an author
router.post("/", productController.addProduct);

// handle the POST request to update an author
// note that the PATCH method may be more appropriate
router.post("/:id", productController.updateProduct);

// export the router
module.exports = router;
