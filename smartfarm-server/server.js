import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cors from "cors"
import axios from "axios"
import coopRoutes from "./routes/coopRoutes.js"
import chickenRoutes from "./routes/chickenRoutes.js"
import feedRoutes from "./routes/feedRoutes.js"
import sensorRoutes from "./routes/sensorRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import contactRoutes from "./routes/contactRoutes.js"
import productRoutes from "./routes/productRoutes.js"
import orderRoutes from "./routes/orderRoutes.js"
import SensorLog from "./models/SensorLog.js"

dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 3000
const MONGO_URI = process.env.MONGO_URI
const BLYNK_TOKEN = process.env.BLYNK_AUTH_TOKEN
const API_KEY = process.env.API_KEY || ""
const SAVE_SENSOR = (process.env.SAVE_SENSOR || "true") === "true"
const SENSOR_SAVE_INTERVAL_SECONDS = Number.parseInt(process.env.SENSOR_SAVE_INTERVAL_SECONDS || "30", 10)

// Connect Mongo
if (!MONGO_URI) {
  console.error("MONGO_URI not set in .env")
} else {
  mongoose
    .connect(MONGO_URI)
    .then(() => console.log("✅ MongoDB connected"))
    .catch((err) => console.error("❌ MongoDB connection error:", err.message))
}

// Simple API key middleware
function requireApiKey(req, res, next) {
  const key = req.header("x-api-key")
  if (!API_KEY) return next()
  if (!key || key !== API_KEY) return res.status(401).json({ ok: false, error: "Unauthorized - invalid API key" })
  next()
}

app.get("/", (req, res) => res.send("🐔 SmartFarm API is running"))

app.use("/api/users", userRoutes)
app.use("/api/contact", contactRoutes)
app.use("/api/coops", coopRoutes)
app.use("/api/chickens", chickenRoutes)
app.use("/api/feed", feedRoutes)
app.use("/api/sensors", sensorRoutes)
app.use("/api/products", productRoutes)
app.use("/api/orders", orderRoutes)

// Proxy to fetch all Blynk pins (and optionally save snapshot)
app.get("/api/blynk/getAll", requireApiKey, async (req, res) => {
  try {
    if (!BLYNK_TOKEN) return res.status(500).json({ ok: false, error: "Blynk token not configured" })
    const url = `https://blynk.cloud/external/api/getAll?token=${encodeURIComponent(BLYNK_TOKEN)}`
    const r = await axios.get(url)
    const data = r.data
    if (SAVE_SENSOR) {
      try {
        const doc = new SensorLog({ data })
        await doc.save()
      } catch (e) {
        console.warn("Failed to save sensor snapshot:", e.message)
      }
    }
    res.json({ ok: true, data })
  } catch (err) {
    console.error("Error fetching Blynk:", err.toString())
    res.status(500).json({ ok: false, error: err.toString() })
  }
})

// Background periodic fetch to store sensor snapshot
if (SAVE_SENSOR && BLYNK_TOKEN) {
  setInterval(async () => {
    try {
      const url = `https://blynk.cloud/external/api/getAll?token=${encodeURIComponent(BLYNK_TOKEN)}`
      const r = await axios.get(url)
      const doc = new SensorLog({ data: r.data })
      await doc.save()
      console.log("Saved sensor snapshot", new Date().toISOString())
    } catch (e) {
      console.warn("Background sensor save error:", e.message)
    }
  }, SENSOR_SAVE_INTERVAL_SECONDS * 1000)
}

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))
