# 🧠 Lab-AI-Finance

**Which AI tool for your Finance team?**

An interactive web tool that analyses your Finance team's context — IT ecosystem,
daily tasks, budget, data sensitivity, and delivers a personalised AI tool
recommendation with concrete prompt examples and a PDF export.

Built by [Augustin Duret](https://www.linkedin.com/in/augustin-duret) as part
of an ongoing exploration at the intersection of Finance and AI.

---

## What it does

Most Finance teams know they should be using AI — but don't know where to start
or which tool actually fits their context. Generic comparisons aren't enough.

**Lab-AI-Finance** asks the right questions and gives a personalised answer:

- 🏢 Your IT environment (Microsoft 365, Google Workspace, mixed)
- 📋 Your Finance tasks (FP&A, M&A, audit, management control, BI...)
- 💰 Your budget per person per month
- 🔒 Your data sensitivity and GDPR requirements

And recommends the tool that fits **your** context — not a generic ranking.

---

## Output

For each recommendation, you get:

- ✅ Compatibility score (out of 100)
- 💡 Personalised reasons why this tool fits your context
- 📌 Task mapping (Excellent / Good / Limited for each of your selected tasks)
- 📝 Ready-to-use Finance prompt examples (FR/EN)
- ⚠️ Limitations specific to your context
- 💶 Budget breakdown (Free / Pro / Enterprise)
- 🔒 GDPR status
- 🚀 3 concrete steps to get started
- 📄 PDF export of the full recommendation

A second option is available as a collapsible section.

---

## Tools covered

| Tool | Best for |
|------|----------|
| Microsoft Copilot M365 | Teams on Microsoft 365 |
| Claude (Anthropic) | Complex analysis, long documents, M&A |
| ChatGPT (OpenAI) | Versatile everyday use |
| Gemini (Google) | Teams on Google Workspace |
| Mistral Le Chat Pro | GDPR-critical / EU data sovereignty |

---

## Tech stack

- **React** (Vite)
- **Tailwind CSS** with custom dark theme
- **html2pdf.js** for PDF export
- **Custom i18n** (FR/EN) with flag switcher
- **No backend** — 100% frontend logic
- **Railway** deployment

---

## Run locally
```bash
git clone https://github.com/your-username/Lab-AI-Finance
cd Lab-AI-Finance
npm install
npm run dev
```

---

## About

Built by **Augustin Duret** - Finance & AI consultant.
Want to discuss AI adoption for your Finance team?

👉 [linkedin.com/in/augustin-duret](https://www.linkedin.com/in/augustin-duret)
