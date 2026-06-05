const express = require('express');
const { submitResponse, listResponses } = require('../controllers/response.controller');

// mergeParams so :publicId from the parent /forms/:publicId mount is available.
const router = express.Router({ mergeParams: true });

router.post('/', submitResponse);
router.get('/', listResponses);

module.exports = router;
