const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = 3000;

const JIRA_DOMAIN = process.env.JIRA_DOMAIN;
const JIRA_EMAIL = process.env.JIRA_EMAIL;
const JIRA_TOKEN = process.env.JIRA_TOKEN;

const authHeader = 'Basic ' + Buffer.from(`${JIRA_EMAIL}:${JIRA_TOKEN}`).toString('base64');

app.use(express.static('public'));

app.get('/.netlify/functions/jira', async (req, res) => {
  const jql = 'project=SUP ORDER BY status ASC';
  const url = `https://${JIRA_DOMAIN}/rest/api/3/search?jql=${encodeURIComponent(jql)}`;
  try {
    const jiraRes = await fetch(url, {
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/json'
      }
    });
    const data = await jiraRes.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: 'JIRA fetch failed', details: e.message });
  }
});

app.get('/.netlify/functions/board', async (req, res) => {
  const { JIRA_DOMAIN, JIRA_EMAIL, JIRA_TOKEN, BOARD_ID } = process.env;
  const authHeader = 'Basic ' + Buffer.from(`${JIRA_EMAIL}:${JIRA_TOKEN}`).toString('base64');

  try {
    // Fetch board info
    const boardRes = await fetch(`https://${JIRA_DOMAIN}/rest/agile/1.0/board/${BOARD_ID}`, {
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/json'
      }
    });
    const board = await boardRes.json();

    // Fetch board column config
    const configRes = await fetch(`https://${JIRA_DOMAIN}/rest/agile/1.0/board/${BOARD_ID}/configuration`, {
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/json'
      }
    });
    const config = await configRes.json();

    // Log responses to debug
    console.log('Board response:', board);
    console.log('Column config response:', config);

    const columns = config.columnConfig.columns.map(col => ({
      name: col.name,
      statusNames: col.statuses.map(status => status.name)
    }));

    res.json({
      name: board.name,
      projectKey: board.location.projectKey,
      boardId: board.id,
      columns
    });
  } catch (err) {
    console.error('Error in board config route:', err);
    res.status(500).json({ error: 'Failed to fetch board config', details: err.message });
  }
});



app.listen(PORT, () => {
  console.log(`Local dev server: http://localhost:${PORT}`);
});
