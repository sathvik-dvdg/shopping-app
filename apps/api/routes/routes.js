//apps\api\routes\routes.js
const express = require("express");
const { AllItems, singleItem, addItem, updateItem, deleteItem } = require("../src/controllers/controller");
const { registerUser, loginUser, refresh, logout, me } = require("../src/controllers/authController");
const { protect, admin } = require("../src/middleware/authMiddleware");

const routes = express.Router();
routes.use(express.json());

// Auth routes (Aligned with frontend client.ts)
routes.post("/auth/register", registerUser);
routes.post("/auth/login", loginUser);
routes.post("/auth/refresh", refresh);
routes.post("/auth/logout", logout);
routes.get("/auth/me", protect, me); // Protected route to get user profile

// Public product routes
routes.get("/products", AllItems);
routes.get("/products/:id", singleItem);

// Protected admin routes (requires JWT and admin role)
routes.post("/products", protect, admin, addItem);
routes.put("/products/:id", protect, admin, updateItem);
routes.delete("/products/:id", protect, admin, deleteItem);

module.exports = routes;