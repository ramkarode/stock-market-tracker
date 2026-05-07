// models/Holding.js

const mongoose = require("mongoose");

const holdingSchema = new mongoose.Schema(
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

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    buyPrice: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Faster portfolio queries
holdingSchema.index({ userId: 1, symbol: 1 });

module.exports = mongoose.model("Holding", holdingSchema);