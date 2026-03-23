require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Build connection string for Azure PostgreSQL with AAD
const buildConnectionString = () => {
  const host = process.env.DB_HOST;
  const port = process.env.DB_PORT || 5432;
  const database = process.env.DB_NAME || 'postgres';
  const user = process.env.DB_USER;
  const password = process.env.DB_PASSWORD;
  
  // If using Azure AD, the password might be an access token
  // For regular connection, use password directly
  return {
    host,
    port: parseInt(port),
    database,
    user,
    password,
    ssl: {
      rejectUnauthorized: false
    },
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  };
};

// PostgreSQL connection pool
const pool = new Pool(buildConnectionString());

// Test database connection
pool.query('SELECT NOW()')
  .then(() => console.log('Connected to PostgreSQL database'))
  .catch((err) => console.error('Database connection error:', err.message));

// Create messages table if it doesn't exist
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

pool.query(createTableQuery)
  .then(() => console.log('Messages table ready'))
  .catch((err) => console.error('Error creating table:', err.message));

// GET /messages - Return all messages
app.get('/messages', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, message, created_at FROM messages ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// POST /messages - Store a message
app.post('/messages', async (req, res) => {
  const { name, message } = req.body;

  if (!name || !message) {
    return res.status(400).json({ error: 'Name and message are required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO messages (name, message) VALUES ($1, $2) RETURNING id, name, message, created_at',
      [name, message]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error inserting message:', err);
    res.status(500).json({ error: 'Failed to save message' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
