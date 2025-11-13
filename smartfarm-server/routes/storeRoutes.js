import express from "express"
import Store from "../models/Store.js"

const router = express.Router()

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371 // Radius of the Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c // Distance in km
}

// Get all stores
router.get("/", async (req, res) => {
  try {
    const stores = await Store.find().sort({ createdAt: -1 })
    res.json(stores)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get nearest stores based on customer location
router.get("/nearest", async (req, res) => {
  try {
    const { lat, lng, limit = 5 } = req.query

    if (!lat || !lng) {
      return res.status(400).json({ error: "Vui lòng cung cấp tọa độ (lat, lng)" })
    }

    const userLat = Number.parseFloat(lat)
    const userLng = Number.parseFloat(lng)

    // Get all active stores
    const stores = await Store.find({ status: "active" })

    // Calculate distance for each store
    const storesWithDistance = stores.map((store) => {
      const distance = calculateDistance(userLat, userLng, store.coordinates.lat, store.coordinates.lng)
      return {
        ...store.toObject(),
        distance: distance.toFixed(2), // Distance in km with 2 decimals
      }
    })

    // Sort by distance and limit results
    const nearestStores = storesWithDistance
      .sort((a, b) => Number.parseFloat(a.distance) - Number.parseFloat(b.distance))
      .slice(0, Number.parseInt(limit))

    res.json(nearestStores)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get single store
router.get("/:id", async (req, res) => {
  try {
    const store = await Store.findById(req.params.id)
    if (!store) {
      return res.status(404).json({ error: "Không tìm thấy cửa hàng" })
    }
    res.json(store)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Create new store
router.post("/", async (req, res) => {
  try {
    console.log("[v0] Server: Received store creation request:", req.body)
    const newStore = new Store(req.body)
    console.log("[v0] Server: Created store instance:", newStore)
    await newStore.save()
    console.log("[v0] Server: Store saved successfully:", newStore._id)
    res.status(201).json(newStore)
  } catch (error) {
    console.error("[v0] Server: Error creating store:", error)
    res.status(400).json({ error: error.message })
  }
})

// Update store
router.put("/:id", async (req, res) => {
  try {
    req.body.updatedAt = Date.now()
    const updated = await Store.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!updated) {
      return res.status(404).json({ error: "Không tìm thấy cửa hàng" })
    }
    res.json(updated)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Delete store
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Store.findByIdAndDelete(req.params.id)
    if (!deleted) {
      return res.status(404).json({ error: "Không tìm thấy cửa hàng" })
    }
    res.json({ message: "Xóa cửa hàng thành công" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
