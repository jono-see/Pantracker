/*const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  id: String,
  product_name: String,
  last_name: String
});

const Product = mongoose.model("product", productSchema, "product");
module.exports = Product;*/

module.exports = [
  {
    "id": "1001",
    "product_name": "apples",
    "total_rating": "0",
  },
  {
    "id": "1002",
    "product_name": "oranges",
    "total_rating": "1",
  },
  {
    "id": "1003",
    "product_name": "bananas",
    "total_rating": "2",
  },
  {
    "id": "2001",
    "product_name": "toilet paper",
    "total_rating": "-999",
  }
];
