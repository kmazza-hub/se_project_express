const express = require("express");

const router = express.Router();
const {
  getClothingItems,
  createClothingItem,
  getUserClothingItems,
  deleteClothingItem,
} = require("../controllers/clothingItem");
const auth = require("../middlewares/auth");

router.get("/", getClothingItems);

router.get("/my-items", auth, getUserClothingItems);

router.post("/", auth, createClothingItem);

router.delete("/:id", auth, deleteClothingItem);

module.exports = router;
