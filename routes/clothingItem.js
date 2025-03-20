const express = require("express");
const { getClothingItems, createClothingItem, deleteClothingItem } = require("../controllers/clothingItem");

const router = express.Router();

router.get("/", getClothingItems);
router.post("/", createClothingItem);
router.delete("/:id", deleteClothingItem);

module.exports = router;
