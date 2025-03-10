const router = require("express").Router();

const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItem");

// crud

// create

router.post("/", createItem);

// read

router.get("/", getItems);

// delete

router.delete("/:itemId", deleteItem);

// like and item

router.put("/:itemId/likes", likeItem);

// Dislike  an item
router.delete("/:itemId/likes", dislikeItem);

module.exports = router;