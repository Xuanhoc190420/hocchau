import mongoose from "mongoose"

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  customerAddress: { type: String, required: true },
  storeId: { type: mongoose.Schema.Types.ObjectId, ref: "Store" },
  storeName: { type: String },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      productName: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      subtotal: { type: Number, required: true },
    },
  ],
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "confirmed", "shipping", "delivered", "cancelled"],
    default: "pending",
  },
  paymentMethod: {
    type: String,
    enum: ["cash", "bank_transfer", "card"],
    default: "cash",
  },
  notes: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

const Order = mongoose.model("Order", orderSchema)
export default Order
