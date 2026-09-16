require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

app.get('/api/top-exports', async (req, res) => {
    try {
        const requestedYear = req.query.year || 2025; 
        const requestedRegion = req.query.region || 'Canada';
        
        const query = `
            SELECT product_category, SUM(trade_value_cad) as total_value
            FROM canada_us_trade
            WHERE region = $2 
              AND trade_type ILIKE '%xport%'
              AND EXTRACT(YEAR FROM date) = $1
              AND product_category NOT ILIKE '%Total%'
            GROUP BY product_category
            ORDER BY total_value DESC;
        `;
        
        const result = await pool.query(query, [requestedYear, requestedRegion]);
        res.json(result.rows);
    } catch (error) {
        console.error("Database Error:", error);
        res.status(500).json({ error: 'Database query failed' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Backend Server running on http://localhost:${PORT} (No Limits)`);
});