const express = require('express');
const { getAnalytics } = require('../controllers/analytics.controller');

// mergeParams so :publicId from the parent /forms/:publicId mount is available.
const router = express.Router({ mergeParams: true });

router.get('/', getAnalytics);

module.exports = router;
