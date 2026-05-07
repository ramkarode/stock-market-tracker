const winston = require("winston");

const isProd = process.env.NODE_ENV === "production";

// Custom log format for dev (readable)
const devFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: "HH:mm:ss" }),
  winston.format.printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
  })
);

// JSON format for production (structured logging)
const prodFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

const logger = winston.createLogger({
  level: isProd ? "info" : "debug",
  format: isProd ? prodFormat : devFormat,
  defaultMeta: { service: "api-service" },

  transports: [
    // Console (both dev & prod)
    new winston.transports.Console(),

    // File logs (only in production)
    ...(isProd
      ? [
          new winston.transports.File({
            filename: "logs/error.log",
            level: "error",
          }),
          new winston.transports.File({
            filename: "logs/combined.log",
          }),
        ]
      : []),
  ],

  // Prevent crash on logger error
  exitOnError: false,
});

module.exports = logger;