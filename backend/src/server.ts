import express, { Request, Response } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import router from "./routes/taskRoutes";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(express.json());

// Routes
app.use("/api", router);

// Basic route for testing
app.get("/", (req: Request, res: Response) => {
  res.send("Task Management API");
});

// Error handling middleware
app.use(errorHandler);

const connectDB = async (retries = 5) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const uri = process.env.MONGODB_URI;
      
      if (!uri) {
        throw new Error("MONGODB_URI is not defined in environment variables");
      }

      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
        socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      });

      console.log("✅ Successfully connected to MongoDB");
      return;
    } catch (error: any) {
      console.error(`❌ MongoDB connection attempt ${attempt} failed:`);
      
      if (error.name === 'MongoServerSelectionError') {
        console.error('Cannot reach MongoDB server. Please check:');
        console.error('1. Your network connection');
        console.error('2. MongoDB Atlas status');
        console.error('3. IP whitelist settings in MongoDB Atlas');
      } else if (error.name === 'MongoServerError' && error.code === 18) {
        console.error('Authentication failed. Please check:');
        console.error('1. Your database username');
        console.error('2. Your database password');
        console.error('3. Database user permissions');
      } else {
        console.error('Unexpected error:', error.message);
      }

      if (attempt === retries) {
        console.error('❌ Failed to connect to MongoDB after multiple attempts');
        process.exit(1);
      }

      // Wait before trying again
      const waitTime = Math.min(1000 * attempt, 3000); // Progressive delay, max 3s
      console.log(`Waiting ${waitTime}ms before retrying...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
};

// Graceful shutdown handling
const gracefulShutdown = async () => {
  try {
    await mongoose.connection.close();
    console.log(' MongoDB connection closed through app termination');
    process.exit(0);
  } catch (error) {
    console.error('Error during graceful shutdown:', error);
    process.exit(1);
  }
};

// Handle application shutdown scenarios
process.on('SIGINT', gracefulShutdown); // For Ctrl+C
process.on('SIGTERM', gracefulShutdown); // For Docker container stops
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  gracefulShutdown();
});

// Start server after DB connection
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
  });
});
