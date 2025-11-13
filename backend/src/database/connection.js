import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Construct DATABASE_URL from individual components if provided
let connectionString = process.env.DATABASE_URL;

if (process.env.DB_USER && process.env.DB_PASSWORD) {
  const dbHost = process.env.DB_HOST || 'localhost';
  const dbPort = process.env.DB_PORT || '5432';
  const dbName = process.env.DB_NAME || 'ai_learning_db';
  
  connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${dbHost}:${dbPort}/${dbName}`;
}

const pool = new Pool({
  connectionString: connectionString,
});

export default pool;
