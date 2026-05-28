const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const Sentry = require('@sentry/node');
const initSentry = require('./config/sentry');
const morgan = require('morgan');
const { errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// Initialize Sentry as early as possible
initSentry(app);
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

// Security & Utility Middleware
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json({ limit: '10kb' })); // Body parser with size limit
app.use(morgan('combined')); // Structured logging

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    message: { message: 'Too many requests from this IP, please try again later.' }
});
app.use('/api/', limiter);

// Health Check Endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'ok', 
        uptime: process.uptime(),
        timestamp: new Date().toISOString() 
    });
});

// Sentry error handler must be before your global error handler
app.use(Sentry.Handlers.errorHandler());

// Global Error Handler (must be the last middleware)
app.use(errorHandler);

module.exports = app;