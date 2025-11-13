import express from "express"
import HomeContent from "../models/HomeContent.js"

const router = express.Router()

// GET all home content sections
router.get("/", async (req, res) => {
  try {
    const sections = await HomeContent.find({ isVisible: true }).sort({ order: 1 })
    res.json({ success: true, data: sections })
  } catch (error) {
    console.error("Error fetching home content:", error)
    res.status(500).json({ success: false, error: "Failed to fetch home content" })
  }
})

// GET single section
router.get("/:id", async (req, res) => {
  try {
    const section = await HomeContent.findById(req.params.id)
    if (!section) {
      return res.status(404).json({ success: false, error: "Section not found" })
    }
    res.json({ success: true, data: section })
  } catch (error) {
    console.error("Error fetching section:", error)
    res.status(500).json({ success: false, error: "Failed to fetch section" })
  }
})

// POST create new section
router.post("/", async (req, res) => {
  try {
    const section = new HomeContent(req.body)
    await section.save()
    res.status(201).json({ success: true, data: section })
  } catch (error) {
    console.error("Error creating section:", error)
    res.status(500).json({ success: false, error: "Failed to create section" })
  }
})

// PUT update section
router.put("/:id", async (req, res) => {
  try {
    const section = await HomeContent.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!section) {
      return res.status(404).json({ success: false, error: "Section not found" })
    }
    res.json({ success: true, data: section })
  } catch (error) {
    console.error("Error updating section:", error)
    res.status(500).json({ success: false, error: "Failed to update section" })
  }
})

// DELETE section
router.delete("/:id", async (req, res) => {
  try {
    const section = await HomeContent.findByIdAndDelete(req.params.id)
    if (!section) {
      return res.status(404).json({ success: false, error: "Section not found" })
    }
    res.json({ success: true, message: "Section deleted successfully" })
  } catch (error) {
    console.error("Error deleting section:", error)
    res.status(500).json({ success: false, error: "Failed to delete section" })
  }
})

// PUT update order
router.put("/reorder/:id", async (req, res) => {
  try {
    const { newOrder } = req.body
    const section = await HomeContent.findByIdAndUpdate(req.params.id, { order: newOrder }, { new: true })
    if (!section) {
      return res.status(404).json({ success: false, error: "Section not found" })
    }
    res.json({ success: true, data: section })
  } catch (error) {
    console.error("Error reordering section:", error)
    res.status(500).json({ success: false, error: "Failed to reorder section" })
  }
})

export default router
