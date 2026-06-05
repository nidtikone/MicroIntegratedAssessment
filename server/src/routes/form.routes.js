const express = require('express');
const {
  createForm,
  listForms,
  getForm,
  deleteForm,
} = require('../controllers/form.controller');

const router = express.Router();

router.post('/', createForm);
router.get('/', listForms);
router.get('/:publicId', getForm);
router.delete('/:publicId', deleteForm);

module.exports = router;
