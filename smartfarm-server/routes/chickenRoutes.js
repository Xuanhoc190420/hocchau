import express from "express"
import Chicken from "../models/Chicken.js"
import Coop from "../models/Coop.js"
const router = express.Router()

router.get("/", async (req, res) => {
  try {
    const list = await Chicken.find().sort({ createdAt: -1 }).limit(200)
    res.json(list)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.post("/", async (req, res) => {
  try {
    const { coopId, type, quantity, reason, breed, note, startDate, chickPrice, supplier, salePrice } = req.body

    if (!coopId || !type || !quantity) {
      return res.status(400).json({ error: "Missing required fields: coopId, type, quantity" })
    }
    if (!["IN", "OUT"].includes(type)) {
      return res.status(400).json({ error: "Type must be 'IN' or 'OUT'" })
    }
    if (quantity <= 0) {
      return res.status(400).json({ error: "Quantity must be greater than 0" })
    }

    const coop = await Coop.findById(coopId)
    if (!coop) {
      return res.status(404).json({ error: "Coop not found" })
    }

    let newCount = coop.chickens || 0
    if (type === "IN") {
      newCount += Math.abs(quantity)
      if (chickPrice && chickPrice > 0) {
        coop.totalChickenCost = (coop.totalChickenCost || 0) + chickPrice * Math.abs(quantity)
      }
    } else if (type === "OUT") {
      newCount -= Math.abs(quantity)
      if (salePrice && salePrice > 0) {
        coop.totalRevenue = (coop.totalRevenue || 0) + salePrice * Math.abs(quantity)
      }
    }

    if (newCount < 0) {
      return res.status(400).json({ error: "Cannot export more chickens than available" })
    }

    coop.chickens = newCount
    await coop.save()

    const tx = new Chicken({
      coopId,
      type,
      quantity: Math.abs(quantity),
      reason: reason || "",
      breed: breed || "",
      note: note || "",
      startDate: startDate || "",
      chickPrice: chickPrice || 0,
      supplier: supplier || "",
      salePrice: salePrice || 0,
    })
    await tx.save()

    res.json({ ok: true, coop, tx })
  } catch (e) {
    console.error("Error in POST /chickens:", e)
    res.status(500).json({ error: e.message })
  }
})

router.get("/coop/:coopId", async (req, res) => {
  try {
    const list = await Chicken.find({ coopId: req.params.coopId }).sort({ createdAt: -1 }).limit(100)
    res.json(list)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.delete("/:id", async (req, res) => {
  try {
    const tx = await Chicken.findById(req.params.id)
    if (!tx) {
      return res.status(404).json({ error: "Transaction not found" })
    }

    // Update coop chicken count and cost when deleting
    const coop = await Coop.findById(tx.coopId)
    if (coop) {
      if (tx.type === "IN") {
        coop.chickens = Math.max(0, (coop.chickens || 0) - tx.quantity)
        // Subtract cost when deleting import transaction
        if (tx.chickPrice > 0) {
          coop.totalChickenCost = Math.max(0, (coop.totalChickenCost || 0) - tx.chickPrice * tx.quantity)
        }
      } else if (tx.type === "OUT") {
        coop.chickens = (coop.chickens || 0) + tx.quantity
        if (tx.salePrice > 0) {
          coop.totalRevenue = Math.max(0, (coop.totalRevenue || 0) - tx.salePrice * tx.quantity)
        }
      }
      await coop.save()
    }

    await Chicken.findByIdAndDelete(req.params.id)
    res.json({ ok: true, message: "Transaction deleted successfully" })
  } catch (e) {
    console.error("Error deleting chicken transaction:", e)
    res.status(500).json({ error: e.message })
  }
})

export default router
