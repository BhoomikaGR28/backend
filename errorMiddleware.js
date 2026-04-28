// =============================================
// middleware/errorMiddleware.js - Error Helper
// =============================================
// A custom error class that lets us throw errors
// with HTTP status codes from anywhere in the app.
//
// Usage in a controller:
//   throw new AppError("Meeting not found", 404);

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);          // Pass message to the base Error class
    this.statusCode = statusCode;
    this.isOperational = true; // Marks this as a known/expected error

    // Capture the stack trace (useful for debugging)
    Error.captureStackTrace(this, this.constructor);
  }
}

// Async wrapper - catches errors in async route handlers
// so we don't need try/catch in every controller
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = { AppError, asyncHandler };
