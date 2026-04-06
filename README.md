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


## Easy CMS abilities

A lightweight no-build CMS is included (now password protected and page-aware):

- Visit `/admin` and unlock with the CMS password.
- Click **Save locally** to preview changes immediately in your browser.
- Click **Download JSON** to export content updates.
- Replace `public/data/content.json` with your exported JSON and redeploy to publish globally.
- Update `admin.passwordHash` in `public/data/content.json` to change the CMS password.

This gives non-technical teams simple content updates without editing HTML files, including per-page title/intro/CTA attributes for each solution page.


## Image placeholders

- Every page now includes a text-only visual placeholder block (no binary assets).
- This avoids PR tooling issues with binary files while preserving layout space.
- Replace each placeholder block with your real hosted images when ready.
