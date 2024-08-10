const express = require('express');
const cors = require('cors'); // Import CORS
const connectDB = require('./config/db');
const inventoryRoutes = require('./routes/inventoryRoutes');
const billRoutes = require('./routes/billRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors()); // Use CORS middleware

// Connect Database
connectDB();

// Routes
app.use('/api', inventoryRoutes);
app.use('/api', billRoutes);

module.exports = app;
