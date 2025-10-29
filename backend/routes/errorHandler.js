// Error handling middleware
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  console.error(err);

  // PostgreSQL error
  if (err.code) {
    switch (err.code) {
      case '23505': // unique violation
        error.message = 'Duplicate field value entered';
        error.statusCode = 400;
        break;
      case '23503': // foreign key violation
        error.message = 'Resource not found';
        error.statusCode = 404;
        break;
      case '23502': // not null violation
        error.message = 'Required field missing';
        error.statusCode = 400;
        break;
      default:
        error.message = 'Database error';
        error.statusCode = 500;
    }
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error.message = 'Invalid token';
    error.statusCode = 401;
  }

  if (err.name === 'TokenExpiredError') {
    error.message = 'Token expired';
    error.statusCode = 401;
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;