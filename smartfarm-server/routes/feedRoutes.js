import express from "express"
import Feed from "../models/Feed.js"
import Coop from "../models/Coop.js"
const router = express.Router()

router.get("/", async (req, res) => {
  try {
    const list = await Feed.find().sort({ createdAt: -1 })
    res.json(list)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.post("/", async (req, res) => {
  try {
    const { name, ingredients, type, coopId, totalCost } = req.body

    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Feed name is required" })
    }

    const f = new Feed({
      name: name.trim(),
      type: type || "compound",
      coopId,
      ingredients: ingredients || [],
      totalCost: totalCost || 0,
    })
    await f.save()

    if (coopId && totalCost) {
      const coop = await Coop.findById(coopId)
      if (coop) {
        coop.totalFeedCost = (coop.totalFeedCost || 0) + totalCost
        await coop.save()
      }
    }

    res.json(f)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.get("/:id", async (req, res) => {
  try {
    const f = await Feed.findById(req.params.id)
    if (!f) return res.status(404).json({ error: "Feed not found" })
    res.json(f)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.put("/:id", async (req, res) => {
  try {
    const f = await Feed.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!f) return res.status(404).json({ error: "Feed not found" })
    res.json(f)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.delete("/:id", async (req, res) => {
  try {
    const f = await Feed.findById(req.params.id)
    if (!f) return res.status(404).json({ error: "Feed not found" })

    if (f.coopId && f.totalCost) {
      const coop = await Coop.findById(f.coopId)
      if (coop) {
        coop.totalFeedCost = Math.max(0, (coop.totalFeedCost || 0) - f.totalCost)
        await coop.save()
      }
    }

    await Feed.findByIdAndDelete(req.params.id)
    res.json({ ok: true, message: "Feed deleted" })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

export default router
