const fs = require('fs');
const sql = require('mssql');
require('dotenv').config();

async function run() {
  const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    server: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '1433', 10),
    database: process.env.DB_NAME,
    options: { encrypt: false, trustServerCertificate: true }
  };
  const ddl = fs.readFileSync(__dirname + '/ddl.sql', 'utf8');
  try {
    const pool = await sql.connect(config);
    console.log('Connected. Running DDL...');
    const batches = ddl.split(';').map(s => s.trim()).filter(Boolean);
    for (const b of batches) {
      console.log('Executing batch...');
      await pool.request().batch(b + ';');
    }
    console.log('Migrations complete.');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
run();
