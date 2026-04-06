# Deltatec modern website

A fast multi-page marketing site with Netlify-ready deployment and contact notifications.

## Local run (Express)

```bash
npm install
cp .env.example .env
npm start
```

Open `http://localhost:3000`.

## Netlify deployment

This repository is configured for Netlify:

- Static site publish directory: `public`
- Serverless functions directory: `netlify/functions`
- `POST /api/contact` is redirected to `/.netlify/functions/contact`

Add all variables from `.env.example` to **Netlify Site Settings → Environment variables**.

## Contact integration

`POST /api/contact` sends:

1. An email via SMTP (`nodemailer`)
2. An SMS notification via Twilio (`twilio`)
