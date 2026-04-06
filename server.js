require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const twilio = require('twilio');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public', { extensions: ['html'] }));

const requiredVars = [
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_USER',
  'SMTP_PASS',
  'CONTACT_TO_EMAIL',
  'TWILIO_ACCOUNT_SID',
  'TWILIO_AUTH_TOKEN',
  'TWILIO_FROM',
  'TWILIO_TO'
];

function validatePayload(payload = {}) {
  const errors = [];
  if (!payload.name || payload.name.trim().length < 2) errors.push('Name is required.');
  if (!payload.email || !/^\S+@\S+\.\S+$/.test(payload.email)) errors.push('Valid email is required.');
  if (!payload.message || payload.message.trim().length < 10) errors.push('Message should be at least 10 characters.');
  return errors;
}

app.post('/api/contact', async (req, res) => {
  const errors = validatePayload(req.body);
  if (errors.length) {
    return res.status(400).json({ ok: false, errors });
  }

  const missing = requiredVars.filter((v) => !process.env[v]);
  if (missing.length) {
    return res.status(500).json({
      ok: false,
      error: `Server is missing environment variables: ${missing.join(', ')}`
    });
  }

  const { name, email, phone = '', projectType = '', message } = req.body;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  const text = [
    'New website enquiry',
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone || 'Not provided'}`,
    `Project type: ${projectType || 'Not provided'}`,
    'Message:',
    message
  ].join('\n');

  try {
    await transporter.sendMail({
      from: `Deltatec Website <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_TO_EMAIL,
      replyTo: email,
      subject: `New Deltatec enquiry from ${name}`,
      text
    });

    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    await client.messages.create({
      body: `New Deltatec lead: ${name} (${email}) - ${projectType || 'General enquiry'}`,
      from: process.env.TWILIO_FROM,
      to: process.env.TWILIO_TO
    });

    return res.json({ ok: true, message: 'Thanks. Your message has been sent by email and SMS notification.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: 'Unable to send message right now.' });
  }
});

app.listen(port, () => {
  console.log(`Deltatec site running on http://localhost:${port}`);
});
