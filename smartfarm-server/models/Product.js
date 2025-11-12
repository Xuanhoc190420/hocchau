import mongoose from "mongoose"

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: {
    type: String,
    enum: ["ga-tuoi", "ga-kho", "trung", "pho-ga", "com-ga", "ga-luoc", "khac"],
    default: "khac",
  },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, default: "" },
  inStock: { type: Boolean, default: true },
  quantity: { type: Number, default: 0 },
  rating: { type: Number, default: 5, min: 0, max: 5 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

const Product = mongoose.model("Product", productSchema)
export default Product
