const axios = require('axios');
require('dotenv').config();

const accessToken = process.env.ACCESS_TOKEN;

const allowedPackages = [
  "cache", "controller", "cron_job", "db", "domain",
  "handler", "repository", "route", "service"
];

const allowedLevels = ["debug", "info", "warn", "error", "fatal"];

async function Log(stack, level, pkg, message) {
  if (stack !== 'backend') {
    console.error("❌ Invalid stack: must be 'backend'");
    return;
  }

  if (!allowedLevels.includes(level)) {
    console.error(`❌ Invalid level: ${level}`);
    return;
  }

  if (!allowedPackages.includes(pkg)) {
    console.error(`❌ Invalid package: ${pkg}`);
    return;
  }

  const payload = {
    stack,
    level,
    package: pkg,
    message
  };

  try {
    const res = await axios.post(
      'http://20.244.56.144/evaluation-service/logs',
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );

    console.log("✅ Log created:", res.data.logID);
  } catch (err) {
    console.error("❌ Error while logging:", err.response?.data || err.message);
  }
}

module.exports = Log;
