const ApiError = require('../utils/ApiError');

/** 404 handler for unmatched routes. Forwards a NOT_FOUND ApiError. */
function notFound(req, res, next) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`, 'NOT_FOUND'));
}

/**
 * Central error middleware. The ONLY place that shapes the failure envelope:
 *   { success: false, error: { message, code, fields? } }
 * Unknown/non-operational errors are masked as 500 and logged.
 */
// eslint-disable-next-line no-unused-vars -- Express needs the 4-arg signature
function errorHandler(err, req, res, next) {
  // Translate well-known mongoose errors into operational ApiErrors.
  if (err.name === 'CastError') {
    err = new ApiError(400, `Invalid value for "${err.path}"`, 'BAD_REQUEST');
  }

  const isOperational = err instanceof ApiError;
  const statusCode = isOperational ? err.statusCode : 500;

  if (!isOperational) {
    console.error('[error]', err);
  }

  const error = {
    message: isOperational ? err.message : 'Internal server error',
    code: isOperational ? err.code : 'INTERNAL',
  };
  if (err.fields) error.fields = err.fields;

  res.status(statusCode).json({ success: false, error });
}

module.exports = { notFound, errorHandler };
