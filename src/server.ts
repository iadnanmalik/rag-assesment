import dotenv from "dotenv";
dotenv.config(); 

import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import documentRoutes from "./routes/documentRoutes";
import logger from "./services/loggerService";

const app = express();
const PORT = process.env.PORT || 8001;



// Middleware
app.use(express.json()); 
app.use(cors()); 
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
  logger.error(`Error: ${err.message}, Stack: ${err.stack}`);
  
  if (err.name === "ValidationError") {
    res.status(400).json({ error: "Bad Request", details: err.message });
  } else {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start server
app.listen(PORT, () => {
console.log(`Server is running on port ${PORT}`);  
});

