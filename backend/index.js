//index.js
const express = require('express');
const cors = require('cors');
const connectDB = require("./db/db");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 3000;

const routes = require('./routes/routes');

// Middleware
app.use(cors({
  origin: '*', // replace with frontend URL in production
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/', routes);

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () => {
      console.log(`server is running on port ${PORT} `);
    });
  } catch (error) {
    console.log("db is not connected");
  }
};
start();