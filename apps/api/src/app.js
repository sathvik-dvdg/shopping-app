const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const Sentry = require('@sentry/node');
const initSentry = require('./config/sentry');
const { errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// Initialize Sentry before requiring any other routes
initSentry();

// Security & Utility Middleware
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Import Routes
const routes = require('./routes/routes');
app.use('/api', routes);

// Health Check Endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Sentry error handler must be registered BEFORE your global error handler
if (process.env.SENTRY_DSN) {
    Sentry.setupExpressErrorHandler(app);
}

// Global Error Handler (must be the last middleware)
app.use(errorHandler);

module.exports = app;