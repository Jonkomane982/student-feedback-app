const { Pool } = require("pg");
require("dotenv").config();

// Database connection configuration with SSL for production
const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || "student_feedback_app",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "",
  // Force SSL in production - this is the key fix!
  ssl: process.env.NODE_ENV === 'production' ? { 
    rejectUnauthorized: false 
  } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

// Test database connection
const testConnection = async () => {
  let client;
  try {
    client = await pool.connect();
    const result = await client.query("SELECT NOW() as current_time");
    console.log("✅ Database connected successfully at:", result.rows[0].current_time);
    console.log("🔒 SSL Connection: Enabled");
    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    console.error("💡 SSL Status:", process.env.NODE_ENV === 'production' ? "Required" : "Optional");
    return false;
  } finally {
    if (client) client.release();
  }
};

// Simple schema creation
const initializeDatabase = async () => {
  const client = await pool.connect();
  
  try {
    console.log("🔄 Initializing database schema...");
    await client.query("BEGIN");

    // Drop existing feedback table if it exists
    await client.query('DROP TABLE IF EXISTS feedback CASCADE');

    // Create feedback table
    await client.query(`
      CREATE TABLE feedback (
        feedback_id SERIAL PRIMARY KEY,
        student_name VARCHAR(100) NOT NULL,
        course_code VARCHAR(20) NOT NULL,
        comments TEXT NOT NULL,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create indexes
    await client.query(`
      CREATE INDEX idx_feedback_course_code ON feedback(course_code);
      CREATE INDEX idx_feedback_rating ON feedback(rating);
      CREATE INDEX idx_feedback_submission_date ON feedback(submission_date);
    `);

    // Insert sample data only in development
    if (process.env.NODE_ENV !== 'production') {
      console.log("📊 Inserting sample data...");
      await client.query(`
        INSERT INTO feedback (student_name, course_code, comments, rating) VALUES
        ('Jonkomane Lesoetsa', 'BIWA2110', 'Excellent course with practical examples!', 5),
        ('Kaemane Makhetha', 'BIWA2110', 'Very informative and well structured.', 4),
        ('Alotsi Boiketlo', 'COMP101', 'Good introduction to programming.', 4),
        ('Lejone Kopano', 'DBMS202', 'Database concepts were explained clearly.', 5);
      `);
    }

    await client.query("COMMIT");
    console.log("✅ Database initialized successfully!");
    console.log("📋 Table created: feedback");

  } catch (error) {
    await client.query("ROLLBACK");
    console.error("❌ Database initialization failed:", error.message);
    throw error;
  } finally {
    client.release();
  }
};

// Initialize database on startup
const initializeApp = async () => {
  const isConnected = await testConnection();
  if (isConnected) {
    await initializeDatabase();
  }
};

module.exports = {
  pool,
  initializeDatabase,
  testConnection,
  initializeApp
};