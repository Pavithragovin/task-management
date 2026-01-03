/**
 * Vercel-safe Express Server
 * Works locally and in production
 */

const express = require("express");
const cors = require("cors");
require("dotenv").config();

let sequelize;
try {
  // Safely load models (prevents crash if path issue)
  const models = require("./models");
  sequelize = models.sequelize;
} catch (err) {
  console.error("Models load error:", err);
}

const app = express();

/* -------------------- MIDDLEWARE -------------------- */
app.use(cors());
app.use(express.json());

/* -------------------- HEALTH CHECK -------------------- */
app.get("/", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Backend running successfully"
  });
});

/* -------------------- ROUTES -------------------- */
try {
  const authRoutes = require("./routes/auth");
  const taskRoutes = require("./routes/tasks");

  app.use("/api/auth", authRoutes);
  app.use("/api/tasks", taskRoutes);
} catch (err) {
  console.error("Routes load error:", err);
}

/* -------------------- DATABASE -------------------- */
if (sequelize) {
  sequelize
    .authenticate()
    .then(() => {
      console.log("Database connected");
      return sequelize.sync();
    })
    .catch((err) => {
      console.error("Database connection failed:", err);
    });
}

/* -------------------- ERROR HANDLER -------------------- */
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

/* -------------------- EXPORT (NO app.listen) -------------------- */
module.exports = app;
const models = require("./models");
