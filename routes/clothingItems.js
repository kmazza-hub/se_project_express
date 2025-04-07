const express = require("express");
const { getItems, createItem, deleteItem, likeItem, dislikeItem } = require("../controllers/clothingItems");
const auth = require("../middlewares/auth");

const router = express.Router();

// Correct the route to match the "/api/items" route in the main app
router.get("/", getItems);  // This will now handle GET requests to /api/items
router.post("/", auth, createItem);  // POST requests to /api/items
router.delete("/:itemId", auth, deleteItem);  // DELETE requests to /api/items/:itemId
router.put("/:itemId/likes", auth, likeItem);  // PUT requests to /api/items/:itemId/likes
router.delete("/:itemId/likes", auth, dislikeItem);  // DELETE requests to /api/items/:itemId/likes

module.exports = router;
