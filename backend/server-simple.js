const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test route without database
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "OK", 
    message: "Server is running (without database)",
    timestamp: new Date().toISOString()
  });
});

app.get("/api/test", (req, res) => {
  res.json({ 
    message: "Test endpoint working!",
    data: ["item1", "item2", "item3"]
  });
});

// Start server
app.listen(PORT, () => {
  console.log("🚀 Server running on port " + PORT);
  console.log("🔗 Health check: http://localhost:" + PORT + "/api/health");
  console.log("🔗 Test endpoint: http://localhost:" + PORT + "/api/test");
});
