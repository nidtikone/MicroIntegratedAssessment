const Response = require('../models/Response');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { sendSuccess } = require('../utils/apiResponse');
const { validateResponse } = require('../utils/responseValidator');
const { findFormOr404 } = require('./form.controller');

/**
 * POST /api/forms/:publicId/responses
 * Validate a submission against the Form schema (server is authoritative) and
 * persist the normalized answers. Body shape: { "answers": { "<fieldId>": value } }.
 */
const submitResponse = asyncHandler(async (req, res) => {
  const form = await findFormOr404(req.params.publicId);
  const rawAnswers = (req.body && req.body.answers) || {};

  const { errors, values } = validateResponse(form, rawAnswers);
  if (Object.keys(errors).length > 0) {
    throw new ApiError(422, 'Response validation failed', 'VALIDATION', errors);
  }

  const response = await Response.create({
    form: form._id,
    formPublicId: form.publicId,
    answers: values,
    submittedAt: new Date(),
  });

  sendSuccess(res, response.toJSON(), 201);
});

/**
 * GET /api/forms/:publicId/responses
 * List a form's responses, newest first, for the Response Viewer.
 */
const listResponses = asyncHandler(async (req, res) => {
  const form = await findFormOr404(req.params.publicId);
  const responses = await Response.find({ form: form._id })
    .sort({ submittedAt: -1 })
    .lean();

  const data = responses.map((r) => ({
    id: r._id.toString(),
    answers: r.answers || {},
    submittedAt: r.submittedAt,
  }));

  sendSuccess(res, data);
});

module.exports = { submitResponse, listResponses };
