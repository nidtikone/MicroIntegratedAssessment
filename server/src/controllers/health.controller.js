const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');
const { isDBConnected } = require('../config/db');

/** GET /api/health — liveness + DB connectivity probe. */
const getHealth = asyncHandler(async (req, res) => {
  sendSuccess(res, {
    status: 'ok',
    db: isDBConnected() ? 'connected' : 'disconnected',
    uptime: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

module.exports = { getHealth };
