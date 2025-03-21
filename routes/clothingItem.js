const express = require("express");
const {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  addLike,
  removeLike,
} = require("../controllers/clothingItem");
const auth = require("../middlewares/auth");

const router = express.Router();

router.get("/", getClothingItems);
router.post("/", auth, createClothingItem);
router.delete("/:id", auth, deleteClothingItem);
router.put("/:id/likes", auth, addLike);
router.delete("/:id/likes", auth, removeLike);

module.exports = router;
