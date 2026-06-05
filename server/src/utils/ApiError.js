/**
 * Operational error carrying everything the error middleware needs to render
 * the failure envelope. Controllers and utils throw this; routes never format
 * errors inline.
 *
 *   throw new ApiError(404, 'Form not found', 'NOT_FOUND');
 *   throw new ApiError(422, 'Validation failed', 'VALIDATION', { email: 'Required' });
 */
class ApiError extends Error {
  /**
   * @param {number} statusCode HTTP status code
   * @param {string} message    Human-readable message
   * @param {string} [code]     Stable machine code (e.g. NOT_FOUND, VALIDATION)
   * @param {Object<string,string>} [fields] Per-field messages keyed by field id
   */
  constructor(statusCode, message, code = 'ERROR', fields = undefined) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    if (fields) this.fields = fields;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;
