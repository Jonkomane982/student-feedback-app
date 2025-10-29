const { Pool } = require("pg");
require("dotenv").config();

console.log("🔧 Environment Check:");
console.log("DATABASE_URL:", process.env.DATABASE_URL ? "Set" : "Not set");
console.log("DB_HOST:", process.env.DB_HOST ? "Set" : "Not set");
console.log("NODE_ENV:", process.env.NODE_ENV);

// Always use DATABASE_URL if available, otherwise individual variables
let connectionConfig;

if (process.env.DATABASE_URL) {
  connectionConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: { 
      rejectUnauthorized: false 
    }
  };
  console.log("🔗 Using DATABASE_URL for PostgreSQL connection");
} else {
  connectionConfig = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    // Force SSL for Render PostgreSQL even with individual vars
    ssl: { 
      rejectUnauthorized: false 
    }
  };
  console.log("🔗 Using individual DB variables with forced SSL");
}

const pool = new Pool(connectionConfig);

// Test database connection
const testConnection = async () => {
  let client;
  try {
    console.log("🔄 Attempting database connection...");
    client = await pool.connect();
    const result = await client.query("SELECT NOW() as current_time");
    console.log("✅ Database connected successfully at:", result.rows[0].current_time);
    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    console.error("💡 Error code:", error.code);
    return false;
  } finally {
    if (client) client.release();
  }
};

// Rest of your database.js code remains the same...
const initializeDatabase = async () => {
  const client = await pool.connect();
  
  try {
    console.log("🔄 Initializing database schema...");
    await client.query("BEGIN");

    await client.query('DROP TABLE IF EXISTS feedback CASCADE');

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

    await client.query(`
      CREATE INDEX idx_feedback_course_code ON feedback(course_code);
      CREATE INDEX idx_feedback_rating ON feedback(rating);
      CREATE INDEX idx_feedback_submission_date ON feedback(submission_date);
    `);

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