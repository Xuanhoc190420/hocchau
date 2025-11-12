import express from "express"
import Product from "../models/Product.js"

const router = express.Router()

// GET all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 })
    res.json(products)
  } catch (error) {
    console.error("Error fetching products:", error)
    res.status(500).json({ error: "Failed to fetch products" })
  }
})

// GET single product
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) {
      return res.status(404).json({ error: "Product not found" })
    }
    res.json(product)
  } catch (error) {
    console.error("Error fetching product:", error)
    res.status(500).json({ error: "Failed to fetch product" })
  }
})

// POST create product
router.post("/", async (req, res) => {
  try {
    const { name, category, price, description, imageUrl, inStock, quantity, rating } = req.body

    if (!name || !price || !description) {
      return res.status(400).json({ error: "Tên, giá và mô tả là bắt buộc" })
    }

    const product = new Product({
      name,
      category: category || "khac",
      price,
      description,
      imageUrl: imageUrl || "",
      inStock: inStock !== undefined ? inStock : true,
      quantity: quantity || 0,
      rating: rating || 5,
    })

    await product.save()
    res.status(201).json(product)
  } catch (error) {
    console.error("Error creating product:", error)
    res.status(500).json({ error: "Failed to create product" })
  }
})

// PUT update product
router.put("/:id", async (req, res) => {
  try {
    const { name, category, price, description, imageUrl, inStock, quantity, rating } = req.body

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        category,
        price,
        description,
        imageUrl,
        inStock,
        quantity,
        rating,
        updatedAt: Date.now(),
      },
      { new: true, runValidators: true },
    )

    if (!product) {
      return res.status(404).json({ error: "Product not found" })
    }

    res.json(product)
  } catch (error) {
    console.error("Error updating product:", error)
    res.status(500).json({ error: "Failed to update product" })
  }
})

// DELETE product
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)
    if (!product) {
      return res.status(404).json({ error: "Product not found" })
    }
    res.json({ message: "Product deleted successfully", product })
  } catch (error) {
    console.error("Error deleting product:", error)
    res.status(500).json({ error: "Failed to delete product" })
  }
})

export default router
