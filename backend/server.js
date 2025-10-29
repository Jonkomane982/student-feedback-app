const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { initializeApp } = require("./config/database");
const feedbackRoutes = require("./routes/feedbackRoutes");
const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database and start server
const startServer = async () => {
  try {
    // Initialize database (creates tables and inserts sample data)
    await initializeApp();
    
    // Routes
    app.use("/api/feedback", feedbackRoutes);
    app.use("/api/auth", authRoutes);
    app.use("/api/courses", courseRoutes);
    
    // Basic health check route
    app.get("/api/health", (req, res) => {
      res.json({ 
        status: "OK", 
        message: "Student Feedback API is running",
        timestamp: new Date().toISOString()
      });
    });

    // 404 handler
    app.use("*", (req, res) => {
      res.status(404).json({
        success: false,
        message: "Route not found"
      });
    });

    // Start server
    app.listen(PORT, () => {
      console.log("🚀 Server running on port " + PORT);
      console.log("📚 Student Feedback Application Backend");
      console.log("🔗 Health check: http://localhost:" + PORT + "/api/health");
      console.log("📊 API Routes:");
      console.log("   - GET    http://localhost:" + PORT + "/api/feedback");
      console.log("   - POST   http://localhost:" + PORT + "/api/feedback");
      console.log("   - POST   http://localhost:" + PORT + "/api/auth/login");
      console.log("   - POST   http://localhost:" + PORT + "/api/auth/register");
      console.log("   - GET    http://localhost:" + PORT + "/api/courses");
    });
    
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
