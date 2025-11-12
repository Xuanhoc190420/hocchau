// Chicken.js
import mongoose from "mongoose"

const chickenSchema = new mongoose.Schema({
  coopId: { type: mongoose.Schema.Types.ObjectId, ref: "Coop", required: true },
  type: { type: String, enum: ["IN", "OUT"], required: true },
  quantity: { type: Number, required: true },
  reason: { type: String, default: "" },
  breed: { type: String, default: "" },
  note: { type: String, default: "" },
  startDate: { type: String, default: "" },
  chickPrice: { type: Number, default: 0 },
  supplier: { type: String, default: "" },
  salePrice: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.model("Chicken", chickenSchema)
