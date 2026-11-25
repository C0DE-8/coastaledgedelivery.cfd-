const path = require("node:path");
require("dotenv").config({
  path: [path.join(__dirname, ".env.local"), path.join(__dirname, ".env")],
});

const { connectProject } = require("./diamond-sql");

const db = connectProject(process.env.SITE_ID, {
  apiKey: process.env.API_KEY,
  dbmsUrl: process.env.DBMS_URL,
  timeoutMs: process.env.DBMS_TIMEOUT_MS,
});

module.exports = db;
