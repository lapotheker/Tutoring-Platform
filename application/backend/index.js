const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;

// Import routes
const tutorRoutes = require("./routes/tutorRoutes");
const dataRoutes = require("./routes/dataRoutes");
const messageRoutes = require("./routes/messageRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");

// Middleware
app.use(cors()); // Enable CORS for frontend communication
app.use(express.json());

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

// API routes
app.use("/api/tutors", tutorRoutes);
app.use("/api/data", dataRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

// 404 handler
app.use((_req, res) => res.status(404).json({ error: "Not found" }));

app.listen(PORT, () => {
  console.log(`API listening on ${PORT}`);
});
