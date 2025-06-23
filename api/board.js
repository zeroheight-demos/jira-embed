const fetch = require('node-fetch');

const JIRA_DOMAIN = process.env.JIRA_DOMAIN;
const JIRA_EMAIL = process.env.JIRA_EMAIL;
const JIRA_TOKEN = process.env.JIRA_TOKEN;
const BOARD_ID = process.env.BOARD_ID;

exports.handler = async function () {
  const authHeader = 'Basic ' + Buffer.from(`${JIRA_EMAIL}:${JIRA_TOKEN}`).toString('base64');

  try {
    // Step 1: Fetch board config
    const boardRes = await fetch(`https://${JIRA_DOMAIN}/rest/agile/1.0/board/${BOARD_ID}/configuration`, {
      headers: {
        Authorization: authHeader,
        Accept: 'application/json'
      }
    });
    const boardData = await boardRes.json();

    // Step 2: Fetch all statuses
    const statusRes = await fetch(`https://${JIRA_DOMAIN}/rest/api/3/status`, {
      headers: {
        Authorization: authHeader,
        Accept: 'application/json'
      }
    });
    const statusData = await statusRes.json();

    // Step 3: Build ID => name map
    const statusIdToName = {};
    statusData.forEach(status => {
      statusIdToName[status.id] = status.name;
    });

    // Step 4: Build columns array with status names
    const columns = (boardData.columnConfig.columns || []).map(col => ({
      name: col.name,
      statusNames: (col.statuses || [])
        .map(s => statusIdToName[s.id])
        .filter(Boolean)
    }));

    console.log('📊 Board columns (resolved):', columns);

    return {
      statusCode: 200,
      body: JSON.stringify({
        name: boardData.name,
        projectKey: boardData.location.projectKey,
        boardId: boardData.id,
        columns
      })
    };

  } catch (err) {
    console.error('❌ Failed to fetch board config:', err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch board config' })
    };
  }
};
