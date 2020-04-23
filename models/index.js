require('dotenv').config()

const mongoose = require("mongoose");

// Connect to MongoDB
CONNECTION_STRING = "mongodb+srv://jono:<password>@cluster0-ek7nd.mongodb.net/INFO30005_Pantracker?retryWrites=true&w=majority";
MONGO_URL = CONNECTION_STRING.replace("<password>",process.env.MONGO_PASSWORD);

console.log(MONGO_URL);



mongoose.connect(MONGO_URL || "mongodb://localhost/info30005", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  dbName: "INFO30005_Pantracker"
});

const db = mongoose.connection;
db.on("error", err => {
  console.error(err);
  process.exit(1);
});
db.once("open", async () => {
  console.log("Mongo connection started on " + db.host + ":" + db.port);
});

require("./author");
