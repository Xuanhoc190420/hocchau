import express from "express"
import User from "../models/User.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

// Setup demo accounts (useful for testing)
router.post("/setup-demo", async (req, res) => {
  try {
    const results = []

    // Check if admin exists
    const adminExists = await User.findOne({ email: "admin@farm.com" })
    if (!adminExists) {
      const adminPassword = await bcrypt.hash("admin123", 10)
      const admin = new User({
        email: "admin@farm.com",
        password: adminPassword,
        fullName: "Admin Gà Đồi",
        phone: "+84 123 456 789",
        role: "admin",
      })
      await admin.save()
      results.push("Created admin account: admin@farm.com / admin123")
    } else {
      results.push("Admin account already exists")
    }

    // Check if customer exists
    const customerExists = await User.findOne({ email: "customer@farm.com" })
    if (!customerExists) {
      const customerPassword = await bcrypt.hash("customer123", 10)
      const customer = new User({
        email: "customer@farm.com",
        password: customerPassword,
        fullName: "Khách Hàng Demo",
        phone: "+84 987 654 321",
        role: "user",
      })
      await customer.save()
      results.push("Created customer account: customer@farm.com / customer123")
    } else {
      results.push("Customer account already exists")
    }

    res.json({
      ok: true,
      message: "Demo accounts setup completed",
      results,
      accounts: [
        { email: "admin@farm.com", password: "admin123", role: "admin" },
        { email: "customer@farm.com", password: "customer123", role: "user" },
      ],
    })
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message })
  }
})

// Register
router.post("/register", async (req, res) => {
  try {
    const { email, password, fullName, phone, role } = req.body

    if (!email || !password || !fullName) {
      return res.status(400).json({ ok: false, error: "Missing required fields" })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ ok: false, error: "Email không hợp lệ" })
    }

    if (password.length < 6) {
      return res.status(400).json({ ok: false, error: "Mật khẩu phải ít nhất 6 ký tự" })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ ok: false, error: "Email đã được đăng ký" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = new User({
      email,
      password: hashedPassword,
      fullName,
      phone,
      role: role || "user",
    })

    await user.save()

    const token = jwt.sign({ userId: user._id, email: user.email, role: user.role }, JWT_SECRET, {
      expiresIn: "7d",
    })

    res.json({
      ok: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone,
        role: user.role, // Return role to frontend
      },
    })
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message })
  }
})

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ ok: false, error: "Email và mật khẩu là bắt buộc" })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ ok: false, error: "Email hoặc mật khẩu không đúng" })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ ok: false, error: "Email hoặc mật khẩu không đúng" })
    }

    const token = jwt.sign({ userId: user._id, email: user.email, role: user.role }, JWT_SECRET, {
      expiresIn: "7d",
    })

    res.json({
      ok: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone,
        role: user.role, // Return role to frontend
      },
    })
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message })
  }
})

// Get current user
router.get("/me", (req, res) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1]
    if (!token) {
      return res.status(401).json({ ok: false, error: "No token provided" })
    }

    const decoded = jwt.verify(token, JWT_SECRET)
    res.json({ ok: true, userId: decoded.userId, role: decoded.role })
  } catch (err) {
    res.status(401).json({ ok: false, error: "Invalid token" })
  }
})

// Update profile
router.put("/profile", async (req, res) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1]
    if (!token) {
      return res.status(401).json({ ok: false, error: "No token provided" })
    }

    const decoded = jwt.verify(token, JWT_SECRET)
    const { fullName, phone } = req.body

    const user = await User.findByIdAndUpdate(decoded.userId, { fullName, phone, updatedAt: Date.now() }, { new: true })

    res.json({
      ok: true,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone,
        role: user.role, // Return role to frontend
      },
    })
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message })
  }
})

export default router
