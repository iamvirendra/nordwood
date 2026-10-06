import nodemailer from 'nodemailer';

export function createMailer(config) {
  if (!config.smtp) return null;
  const { from, ...options } = config.smtp;
  const transport = nodemailer.createTransport({ ...options, connectionTimeout: 10000, greetingTimeout: 10000, socketTimeout: 15000 });
  return async ({ email, token }) => {
    // Fragment prevents the secret entering access logs or Referer headers.
    const link = `${config.origin}/reset-password#token=${encodeURIComponent(token)}`;
    await transport.sendMail({
      from, to: email, subject: 'Reset your NordWood password',
      text: `A password reset was requested for your NordWood account.\n\nChoose a new password: ${link}\n\nThis link expires in 30 minutes and works once. If you did not request this, you can ignore this email.\n\nNordWood`,
      html: `<div style="font-family:Arial,sans-serif;background:#f4f0e6;padding:32px;color:#373c38"><h1 style="font-family:Georgia,serif">NordWood</h1><h2>A fresh start.</h2><p>Choose a new password for your account.</p><p><a href="${link}" style="display:inline-block;padding:14px 22px;background:#373c38;color:#f4f0e6;text-decoration:none">Reset your password</a></p><p>This link expires in 30 minutes and works once.</p><p>If you did not request this, you can ignore this email.</p></div>`,
    });
  };
}
