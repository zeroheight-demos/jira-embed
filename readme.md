# 🧩 Jira Board Viewer (Netlify)

This is a simple embedded Jira board viewer that displays issues grouped into columns based on their current status—perfect for dashboards, Notion embeds, and status pages.

## 🚀 Features

- Pulls issues from a Jira board via the Jira Cloud API
- Groups issues into columns based on board configuration
- Fully client-side rendered (JS/HTML)
- Deployable via Netlify Functions (serverless)
- Embeddable via `<iframe>` with horizontal scrolling

---

## 📦 Project Structure

```
.
├── index.html                # Frontend: HTML/JS for rendering Jira board
└── netlify/functions/
    ├── jira.js              # Netlify Function: Fetch Jira issues
    └── board.js             # Netlify Function: Fetch board config & column mapping
```

---

## 🧰 Requirements

- [Netlify CLI](https://docs.netlify.com/cli/get-started/)
- A **Jira Cloud** account with access to a **board**
- A [Jira API token](https://id.atlassian.com/manage-profile/security/api-tokens)
- Node.js v18+ recommended

---

## 🛠 Setup

### 1. Clone and install

```bash
git clone https://github.com/your-username/jira-board-viewer.git
cd jira-board-viewer
npm install
```

### 2. Set environment variables

Create a `.env` file at the root of the project with the following:

```bash
JIRA_DOMAIN=yourdomain.atlassian.net
JIRA_EMAIL=your-email@example.com
JIRA_TOKEN=your_api_token
BOARD_ID=your_board_id
```

You can find the board ID by visiting your Jira board and copying the number at the end of the URL:
```
https://yourdomain.atlassian.net/jira/software/c/projects/XYZ/boards/1234
                                                   👆 BOARD_ID
```

> You can also set these env vars in the Netlify dashboard under **Site Settings → Environment Variables**.

---

### 3. Run locally

```bash
npx netlify dev
```

Visit [http://localhost:8888](http://localhost:8888) to view your board.

---

### 4. Deploy to Netlify

If you haven’t already:

```bash
npx netlify login
npx netlify init
```

Then deploy:

```bash
npx netlify deploy --prod
```

After deployment, you'll get a live URL like:  
`https://your-site-name.netlify.app`

---

## 🔗 Embedding the board

You can embed the deployed board into any site (e.g. Notion, Confluence) with an `<iframe>`:

```html
<iframe
  src="https://your-site-name.netlify.app"
  width="100%"
  height="600"
  style="border: none; overflow: auto;"
></iframe>
```

---

## 🙋‍♀️ Troubleshooting

- If your board loads but shows no issues:
  - Make sure the correct **board ID** is used.
  - Ensure your API token has permission to view the board/issues.
- For CORS errors in local dev, use `netlify dev` (not just `npm run`).

---

## 📃 License

MIT – use it freely and modify as you like.
