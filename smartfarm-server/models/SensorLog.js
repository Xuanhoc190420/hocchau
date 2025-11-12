// SensorLog.js
import mongoose from "mongoose";
const sensorLog = new mongoose.Schema({
  data: { type: Object },
  createdAt: { type: Date, default: Date.now }
});
export default mongoose.model("SensorLog", sensorLog);
