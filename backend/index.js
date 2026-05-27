const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

const routes = require('./routes/routes');

// Middleware
app.use(cors({
  origin: '*', // replace with frontend URL in production
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/', routes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Server running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found'
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});