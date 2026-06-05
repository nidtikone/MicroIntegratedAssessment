const express = require('express');
const {
  createForm,
  listForms,
  getForm,
  deleteForm,
} = require('../controllers/form.controller');
const responseRoutes = require('./response.routes');

const router = express.Router();

router.post('/', createForm);
router.get('/', listForms);
router.get('/:publicId', getForm);
router.delete('/:publicId', deleteForm);

// Nested: /api/forms/:publicId/responses
router.use('/:publicId/responses', responseRoutes);

module.exports = router;
