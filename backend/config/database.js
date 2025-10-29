const { Pool } = require("pg");
require("dotenv").config();

// Database connection configuration
const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || "student_feedback_app",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "",
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test database connection
const testConnection = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT NOW() as current_time");
    console.log("✅ Database connected successfully at:", result.rows[0].current_time);
    client.release();
    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    return false;
  }
};

// Simple schema creation - exactly matching lab requirements
const initializeDatabase = async () => {
  const client = await pool.connect();
  
  try {
    console.log("🔄 Initializing database schema...");

    // Begin transaction
    await client.query("BEGIN");

    // Drop existing feedback table if it exists (to avoid column conflicts)
    await client.query('DROP TABLE IF EXISTS feedback CASCADE');

    // Create simple feedback table (exactly as required in lab)
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

    // Create indexes for better performance
    await client.query(`
      CREATE INDEX idx_feedback_course_code ON feedback(course_code);
      CREATE INDEX idx_feedback_rating ON feedback(rating);
      CREATE INDEX idx_feedback_submission_date ON feedback(submission_date);
    `);

    // Insert sample data
    console.log("📊 Inserting sample data...");

    await client.query(`
      INSERT INTO feedback (student_name, course_code, comments, rating) VALUES
      ('Jonkomane Lesoetsa', 'BIWA2110', 'Excellent course with practical examples!', 5),
      ('Kopano Lejone', 'BIWA2110', 'Very informative and well structured.', 4),
      ('Boiketlo Alotsi', 'COMP101', 'Good introduction to programming.', 4),
      ('Kaemane Makhetha', 'DBMS202', 'Database concepts were explained clearly.', 5);
    `);

    // Commit transaction
    await client.query("COMMIT");
    
    console.log("✅ Database initialized successfully!");
    console.log("📋 Table created: feedback");
    console.log("📊 Sample data inserted successfully!");

  } catch (error) {
    await client.query("ROLLBACK");
    console.error("❌ Database initialization failed:", error);
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