const express = require('express');
const healthRoutes = require('./health.routes');
const formRoutes = require('./form.routes');

const router = express.Router();

// Mounted under /api in app.js
router.use('/health', healthRoutes);
router.use('/forms', formRoutes);

module.exports = router;
