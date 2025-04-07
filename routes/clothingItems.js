// routes/clothingItems.js

const express = require("express");
const { getItems, createItem, deleteItem, likeItem, dislikeItem } = require("../controllers/clothingitems");
const auth = require("../middlewares/auth");

const router = express.Router();

router.get("/items", getItems);
router.post("/items", auth, createItem);
router.delete("/items/:itemId", auth, deleteItem);
router.put("/items/:itemId/likes", auth, likeItem);
router.delete("/items/:itemId/likes", auth, dislikeItem);

module.exports = router;
