const mongoose = require("mongoose");
const Notification = require("../models/Notification");

const getMyNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({
      recipient: req.user.userId,
      type: "gift_received",
    })
      .populate("sender", "name email")
      .populate("game", "title slug image portraitImage")
      .populate("gift", "status sentAt acceptedAt")
      .sort({ createdAt: -1 })
      .limit(30)
      .lean();

    const unreadCount = await Notification.countDocuments({
      recipient: req.user.userId,
      type: "gift_received",
      read: false,
    });

    return res.status(200).json({
      success: true,
      notifications,
      unreadCount,
    });
  } catch (error) {
    next(error);
  }
};

const getUnreadNotificationCount = async (req, res, next) => {
  try {
    const unreadCount = await Notification.countDocuments({
      recipient: req.user.userId,
      type: "gift_received",
      read: false,
    });

    return res.status(200).json({
      success: true,
      unreadCount,
    });
  } catch (error) {
    next(error);
  }
};

const markNotificationAsRead = async (req, res, next) => {
  try {
    const { notificationId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(notificationId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid notification ID.",
      });
    }

    const notification = await Notification.findOne({
      _id: notificationId,
      recipient: req.user.userId,
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found.",
      });
    }

    if (!notification.read) {
      notification.read = true;
      notification.readAt = new Date();

      await notification.save();
    }

    return res.status(200).json({
      success: true,
      message: "Notification marked as read.",
      notification,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
};
