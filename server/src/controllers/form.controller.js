const Form = require('../models/Form');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { sendSuccess } = require('../utils/apiResponse');
const { validateFormSchema } = require('../utils/formSchemaValidator');
const { normalizeForm } = require('../utils/normalizeForm');

/** Load a form by publicId or throw 404. */
async function findFormOr404(publicId) {
  const form = await Form.findOne({ publicId });
  if (!form) throw new ApiError(404, 'Form not found', 'NOT_FOUND');
  return form;
}

/** POST /api/forms — create a form from a Builder payload. */
const createForm = asyncHandler(async (req, res) => {
  const errors = validateFormSchema(req.body);
  if (Object.keys(errors).length > 0) {
    throw new ApiError(422, 'Form schema is invalid', 'VALIDATION', errors);
  }

  const form = await Form.create(normalizeForm(req.body));
  sendSuccess(res, form.toJSON(), 201);
});

/** GET /api/forms — list forms as lightweight summaries for the admin dashboard. */
const listForms = asyncHandler(async (req, res) => {
  const forms = await Form.find().sort({ createdAt: -1 }).lean();
  const summaries = forms.map((f) => ({
    publicId: f.publicId,
    title: f.title,
    description: f.description,
    fieldCount: f.fields.length,
    createdAt: f.createdAt,
    updatedAt: f.updatedAt,
  }));
  sendSuccess(res, summaries);
});

/** GET /api/forms/:publicId — full schema for the Renderer and admin views. */
const getForm = asyncHandler(async (req, res) => {
  const form = await findFormOr404(req.params.publicId);
  sendSuccess(res, form.toJSON());
});

/** DELETE /api/forms/:publicId — remove a form. (Response cascade added in Phase 2.) */
const deleteForm = asyncHandler(async (req, res) => {
  const form = await findFormOr404(req.params.publicId);
  await form.deleteOne();
  sendSuccess(res, { publicId: form.publicId, deleted: true });
});

module.exports = {
  createForm,
  listForms,
  getForm,
  deleteForm,
  findFormOr404,
};
