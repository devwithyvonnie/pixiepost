const rateLimit = require('express-rate-limit');

const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,                  // limit each IP to 100 requests per windowMs
  standardHeaders: true,     // return rate limit info in headers
  legacyHeaders: false,      // disable legacy X-RateLimit-* headers
  message: 'Too many requests from this IP, please try again later.'
});

module.exports = apiRateLimiter;
