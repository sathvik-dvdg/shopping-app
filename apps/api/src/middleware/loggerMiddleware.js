const requestLogger = (req, res, next) => {
    const start = Date.now();
    
    // Intercept response finish event
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`\n[${new Date().toISOString()}]`);
        console.log(`${req.method} ${req.originalUrl}`);
        console.log(`Status: ${res.statusCode}`);
        if (Object.keys(req.body || {}).length) console.log(`Body:`, JSON.stringify(req.body, null, 2));
        if (Object.keys(req.params).length) console.log(`Params:`, req.params);
        if (Object.keys(req.query).length) console.log(`Query:`, req.query);
        console.log(`Execution Time: ${duration}ms`);
    });
    
    next();
};

module.exports = { requestLogger };