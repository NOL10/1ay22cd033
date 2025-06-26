const express = require('express');
const router = express.Router();
const { nanoid } = require('nanoid');
const dayjs = require('dayjs');

const db = require('../storage/db');
const isValidUrl = require('../utils/validateUrl');
const Log = require('../middleware/logger');

router.post('/shorturls', async (req, res) => {
  const { url, validity = 30, shortcode } = req.body;

  if (!url || !isValidUrl(url)) {
    await Log('backend', 'error', 'controller', 'Invalid URL');
    return res.status(400).json({ error: 'Invalid URL' });
  }

  const code = shortcode || nanoid(6);
  if (db.has(code)) {
    await Log('backend', 'error', 'controller', 'Shortcode already exists');
    return res.status(409).json({ error: 'Shortcode already exists' });
  }

  const expiry = dayjs().add(validity, 'minute').toISOString();
  db.set(code, {
    url,
    createdAt: new Date().toISOString(),
    expiry,
    clicks: 0,
  });

  await Log('backend', 'info', 'controller', `Shortlink created: ${code}`);
  res.status(201).json({
    shortLink: `http://localhost:3000/${code}`,
    expiry
  });
});

router.get('/shorturls/:code', async (req, res) => {
  const code = req.params.code;
  const data = db.get(code);

  if (!data) {
    await Log('backend', 'error', 'repository', 'Shortcode not found');
    return res.status(404).json({ error: 'Shortcode not found' });
  }

  await Log('backend', 'info', 'repository', `Stats retrieved for ${code}`);
  res.json({
    shortcode: code,
    url: data.url,
    clicks: data.clicks,
    createdAt: data.createdAt,
    expiry: data.expiry,
  });
});

module.exports = router;
