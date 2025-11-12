import express from "express"
import Order from "../models/Order.js"

const router = express.Router()

// Get all orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 })
    res.json(orders)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get single order
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
    if (!order) return res.status(404).json({ error: "Order not found" })
    res.json(order)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Create order
router.post("/", async (req, res) => {
  try {
    // Generate order number
    const orderCount = await Order.countDocuments()
    const orderNumber = `ORD${String(orderCount + 1).padStart(6, "0")}`

    const order = new Order({
      ...req.body,
      orderNumber,
    })
    await order.save()
    res.json(order)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Update order
router.put("/:id", async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { ...req.body, updatedAt: Date.now() }, { new: true })
    if (!order) return res.status(404).json({ error: "Order not found" })
    res.json(order)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Delete order
router.delete("/:id", async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id)
    if (!order) return res.status(404).json({ error: "Order not found" })
    res.json({ message: "Order deleted successfully" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
