const express = require('express');
const healthRoutes = require('./health.routes');

const router = express.Router();

// Mounted under /api in app.js
router.use('/health', healthRoutes);

module.exports = router;
