// src/lib/email.ts
import nodemailer from "nodemailer";

interface SmtpConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
}

const getEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`Missing environment variable: ${key}`);
  return value;
};

// Create a mapping of providers
const providers: Record<string, SmtpConfig> = {
  gmail: {
    host: getEnv("SMTP_GMAIL_HOST"),
    port: Number(getEnv("SMTP_GMAIL_PORT")),
    user: getEnv("SMTP_GMAIL_USER"),
    pass: getEnv("SMTP_GMAIL_PASS"),
  },
  outlook: {
    host: getEnv("SMTP_OUTLOOK_HOST"),
    port: Number(getEnv("SMTP_OUTLOOK_PORT")),
    user: getEnv("SMTP_OUTLOOK_USER"),
    pass: getEnv("SMTP_OUTLOOK_PASS"),
  },
  yahoo: {
    host: getEnv("SMTP_YAHOO_HOST"),
    port: Number(getEnv("SMTP_YAHOO_PORT")),
    user: getEnv("SMTP_YAHOO_USER"),
    pass: getEnv("SMTP_YAHOO_PASS"),
  },
  mail: {
    host: getEnv("SMTP_MAIL_HOST"),
    port: Number(getEnv("SMTP_MAIL_PORT")),
    user: getEnv("SMTP_MAIL_USER"),
    pass: getEnv("SMTP_MAIL_PASS"),
  },
};

// Create transporter
export const createEmailTransporter = (provider: keyof typeof providers = "gmail") => {
  const config = providers[provider];
  if (!config) {
    throw new Error(`SMTP configuration for provider '${provider}' not found.`);
  }

  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.port === 465, // SSL/TLS only if port is 465
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });
};
