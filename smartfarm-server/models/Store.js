import mongoose from "mongoose"

const storeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    phone: { type: String, required: true },
    image: { type: String, default: "" },
    openingHours: { type: String, default: "08:00 - 22:00" },
    status: {
      type: String,
      enum: ["active", "closed", "temporarily_closed"],
      default: "active",
    },
    description: { type: String, default: "" },
    rating: { type: Number, default: 5, min: 0, max: 5 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  },
)

const Store = mongoose.model("Store", storeSchema)
export default Store
