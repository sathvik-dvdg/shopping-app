const express = require("express");
const { AllItems, singleItem, addItem, updateItem, deleteItem } = require("../controllers/controller");
const { registerUser, loginUser } = require("../controllers/authController");
const { protect, admin } = require("../middleware/authMiddleware");

const routes = express.Router();
routes.use(express.json());

// Auth routes
routes.post("/register", registerUser);
routes.post("/login", loginUser);

// Public product routes
routes.get("/products", AllItems);
routes.get("/products/:id", singleItem);

// Protected admin routes (requires JWT and admin role)
routes.post("/products", protect, admin, addItem);
routes.put("/products/:id", protect, admin, updateItem);
routes.delete("/products/:id", protect, admin, deleteItem);

module.exports = routes;