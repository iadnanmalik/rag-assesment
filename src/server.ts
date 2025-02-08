import dotenv from "dotenv";
dotenv.config(); 

import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import documentRoutes from "./routes/documentRoutes";
import winston from "winston"; // Winston logger for structured logging
import logger from "./services/loggerService";

const app = express();
const PORT = process.env.PORT || 8001;



// Middleware
app.use(express.json()); // Parses incoming JSON requests
app.use(cors()); // Enables Cross-Origin Resource Sharing
app.use(helmet()); // Enhances API security
app.use(morgan("dev")); // Logs HTTP requests

// Routes
app.use("/api", documentRoutes);

// 404 handling middleware (Catch-all route)
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Not Found" });
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // Log detailed error with metadata
  logger.error(`Error: ${err.message}, Stack: ${err.stack}`);
  
  // Handle different error types (if necessary, customize based on your app)
  if (err.name === "ValidationError") {
    res.status(400).json({ error: "Bad Request", details: err.message });
  } else {
    // Generic 500 error for unhandled cases
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start server
app.listen(PORT, () => {
console.log(`Server is running on port ${PORT}`);  
});

