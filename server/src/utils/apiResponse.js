/**
 * Single success envelope used by every endpoint: { success: true, data }.
 * Failures are produced by the error middleware, never here.
 */
function sendSuccess(res, data, statusCode = 200) {
  return res.status(statusCode).json({ success: true, data });
}

module.exports = { sendSuccess };
