// src/lib/email.ts
import nodemailer from "nodemailer";

interface SmtpConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
}

// Create a mapping of providers
const providers: Record<string, SmtpConfig> = {
  gmail: {
    host: process.env.SMTP_GMAIL_HOST as string,
    port: Number(process.env.SMTP_GMAIL_PORT),
    user: process.env.SMTP_GMAIL_USER as string,
    pass: process.env.SMTP_GMAIL_PASS as string,
  },
  outlook: {
    host: process.env.SMTP_OUTLOOK_HOST as string,
    port: Number(process.env.SMTP_OUTLOOK_PORT),
    user: process.env.SMTP_OUTLOOK_USER as string,
    pass: process.env.SMTP_OUTLOOK_PASS as string,
  },
  yahoo: {
    host: process.env.SMTP_YAHOO_HOST as string,
    port: Number(process.env.SMTP_YAHOO_PORT),
    user: process.env.SMTP_YAHOO_USER as string,
    pass: process.env.SMTP_YAHOO_PASS as string,
  },
  mail: {
    host: process.env.SMTP_MAIL_HOST as string,
    port: Number(process.env.SMTP_MAIL_PORT),
    user: process.env.SMTP_MAIL_USER as string,
    pass: process.env.SMTP_MAIL_PASS as string,
  },
};

// Function to create a transporter based on the selected provider
export const createEmailTransporter = (provider: string = "gmail") => {
  const config = providers[provider];
  if (!config) {
    throw new Error(`SMTP configuration for provider '${provider}' not found.`);
  }
  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.port === 465, // true for SSL
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });
};
