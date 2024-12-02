import { ErrorRequestHandler } from "express";
import { AppError } from "../utils/errors";

export const errorHandler: ErrorRequestHandler = (err, req, res, next): any => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
      error: err.error,
    });
  }

  // For generic errors
  return res.status(500).json({
    status: "error",
    message: err.message || "Internal Server Error",
  });
};
