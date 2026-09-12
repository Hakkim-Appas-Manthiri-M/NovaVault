const express = require("express");

const { protect } = require("../middleware/authMiddleware");
const {
  getMyLibrary,
} = require("../controllers/ownershipController");

const router = express.Router();

router.use(protect);

router.get("/", getMyLibrary);

module.exports = router;