import express from "express"
import Coop from "../models/Coop.js"
const router = express.Router()

router.get("/", async (req, res) => {
  try {
    const list = await Coop.find().sort({ createdAt: -1 })
    res.json(list)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.post("/", async (req, res) => {
  try {
    const { name, location, notes } = req.body

    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Coop name is required" })
    }

    const namePattern = /^[Cc]huồng\s+\d+$/
    if (!namePattern.test(name.trim())) {
      return res.status(400).json({ error: 'Tên chuồng phải theo định dạng "Chuồng 1" hoặc "chuồng 2"...' })
    }

    const existingCoop = await Coop.findOne({ name: name.trim() })
    if (existingCoop) {
      return res.status(400).json({ error: "Tên chuồng đã tồn tại. Vui lòng chọn tên khác!" })
    }

    const c = new Coop({
      name: name.trim(),
      chickens: 0,
      location: location || "",
      notes: notes || "",
    })
    await c.save()
    res.json(c)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.get("/:id", async (req, res) => {
  try {
    const c = await Coop.findById(req.params.id)
    if (!c) return res.status(404).json({ error: "Coop not found" })
    res.json(c)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.put("/:id", async (req, res) => {
  try {
    const c = await Coop.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!c) return res.status(404).json({ error: "Coop not found" })
    res.json(c)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.delete("/:id", async (req, res) => {
  try {
    const c = await Coop.findByIdAndDelete(req.params.id)
    if (!c) {
      return res.status(404).json({ error: "Coop not found" })
    }
    res.json({ ok: true, message: "Coop deleted", coop: c })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

export default router
