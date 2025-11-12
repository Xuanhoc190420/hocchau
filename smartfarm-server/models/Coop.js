// Coop.js
import mongoose from "mongoose"

const coopSchema = new mongoose.Schema({
  name: { type: String, required: true },
  chickens: { type: Number, default: 0 },
  location: { type: String, default: "" },
  notes: { type: String, default: "" },
  totalChickenCost: { type: Number, default: 0 }, // Total cost of chicken purchases
  totalFeedCost: { type: Number, default: 0 }, // Total cost of feed
  totalRevenue: { type: Number, default: 0 }, // Total revenue from chicken sales
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

coopSchema.pre("save", function (next) {
  this.updatedAt = Date.now()
  next()
})

export default mongoose.model("Coop", coopSchema)
