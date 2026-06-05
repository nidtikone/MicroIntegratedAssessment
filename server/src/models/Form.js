const mongoose = require('mongoose');
const { ALL_FIELD_TYPES, TEXT_FORMATS } = require('../utils/fieldTypes');

/**
 * A Field embedded in a Form. `id` is our stable, server-generated identifier
 * (ADR 0001) — Answers are keyed by it — so we disable Mongoose's own _id here.
 */
const fieldSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    label: { type: String, required: true, trim: true },
    type: { type: String, required: true, enum: ALL_FIELD_TYPES },
    required: { type: Boolean, default: false },
    // select / multiselect only
    options: { type: [String], default: undefined },
    // number only
    min: { type: Number, default: undefined },
    max: { type: Number, default: undefined },
    // text only
    format: { type: String, enum: TEXT_FORMATS, default: undefined },
  },
  { _id: false }
);

const formSchema = new mongoose.Schema(
  {
    publicId: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    fields: { type: [fieldSchema], required: true },
  },
  {
    timestamps: true,
    id: false, // disable Mongoose's _id-backed `id` virtual; our fields have their own `id`
    toJSON: {
      versionKey: false,
      transform: (_doc, ret) => {
        delete ret._id; // never expose the Mongo _id (ADR 0002: publicId is the only external id)
        return ret;
      },
    },
  }
);

module.exports = mongoose.model('Form', formSchema);
