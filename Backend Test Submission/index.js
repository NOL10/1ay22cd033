require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const db = require('./storage/db');
const Log = require('./middleware/logger');
const shortUrlRoutes = require('./routes/shorturl');

const app = express();
app.use(bodyParser.json());
app.use('/', shortUrlRoutes);

app.get('/:code', async (req, res) => {
  const code = req.params.code;
  const data = db.get(code);

  if (!data) {
    await Log('backend', 'error', 'route', `Shortcode not found: ${code}`);
    return res.status(404).json({ error: 'Short URL not found' });
  }

  const now = new Date();
  if (new Date(data.expiry) < now) {
    await Log('backend', 'warn', 'route', `Shortcode expired: ${code}`);
    return res.status(410).json({ error: 'Short URL expired' });
  }

  data.clicks += 1;
  await Log('backend', 'info', 'route', `Redirecting to ${data.url}`);
  return res.redirect(data.url);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
