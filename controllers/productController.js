const mongoose = require("mongoose");

// import author model
//const Product = mongoose.model("product");

    
// function to handle a request to get all authors
/*const getAllProducts = async (req, res) => {
  res.send("<H1>All products listed here</H1>");
  try {
    const all_products = await Product.find();
    return res.send(all_products);
  } catch (err) {
    res.status(400);
    return res.send("Database query failed");

  }
};*/

var products = require('../models/product');

const getAllProducts = (req, res) => {
  res.send(products);
};

    
  
  

// function to modify author by ID
const updateProduct = async (req, res) => {
  res.send("Working on this feature");
};

// function to add author
const addProduct = async (req, res) => {
 res.send("Working on this feature");
};

// function to get author by id
const getProductByID = (req, res) => {
// search for author in the database via ID
  const product = products.find(product => product.id === req.params.id);
  if (product){
    res.send(product); // send back the author details
  }
  else{
// you can decide what to return if author is not found
// currently, an empty list will be return.
    res.send("<p> Product not found </p>");
  }
};

// remember to export the functions
module.exports = {
  getAllProducts,
  getProductByID,
  addProduct,
  updateProduct,
};
