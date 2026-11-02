const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const itemRoutes = require('./routes/itemRoutes');

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB Database (only if MONGO_URI is set)
if (process.env.MONGO_URI && !process.env.MONGO_URI.includes('<username>')) {
  connectDB();
} else {
  console.log('[Notice] MONGO_URI contains placeholder credentials or is unset. DB connection paused.');
}

const app = express();

// Core Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger for development
if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl}`);
    next();
  });
}

// Welcome / Health-check route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the Backend Tutorial CRUD API (Node.js, Express & MongoDB Atlas)',
    version: '1.0.0',
    status: 'Server is running',
    endpoints: {
      getAllItems: 'GET /api/items',
      createItem: 'POST /api/items',
      getItemById: 'GET /api/items/:id',
      updateItem: 'PUT /api/items/:id',
      deleteItem: 'DELETE /api/items/:id'
    }
  });
});

// Mount Item Routes
app.use('/api/items', itemRoutes);

// 404 Handler for undefined routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Resource not found - ${req.method} ${req.originalUrl}`
  });
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;

let server = null;
if (require.main === module) {
  server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`========================================`);
    console.log(` Server is running on port ${PORT}`);
    console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(` Health Check: http://localhost:${PORT}/`);
    console.log(` Items API:    http://localhost:${PORT}/api/items`);
    console.log(`========================================`);
  });
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection Error: ${err.message}`);
});

module.exports = { app, server };
