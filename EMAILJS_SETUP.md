# EmailJS Setup Guide

## 🚀 Quick Setup Instructions

### 1. Create EmailJS Account
- Go to [https://www.emailjs.com/](https://www.emailjs.com/)
- Sign up for a free account (100 emails/month free)

### 2. Add Email Service
- Go to **Email Services** in your EmailJS dashboard
- Click **Add New Service**
- Choose your email provider (Gmail, Outlook, etc.)
- Follow the connection instructions
- **Copy the Service ID** (you'll need this)

### 3. Create Email Template
- Go to **Email Templates** in your dashboard
- Click **Create New Template**
- Use this template content:

```
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
```

- **Copy the Template ID** (you'll need this)

### 4. Get Your Public Key
- Go to **Account** → **General**
- Find your **Public Key** in the API Keys section
- **Copy the Public Key** (you'll need this)

### 5. Update Configuration
Edit `src/services/emailService.ts` and replace:

```typescript
const EMAILJS_CONFIG = {
  SERVICE_ID: 'your_service_id_here',      // Replace with your Service ID
  TEMPLATE_ID: 'your_template_id_here',    // Replace with your Template ID
  PUBLIC_KEY: 'your_public_key_here',      // Replace with your Public Key
};
```

### 6. Test Your Setup
- Fill out the contact form on your website
- Check your email (vrynyx@gmail.com) for the message
- Check EmailJS dashboard for delivery status

## 🔧 Template Variables Used

Your EmailJS template should include these variables:
- `{{from_name}}` - Sender's name
- `{{from_email}}` - Sender's email address
- `{{subject}}` - Email subject
- `{{message}}` - Email message content
- `{{to_email}}` - Your email (vrynyx@gmail.com)

## 🎯 Configuration Example

After setup, your config should look like:
```typescript
const EMAILJS_CONFIG = {
  SERVICE_ID: 'service_abc123',
  TEMPLATE_ID: 'template_xyz789',
  PUBLIC_KEY: 'user_def456ghi789',
};
```

## 🚨 Important Notes

1. **Free Tier**: 100 emails per month
2. **Security**: Public key is safe to expose in frontend code
3. **Spam Protection**: EmailJS has built-in spam protection
4. **Delivery**: Check your spam folder if emails don't arrive
5. **Testing**: Use the EmailJS dashboard to test your template

## 🔍 Troubleshooting

**Email not sending?**
- Check console for error messages
- Verify all IDs are correct
- Check EmailJS dashboard for delivery status
- Make sure template variables match exactly

**Need help?**
- EmailJS documentation: [https://www.emailjs.com/docs/](https://www.emailjs.com/docs/)
- Check the browser console for detailed error messages
