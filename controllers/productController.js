const mongoose = require("mongoose");

// import author model
const Product = mongoose.model("product");

    
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
  res.send("Working on this feature");
};

// remember to export the functions
module.exports = {
  getAllProducts,
  getProductByID,
  addProduct,
  updateProduct,
};
