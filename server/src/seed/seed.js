/**
 * Idempotent database seeder.
 *   npm run seed
 * Wipes the Forms and Responses collections, then inserts the 4 canonical forms
 * and their designed responses. Each response is run through the same
 * server-authoritative validator the API uses, so the seed can never produce
 * data the API would have rejected (and bad seed data fails loudly).
 */
require('dotenv').config();

const mongoose = require('mongoose');
const { connectDB } = require('../config/db');
const Form = require('../models/Form');
const Response = require('../models/Response');
const { validateFormSchema } = require('../utils/formSchemaValidator');
const { normalizeForm } = require('../utils/normalizeForm');
const { validateResponse } = require('../utils/responseValidator');
const seedData = require('./seedData');

async function seed() {
  await connectDB();

  console.log('[seed] clearing Forms and Responses...');
  await Promise.all([Form.deleteMany({}), Response.deleteMany({})]);

  let totalResponses = 0;

  for (const { form: formDef, responses } of seedData) {
    const schemaErrors = validateFormSchema(formDef);
    if (Object.keys(schemaErrors).length) {
      throw new Error(`Seed form "${formDef.title}" is invalid: ${JSON.stringify(schemaErrors)}`);
    }

    const form = await Form.create(normalizeForm(formDef));
    const idByLabel = Object.fromEntries(form.fields.map((f) => [f.label, f.id]));

    const docs = responses.map((labelled) => {
      // Translate { "<label>": value } into { "<fieldId>": value }.
      const rawAnswers = {};
      for (const [label, value] of Object.entries(labelled)) {
        const fieldId = idByLabel[label];
        if (!fieldId) throw new Error(`Seed "${formDef.title}": unknown field label "${label}"`);
        rawAnswers[fieldId] = value;
      }

      const { errors, values } = validateResponse(form, rawAnswers);
      if (Object.keys(errors).length) {
        throw new Error(`Seed "${formDef.title}" response invalid: ${JSON.stringify(errors)}`);
      }
      return { form: form._id, formPublicId: form.publicId, answers: values, submittedAt: new Date() };
    });

    await Response.insertMany(docs);
    totalResponses += docs.length;
    console.log(`[seed] ${form.title.padEnd(28)} ${form.publicId}  (${docs.length} responses)`);
  }

  console.log(`[seed] done: ${seedData.length} forms, ${totalResponses} responses.`);
}

seed()
  .then(async () => {
    await mongoose.connection.close();
    process.exit(0);
  })
  .catch(async (err) => {
    console.error('[seed] failed:', err.message);
    await mongoose.connection.close().catch(() => {});
    process.exit(1);
  });
