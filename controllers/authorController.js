const mongoose = require("mongoose");

// import author model
const Author = mongoose.model("author");

    
// function to handle a request to get all authors
const getAllAuthors = async (req, res) => {
    
  try {
    const all_authors = await Author.find();
    return res.send(all_authors);
  } catch (err) {
    res.status(400);
    return res.send("Database query failed");
  }
};
    
  
  

// function to modify author by ID
const updateAuthor = async (req, res) => {
  res.send("Working on this feature");
};

// function to add author
const addAuthor = async (req, res) => {
 res.send("Working on this feature");
};

// function to get author by id
const getAuthorByID = (req, res) => {
  res.send("Working on this feature");
};

// remember to export the functions
module.exports = {
  getAllAuthors,
  getAuthorByID,
  addAuthor,
  updateAuthor
};
