const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    symbol: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      index: true,
    },

    conditionType: {
      type: String,
      enum: ["gt", "lt"], // greater than / less than
      required: true,
    },

    targetPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    isTriggered: {
      type: Boolean,
      default: false,
    },

    triggeredAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Optimize alert scans
alertSchema.index({
  symbol: 1,
  conditionType: 1,
  isTriggered: 1,
});

module.exports = mongoose.model("Alert", alertSchema);