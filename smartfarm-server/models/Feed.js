// models/Feed.js
import mongoose from "mongoose"

const feedSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ["vaccine", "vitamin", "compound"], default: "compound" },
  coopId: { type: mongoose.Schema.Types.ObjectId, ref: "Coop" },
  ingredients: [
    {
      name: String,
      quantity: Number,
      unitPrice: Number,
      totalPrice: Number,
    },
  ],
  totalCost: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
})

const Feed = mongoose.model("Feed", feedSchema)
export default Feed
