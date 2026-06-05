const express = require('express');
const cors = require('cors');

const apiRoutes = require('./routes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

// --- Core middleware ---------------------------------------------------------
const origins = (process.env.CLIENT_ORIGINS || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: origins.length ? origins : true, // allow all in dev if unset
  })
);
app.use(express.json());

// --- Routes ------------------------------------------------------------------
app.use('/api', apiRoutes);

// --- Error handling (must be last) ------------------------------------------
app.use(notFound);
app.use(errorHandler);

module.exports = app;
