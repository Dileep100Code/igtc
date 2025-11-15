const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/auth');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rate limiting (simplified)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { message: 'Too many requests, please try again later.' }
});
app.use('/api/auth', limiter);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'IGTC Auth Server Running' });
});

// Request logging to Discord
app.use('/api/auth', async (req, res, next) => {
  const { logActivity } = require('./utils/logger');
  await logActivity('info', `API Request: ${req.method} ${req.path}`, {
    method: req.method,
    path: req.path,
    body: req.body,
    timestamp: new Date().toISOString()
  });
  next();
});

// Routes
app.use('/api/auth', authRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    console.log('Make sure MongoDB is running on localhost:27017');
  });

// Handle MongoDB connection errors
mongoose.connection.on('error', (err) => {
  console.error('MongoDB error:', err);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  // Server started - no console log
});