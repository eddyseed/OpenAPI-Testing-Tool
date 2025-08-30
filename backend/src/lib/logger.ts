import winston from "winston";

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6,
};

const developmentFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.colorize({ all: true }), // Colorizes the whole output
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

const logger = winston.createLogger({
  level: "http", // Default log level
  levels,
  format: developmentFormat,
  transports: [
    // Write all logs to the console
    new winston.transports.Console(),
    // Optionally, also write all logs to a file
    new winston.transports.File({ filename: "logs/app.log" }),
  ],
});
export default logger;
