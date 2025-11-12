import express from "express";
import Contact from "../models/Contact.js";

const router = express.Router();

// Create contact message
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ ok: false, error: "Missing required fields" });
    }

    const contact = new Contact({
      name,
      email,
      phone,
      subject,
      message,
    });

    await contact.save();
    res.json({ ok: true, message: "Contact message sent successfully" });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Get all contacts (admin)
router.get("/", async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({ ok: true, data: contacts });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

export default router;
