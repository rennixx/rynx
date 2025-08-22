import emailjs from '@emailjs/browser';
import type { ContactForm } from '../types';

// EmailJS configuration - Update these with your actual values
const EMAILJS_CONFIG = {
  SERVICE_ID: import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_k87eo4l', // Replace with your EmailJS service ID
  TEMPLATE_ID: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_4c7hfbu', // Replace with your EmailJS template ID
  PUBLIC_KEY: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'xiIx6izUudkvOOtNN', // Replace with your EmailJS public key
};

// Initialize EmailJS
emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);

export const sendContactEmail = async (formData: ContactForm): Promise<void> => {
  try {
    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      subject: formData.subject,
      message: formData.message,
      to_email: 'vrynyx@gmail.com', // Your email address
      reply_to: formData.email,
    };

    const result = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATE_ID,
      templateParams
    );

    if (result.status !== 200) {
      throw new Error('Failed to send email');
    }

    console.log('Email sent successfully:', result);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

// Configuration helper for setup
export const getEmailJSSetupInstructions = () => {
  return {
    instructions: [
      '1. Go to https://www.emailjs.com/ and create a free account',
      '2. Create an email service (Gmail, Outlook, etc.)',
      '3. Create an email template with these variables:',
      '   - {{from_name}} - Sender name',
      '   - {{from_email}} - Sender email',
      '   - {{subject}} - Email subject',
      '   - {{message}} - Email message',
      '   - {{to_email}} - Your email (vrynyx@gmail.com)',
      '4. Get your Service ID, Template ID, and Public Key',
      '5. Update the EMAILJS_CONFIG in src/services/emailService.ts',
    ],
    templateExample: `
Subject: New Contact Form Message: {{subject}}

Hello,

You have received a new message from your portfolio contact form:

Name: {{from_name}}
Email: {{from_email}}
Subject: {{subject}}

Message:
{{message}}

---
This message was sent from your portfolio website.
Reply directly to: {{from_email}}
    `,
  };
};
