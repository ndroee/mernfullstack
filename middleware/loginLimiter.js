const rateLimit = require("express-rate-limit");

const { logEvents } = require("./logger");

const loginLimiter = rateLimit({
  windowMs: 60 * 1000, //1 minute
  max: 5,//max attempts
  message: { message: "too any login attempts from this IP" },
  handler: (req, res, next, options) => {
    logEvents(
      `too many requests: ${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
      "errLog.log"
    );
    res.status(options.statusCode).send(options.message);
  },
  standardHeaders: true, //return rate limit info
  legacyHeaders: false, //disable x-ratelimit
});
module.exports = loginLimiter;
