const express = require("express");
const bodyParser = require("body-parser");


const app = express();

require("./models");

var routes = require('./routes/index');
// use the body-parser middleware, which parses request bodies into req.body
// support parsing of json
app.use(bodyParser.json());
// support parsing of urlencoded bodies (e.g. for forms)
app.use(bodyParser.urlencoded({ extended: true }));

// GET home page
/*app.get("/", (req, res) => {
  res.send("<H1>Team Pantracker</H1>");
});*/

app.use('/', routes);

// handle author-management related requests
// first import the author router
const router = require("./routes/productRouter");

// the product routes are added onto the end of '/author-management'
app.use("/product-id", router);

// start app and listen for incoming requests on port
app.listen(process.env.PORT || 3000, () => {
  console.log("The library app is running!");
});

