//index.js
require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 5000;
let server;

const startServer = async () => {
    try {
        await connectDB();
        server = app.listen(PORT, '0.0.0.0', () => {
            console.log(`✅ Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

startServer();

// Graceful Shutdown implementation
const shutdown = (signal) => {
    console.log(`\n${signal} received. Shutting down gracefully...`);
    if (server) {
        server.close(() => {
            console.log('📦 Closed out remaining connections.');
            process.exit(0);
        });
    } else {
        process.exit(0);
    }
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err);
    shutdown('uncaughtException');
});