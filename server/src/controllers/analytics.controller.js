const Response = require('../models/Response');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');
const { computeAnalytics } = require('../utils/computeAnalytics');
const { findFormOr404 } = require('./form.controller');

/**
 * GET /api/forms/:publicId/analytics
 * Compute analytics on demand from the form schema and its current responses.
 */
const getAnalytics = asyncHandler(async (req, res) => {
  const form = await findFormOr404(req.params.publicId);
  const responses = await Response.find({ form: form._id }).lean();

  const analytics = computeAnalytics(form.toJSON(), responses);
  sendSuccess(res, {
    formPublicId: form.publicId,
    title: form.title,
    ...analytics,
  });
});

module.exports = { getAnalytics };
