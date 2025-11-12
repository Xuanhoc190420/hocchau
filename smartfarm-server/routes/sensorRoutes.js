// sensorRoutes.js
import express from "express";
import SensorLog from "../models/SensorLog.js";
const router = express.Router();

router.get("/history", async (req,res)=>{
  const limit = parseInt(req.query.limit || "50", 10);
  const docs = await SensorLog.find().sort({ createdAt:-1 }).limit(limit);
  res.json(docs);
});

export default router;
