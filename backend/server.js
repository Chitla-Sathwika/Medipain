import "dotenv/config";
import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import testRoutes from "./routes/tests.js";
import medicineRoutes from "./routes/medicines.js";
import ocrRoutes from "./routes/ocr.js";
import aiRoutes from "./routes/ai.js";
import dashboardRoutes from "./routes/dashboard.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/tests", testRoutes);
app.use("/api/medicines", medicineRoutes);
app.use("/api/ocr", ocrRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || "Something went wrong." });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`MediPlain backend running on http://localhost:${PORT}`));
