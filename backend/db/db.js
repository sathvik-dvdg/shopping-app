// db/db.js
const mongoose = require("mongoose");

const connectdb = (url) => {
  return mongoose
    .connect(url)
    .then(() => {
      console.log(" connected to mongo db");
    })
    .catch((err) => {
      console.log("error in connecting db", err);
    });
};

module.exports = connectdb;