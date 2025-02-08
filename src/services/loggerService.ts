import winston from "winston";

// Set up a logger instance
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),  // Logs to the console
    new winston.transports.File({ filename: "logs/server.log" }),  // Logs to a file
  ],
});

export default logger;
