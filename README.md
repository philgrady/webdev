# Stourport Solar & EV Website

Static marketing site for a Stourport-area solar panel, battery, and EV charger installation company.

## Local preview

```bash
python3 -m http.server 4173 --bind 127.0.0.1
```

Open `http://127.0.0.1:4173` in your browser.

## Host on Netlify (recommended)

This repository includes `netlify.toml`, so deployment is plug-and-play.

1. Push this repo to GitHub/GitLab/Bitbucket.
2. In Netlify, click **Add new site** → **Import an existing project**.
3. Choose your Git provider and select this repository.
4. Leave build command blank and publish directory as `.` (root).
5. Click **Deploy site**.
6. After first deploy, set your production domain to `www.stourportsolarandev.co.uk` and add the DNS records Netlify provides.

## DNS checklist

- Create/verify `www` CNAME to your Netlify target.
- Set apex/root domain redirect to `www` (or use ALIAS/ANAME depending on DNS provider).
- Enable HTTPS in Netlify (automatic certificate via Let's Encrypt).

## Included SEO files

- `robots.txt`
- `sitemap.xml`

After going live, submit `https://www.stourportsolarandev.co.uk/sitemap.xml` in Google Search Console.
