// backend/routes/routes.js
const express = require("express");
const {
  AllItems,
  singleItem,
  addItem,
  updateItem,
  deleteItem,
} = require("../controllers/controller");

const routes = express.Router();
routes.use(express.json());
routes.get("/", AllItems);

routes.get("/:id", singleItem);

routes.post("/", addItem);

routes.put("/:id", updateItem);

routes.delete("/:id", deleteItem);

module.exports = routes;