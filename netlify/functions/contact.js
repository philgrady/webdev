const nodemailer = require('nodemailer');
const twilio = require('twilio');

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

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ ok: false, error: 'Method not allowed.' })
    };
  }

  const payload = JSON.parse(event.body || '{}');
  const errors = validatePayload(payload);
  if (errors.length) {
    return {
      statusCode: 400,
      body: JSON.stringify({ ok: false, errors })
    };
  }

  const missing = requiredVars.filter((v) => !process.env[v]);
  if (missing.length) {
    return {
      statusCode: 500,
      body: JSON.stringify({ ok: false, error: `Server is missing environment variables: ${missing.join(', ')}` })
    };
  }

  const { name, email, phone = '', projectType = '', message } = payload;

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

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true, message: 'Thanks. Your message has been sent by email and SMS notification.' })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ ok: false, error: 'Unable to send message right now.' })
    };
  }
};
