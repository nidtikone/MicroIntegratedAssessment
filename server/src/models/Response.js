const mongoose = require('mongoose');

/**
 * One submission against a Form. Answers are stored as a flexible key-value map
 * keyed by the Form's stable field ids (ADR 0001); values are strings, numbers,
 * or arrays of strings depending on the field type. The `form` ref and the
 * denormalized `formPublicId` both point back to the owning Form.
 */
const responseSchema = new mongoose.Schema(
  {
    form: { type: mongoose.Schema.Types.ObjectId, ref: 'Form', required: true, index: true },
    formPublicId: { type: String, required: true, index: true },
    answers: { type: mongoose.Schema.Types.Mixed, default: {} },
    submittedAt: { type: Date, default: Date.now },
  },
  {
    versionKey: false,
    toJSON: {
      transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.form; // internal link, not exposed
        return ret;
      },
    },
  }
);

module.exports = mongoose.model('Response', responseSchema);
