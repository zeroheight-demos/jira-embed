const fetch = require('node-fetch');

const JIRA_DOMAIN = process.env.JIRA_DOMAIN;
const JIRA_EMAIL = process.env.JIRA_EMAIL;
const JIRA_TOKEN = process.env.JIRA_TOKEN;
const BOARD_NAME = process.env.BOARD_NAME;

exports.handler = async function (event, context) {
  const jql = `project=${BOARD_NAME} ORDER BY created DESC`; 
  const url = `https://${JIRA_DOMAIN}/rest/api/3/search?jql=${encodeURIComponent(jql)}&maxResults=1000`;


  const authHeader = 'Basic ' + Buffer.from(`${JIRA_EMAIL}:${JIRA_TOKEN}`).toString('base64');

  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/json'
      }
    });

    const data = await response.json();

    // Log full response for debugging
    console.log('🔍 JIRA API response keys:', Object.keys(data));
    if (!data.issues || !Array.isArray(data.issues)) {
      console.error('❌ No issues found in JIRA response:', data);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'No issues returned from JIRA', response: data })
      };
    }

    // ✅ Return only the issues array
    return {
      statusCode: 200,
      body: JSON.stringify({ issues: data.issues })
    };

  } catch (e) {
    console.error('❌ Failed to fetch issues:', e.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'JIRA fetch failed', details: e.message })
    };
  }
};
