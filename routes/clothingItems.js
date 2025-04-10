const express = require("express");
const {
  getItems,
  addItem,
  deleteItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingItems");
const auth = require("../middlewares/auth");

const router = express.Router();

// Define the routes
router.get("/", getItems);
router.post("/", auth, addItem);
router.delete("/:id", auth, deleteItem);
router.put("/:id/likes", auth, likeItem);
router.delete("/:id/likes", auth, unlikeItem);

module.exports = router; // Export the router instance

