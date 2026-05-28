const Sentry = require("@sentry/node");
const { nodeProfilingIntegration } = require("@sentry/profiling-node");

const initSentry = () => {
    // Skip if DSN is missing
    if (!process.env.SENTRY_DSN) return;

    Sentry.init({
        dsn: process.env.SENTRY_DSN,
        integrations: [
            nodeProfilingIntegration(),
        ],
        tracesSampleRate: 1.0,
        profilesSampleRate: 1.0,
    });
};

module.exports = initSentry;