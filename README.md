# Lab-AI-Finance

**Which AI tool for your Finance team?**

An interactive web application that analyses a Finance team's context and recommends the most suitable AI tool — with personalised analysis, task mapping, operational prompts (FR/EN), and PDF export.

🔗 **Live:** [coming soon]

## What it does

1. Answer a few questions about your Finance team context
2. Get a personalised AI tool recommendation
3. See which tasks are best handled by the recommended tool
4. Copy ready-to-use Finance prompts (FR/EN)
5. Export your results as a PDF

## Tech stack

- **Frontend:** React 19 + Vite + Tailwind CSS
- **Anti-bot:** Cloudflare Turnstile
- **PDF export:** html2pdf.js
- **Hosting:** Railway

## Local setup

```bash
git clone https://github.com/AugustinDuret/lab-ai-finance
cd lab-ai-finance
npm install
cp .env.example .env.local
# Add your Cloudflare Turnstile site key in .env.local
npm run dev
```

## Environment variables

| Variable | Description | Required |
|---|---|---|
| `VITE_TURNSTILE_SITE_KEY` | Cloudflare Turnstile public site key | Yes |

## About

Built by [Augustin Duret](https://www.linkedin.com/in/augustin-duret) — Finance & AI consultant at Australe.

## Licence

All rights reserved.
