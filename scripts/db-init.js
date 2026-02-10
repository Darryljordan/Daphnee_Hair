/* eslint-disable @typescript-eslint/no-require-imports */
const { Pool } = require("pg");
const path = require("path");
const fs = require("fs");

// Load .env.local if it exists
const envPath = path.join(__dirname, "..", ".env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const [key, ...rest] = trimmed.split("=");
      process.env[key.trim()] = rest.join("=").trim();
    }
  }
}

const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: parseInt(process.env.PGPORT || "5432", 10),
  ssl: {
    rejectUnauthorized: false,
  },
});

const statements = [
  `CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    service VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    time VARCHAR(20) NOT NULL,
    state VARCHAR(20) DEFAULT 'valid',
    cancel_token VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS workers (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    reset_token VARCHAR(255),
    reset_token_expires TIMESTAMP WITH TIME ZONE,
    is_validated BOOLEAN DEFAULT FALSE,
    validation_token VARCHAR(255)
  )`,
];

async function runMigrations() {
  try {
    for (const stmt of statements) {
      await pool.query(stmt);
      const tableName = stmt.match(/CREATE TABLE IF NOT EXISTS (\w+)/)?.[1];
      console.log(`✓ Table "${tableName}" created (if not exists)`);
    }
    console.log("\n✓ Database initialization complete!");
  } catch (err) {
    console.error("Error creating tables:", err);
  } finally {
    await pool.end();
  }
}

runMigrations();
