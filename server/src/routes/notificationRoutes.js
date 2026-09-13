const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  getMyNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
} = require("../controllers/notificationController");

const router = express.Router();

router.use(protect);

router.get("/", getMyNotifications);
router.get("/unread-count", getUnreadNotificationCount);
router.patch("/:notificationId/read", markNotificationAsRead);

module.exports = router;