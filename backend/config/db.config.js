const mongoose = require("mongoose");
const debugDb = require("debug")("db");

//Mongodb connection using cluster url
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    debugDb("Database connected");
  })
  .catch((err) => {
    debugDb(err);
  });
