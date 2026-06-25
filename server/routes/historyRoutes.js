const express = require("express");
const {
  getHistory,
  deleteHistory,
} = require("../controllers/historyController");
const router = express.Router();

router.get("/", getHistory);
router.delete("/", deleteHistory);

module.exports = router;