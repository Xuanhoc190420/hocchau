import mongoose from "mongoose"
import bcrypt from "bcrypt"
import User from "../models/User.js"

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/smartfarm"

async function seedUsers() {
  try {
    await mongoose.connect(MONGO_URI)
    console.log("Connected to MongoDB")

    await User.deleteMany({})
    console.log("Cleared existing users")

    const adminPassword = await bcrypt.hash("admin123", 10)
    const admin = new User({
      email: "admin@farm.com",
      password: adminPassword,
      fullName: "Admin Gà Đồi",
      phone: "+84 123 456 789",
      role: "admin",
    })
    await admin.save()
    console.log("✓ Created admin account: admin@farm.com / admin123")

    const customerPassword = await bcrypt.hash("customer123", 10)
    const customer = new User({
      email: "customer@farm.com",
      password: customerPassword,
      fullName: "Khách Hàng Demo",
      phone: "+84 987 654 321",
      role: "user",
    })
    await customer.save()
    console.log("✓ Created customer account: customer@farm.com / customer123")

    console.log("\n✓ User seeding completed successfully!")
    console.log("\nTest accounts:")
    console.log("  Admin: admin@farm.com / admin123")
    console.log("  Customer: customer@farm.com / customer123")

    process.exit(0)
  } catch (error) {
    console.error("Error seeding users:", error)
    process.exit(1)
  }
}

seedUsers()
